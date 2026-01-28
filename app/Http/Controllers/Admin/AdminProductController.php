<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with('category', 'images')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Create', [
            'categories' => Category::all(),
        ]);
    }

    public function show($id)
    {
        $product = Product::with(['category', 'images'])->findOrFail($id);

        return Inertia::render('Admin/Products/Show', [
            'product' => $product,
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
            'images.*' => 'file|mimes:jpeg,png,jpg,webp,mp4,mov,avi,webm|max:51200', // Max 50MB, added video support
        ]);

        // 2. Traitement du slug et SKU
        $validated['slug'] = Str::slug($validated['name']);
        if (empty($validated['sku'])) {
            $validated['sku'] = null; // Important pour l'unicité
        }

        // 3. Création du produit
        $product = Product::create($validated);

        // 4. Gestion des Tags
        if (! empty($request->tags)) {
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
            'categories' => Category::all(),
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
            'sku' => 'nullable|string|unique:products,sku,'.$product->id,
            'is_active' => 'boolean',
            'tags' => 'nullable|string',
            'new_images.*' => 'file|mimes:jpeg,png,jpg,webp,mp4,mov,avi,webm|max:51200',
            'deleted_images' => 'nullable|array',
            'deleted_images.*' => 'exists:product_images,id',
            'primary_image_id' => 'nullable|exists:product_images,id',
            'primary_image_new_index' => 'nullable|integer',
        ]);

        // 1. Mise à jour des informations de base
        $product->update($validated);

        // 2. Gestion des suppressions d'images
        if ($request->has('deleted_images')) {
            foreach ($request->deleted_images as $imageId) {
                $image = $product->images()->find($imageId);
                if ($image) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($image->image_path);
                    $image->delete();
                }
            }
        }

        $newPrimaryImageId = null;

        // 3. Gestion des nouvelles images
        if ($request->hasFile('new_images')) {
            $lastOrder = $product->images()->max('sort_order') ?? -1;
            foreach ($request->file('new_images') as $index => $image) {
                $path = $image->store('products', 'public');
                $isPrimary = ($request->primary_image_new_index !== null && (int) $request->primary_image_new_index === $index);

                $createdImage = $product->images()->create([
                    'image_path' => $path,
                    'is_primary' => $isPrimary,
                    'sort_order' => $lastOrder + $index + 1,
                ]);

                if ($isPrimary) {
                    $newPrimaryImageId = $createdImage->id;
                }
            }
        }

        // 4. Gestion de l'image principale
        if ($request->primary_image_id) {
            $product->images()->update(['is_primary' => false]);
            $product->images()->where('id', $request->primary_image_id)->update(['is_primary' => true]);
        } elseif ($newPrimaryImageId) {
            $product->images()->where('id', '!=', $newPrimaryImageId)->update(['is_primary' => false]);
        }

        // Sécurité: s'assurer qu'au moins une image est principale s'il reste des images
        if ($product->images()->count() > 0 && ! $product->images()->where('is_primary', true)->exists()) {
            $product->images()->orderBy('sort_order')->first()->update(['is_primary' => true]);
        }

        return redirect()->route('admin.products.index')->with('success', 'Produit mis à jour avec succès.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Produit supprimé.');
    }
}
