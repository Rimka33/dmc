<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ProductController extends Controller
{
    #[OA\Get(path: '/api/products', summary: 'Liste tous les produits avec filtres et pagination', tags: ['Products'])]
    #[OA\Parameter(name: 'search', description: 'Terme de recherche', in: 'query', required: false)]
    #[OA\Response(response: 200, description: 'Opération réussie')]
    public function index(Request $request)
    {
        $query = Product::with(['images', 'category'])
            ->where('is_active', true)
            ->inStock();

        // Filtres
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('description', 'like', '%'.$request->search.'%')
                    ->orWhere('sku', 'like', '%'.$request->search.'%');
            });
        }

        // Paramètre optionnel pour voir aussi les ruptures (si besoin un jour)
        if ($request->has('show_out_of_stock') && $request->show_out_of_stock) {
            // Ne fait rien, on garde le query initial sans inStock() ?
            // En fait, on a mis inStock() par défaut au début.
            // Repartons sur un query propre :
            $query = Product::with(['images', 'category'])->where('is_active', true);
        }

        if ($request->has('on_sale')) {
            $query->where('is_on_sale', true);
        }

        // Tri
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $products = $query->paginate($request->get('per_page', 12));

        return new ProductCollection($products);
    }

    #[OA\Get(path: '/api/products/featured', summary: 'Produits mis en avant', tags: ['Products'])]
    #[OA\Response(response: 200, description: 'Succès')]
    /**
     * Produits mis en avant
     */
    public function featured()
    {
        $products = Product::with(['images', 'category'])
            ->where('is_active', true)
            ->where('is_featured', true)
            ->inStock()
            ->limit(8)
            ->get();

        return ProductResource::collection($products);
    }

    #[OA\Get(path: '/api/products/new', summary: 'Nouveaux produits', tags: ['Products'])]
    #[OA\Response(response: 200, description: 'Succès')]
    /**
     * Nouveaux produits
     */
    public function new()
    {
        $products = Product::with(['images', 'category'])
            ->where('is_active', true)
            ->where('is_new', true)
            ->inStock()
            ->latest()
            ->limit(8)
            ->get();

        return ProductResource::collection($products);
    }

    #[OA\Get(path: '/api/products/on-sale', summary: 'Produits en promotion', tags: ['Products'])]
    #[OA\Response(response: 200, description: 'Succès')]
    /**
     * Produits en promotion
     */
    public function onSale()
    {
        $products = Product::with(['images', 'category'])
            ->where('is_active', true)
            ->where('is_on_sale', true)
            ->whereNotNull('discount_price')
            ->inStock()
            ->limit(8)
            ->get();

        return ProductResource::collection($products);
    }

    #[OA\Get(path: '/api/products/{id}', summary: 'Détails d un produit', tags: ['Products'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID du produit')]
    #[OA\Response(response: 200, description: 'Succès')]
    #[OA\Response(response: 404, description: 'Produit non trouvé')]
    /**
     * Détails d'un produit
     */
    public function show($id)
    {
        $product = Product::with(['category', 'images', 'features'])
            ->where('is_active', true)
            ->findOrFail($id);

        // Produits similaires
        $relatedProducts = Product::with(['images'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->inStock()
            ->limit(4)
            ->get();

        return response()->json([
            'product' => new ProductResource($product),
            'related_products' => ProductResource::collection($relatedProducts),
        ]);
    }

    #[OA\Get(path: '/api/products/search', summary: 'Recherche de produits', tags: ['Products'])]
    #[OA\Parameter(name: 'q', in: 'query', required: true, description: 'Terme de recherche')]
    #[OA\Response(response: 200, description: 'Succès')]
    /**
     * Recherche de produits
     */
    public function search(Request $request)
    {
        $query = $request->get('q', '');

        if (empty($query)) {
            return response()->json([
                'data' => [],
                'message' => 'Veuillez fournir un terme de recherche',
            ], 400);
        }

        $products = Product::with(['images', 'category'])
            ->where('is_active', true)
            ->inStock()
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', '%'.$query.'%')
                    ->orWhere('description', 'like', '%'.$query.'%')
                    ->orWhere('sku', 'like', '%'.$query.'%')
                    ->orWhere('brand', 'like', '%'.$query.'%');
            })
            ->limit(10)
            ->get();

        return ProductResource::collection($products);
    }
}
