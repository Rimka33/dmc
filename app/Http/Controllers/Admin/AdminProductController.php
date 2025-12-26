<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with('category', 'images')
            ->when($request->search, function($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('sku', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Create', [
            'categories' => Category::all()
        ]);
    }

    public function show($id)
    {
        $product = Product::with(['category', 'images'])->findOrFail($id);
        
        return Inertia::render('Admin/Products/Show', [
            'product' => $product
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validation de base
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'sku' => 'nullable|string|unique:products,sku',
            'is_active' => 'boolean',
            'tags' => 'nullable|string', // JSON string
            'images.*' => 'file|mimes:jpeg,png,jpg,webp,mp4,mov,avi,webm|max:51200' // Max 50MB, added video support
        ]);

        // 2. Traitement du slug et SKU
        $validated['slug'] = Str::slug($validated['name']);
        if (empty($validated['sku'])) {
            $validated['sku'] = null; // Important pour l'unicité
        }

        // 3. Création du produit
        $product = Product::create($validated);

        // 4. Gestion des Tags
        if (!empty($request->tags)) {
            $tags = json_decode($request->tags, true);
            if (is_array($tags)) {
                // Logique simplifiée pour les tags : on les stocke dans une table liée ou JSON column
                // Pour l'instant, supposons une relation ProductTag ou un champ JSON 'tags' sur le produit
                // Si la colonne 'tags' existe en JSON sur Product :
                // $product->update(['tags' => $tags]);
                
                // OU création de modèles liés (implémentation future selon vos modèles)
            }
        }

        // 5. Gestion des Images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products', 'public');
                $product->images()->create([
                    'image_path' => $path,
                    'is_primary' => $index === 0,
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Produit créé avec succès.');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product->load('images', 'features'),
            'categories' => Category::all()
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'sku' => 'nullable|string|unique:products,sku,' . $product->id,
            'is_active' => 'boolean',
        ]);

        $product->update($validated);

        return redirect()->route('admin.products.index')->with('success', 'Produit mis à jour.');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Produit supprimé.');
    }
}
