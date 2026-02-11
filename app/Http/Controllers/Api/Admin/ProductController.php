<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductFeature;
use App\Models\ProductImage;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Liste tous les produits (admin)
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images']);

        // Filtres
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        if ($request->has('stock_status')) {
            $query->where('stock_status', $request->stock_status);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('sku', 'like', '%'.$request->search.'%');
            });
        }

        $products = $query->latest()->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($products),
            'meta' => [
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
            ],
        ]);
    }

    /**
     * Créer un nouveau produit
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100|unique:products',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'stock_quantity' => 'required|integer|min:0',
            'brand' => 'nullable|string|max:100',
            'is_featured' => 'boolean',
            'is_new' => 'boolean',
            'is_on_sale' => 'boolean',
            'is_active' => 'boolean',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
        ]);

        // Générer le slug
        $validated['slug'] = Str::slug($validated['name']);

        // Déterminer le statut du stock
        $validated['stock_status'] = $validated['stock_quantity'] > 10 ? 'in_stock' :
            ($validated['stock_quantity'] > 0 ? 'low_stock' : 'out_of_stock');

        $product = Product::create($validated);

        // Ajouter les features
        if ($request->has('features')) {
            foreach ($request->features as $index => $feature) {
                ProductFeature::create([
                    'product_id' => $product->id,
                    'feature' => $feature,
                    'order' => $index,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Produit créé avec succès',
            'data' => new ProductResource($product->load(['category', 'images', 'features'])),
        ], 201);
    }

    /**
     * Afficher un produit
     */
    public function show($id)
    {
        $product = Product::with(['category', 'images', 'features'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new ProductResource($product),
        ]);
    }

    /**
     * Mettre à jour un produit
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'name' => 'sometimes|required|string|max:255',
            'sku' => 'nullable|string|max:100|unique:products,sku,'.$id,
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'sometimes|required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'stock_quantity' => 'sometimes|required|integer|min:0',
            'brand' => 'nullable|string|max:100',
            'is_featured' => 'boolean',
            'is_new' => 'boolean',
            'is_on_sale' => 'boolean',
            'is_active' => 'boolean',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
        ]);

        // Mettre à jour le slug si le nom change
        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Mettre à jour le statut du stock si la quantité change
        if (isset($validated['stock_quantity'])) {
            $validated['stock_status'] = $validated['stock_quantity'] > 10 ? 'in_stock' :
                ($validated['stock_quantity'] > 0 ? 'low_stock' : 'out_of_stock');
        }

        $product->update($validated);

        if (isset($validated['stock_status']) && in_array($validated['stock_status'], ['low_stock', 'out_of_stock'])) {
            NotificationService::notifyLowStock($product);
        }

        // Mettre à jour les features
        if ($request->has('features')) {
            $product->features()->delete();
            foreach ($request->features as $index => $feature) {
                ProductFeature::create([
                    'product_id' => $product->id,
                    'feature' => $feature,
                    'order' => $index,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Produit mis à jour avec succès',
            'data' => new ProductResource($product->fresh(['category', 'images', 'features'])),
        ]);
    }

    /**
     * Supprimer un produit (soft delete)
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produit supprimé avec succès',
        ]);
    }

    /**
     * Upload d'image pour un produit
     */
    public function uploadImage(Request $request, $id)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'is_primary' => 'boolean',
        ]);

        $product = Product::findOrFail($id);

        // Upload de l'image
        $image = $request->file('image');
        $filename = time().'_'.Str::random(10).'.'.$image->getClientOriginalExtension();
        $path = $image->storeAs('products', $filename, 'public');

        // Si c'est l'image principale, retirer le flag des autres
        if ($request->is_primary) {
            ProductImage::where('product_id', $id)->update(['is_primary' => false]);
        }

        // Créer l'entrée
        $productImage = ProductImage::create([
            'product_id' => $id,
            'image_path' => 'storage/'.$path,
            'is_primary' => $request->is_primary ?? false,
            'order' => ProductImage::where('product_id', $id)->count(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Image uploadée avec succès',
            'data' => [
                'id' => $productImage->id,
                'path' => asset($productImage->image_path),
                'is_primary' => $productImage->is_primary,
            ],
        ], 201);
    }

    /**
     * Supprimer une image
     */
    public function deleteImage($productId, $imageId)
    {
        $image = ProductImage::where('product_id', $productId)
            ->where('id', $imageId)
            ->firstOrFail();

        // Supprimer le fichier
        if (Storage::disk('public')->exists(str_replace('storage/', '', $image->image_path))) {
            Storage::disk('public')->delete(str_replace('storage/', '', $image->image_path));
        }

        $image->delete();

        return response()->json([
            'success' => true,
            'message' => 'Image supprimée avec succès',
        ]);
    }
}
