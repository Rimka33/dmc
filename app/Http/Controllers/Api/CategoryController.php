<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Liste toutes les catégories actives
     */
    public function index()
    {
        $categories = Category::where('is_active', true)
            ->withCount('products')
            ->orderByRaw('CASE WHEN sort_order = 0 OR sort_order IS NULL THEN 1 ELSE 0 END, sort_order ASC')
            ->orderBy('name', 'asc')
            ->get();

        return CategoryResource::collection($categories);
    }

    /**
     * Affiche une catégorie avec ses produits
     */
    public function show(Request $request, $slug)
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->withCount('products')
            ->firstOrFail();

        // Récupérer les produits de cette catégorie
        $query = $category->products()
            ->with(['images', 'category'])
            ->where('is_active', true)
            ->inStock();

        // Filtre de prix
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $products = $query->paginate(12);

        return response()->json([
            'category' => new CategoryResource($category),
            'products' => ProductResource::collection($products),
            'meta' => [
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
            ],
        ]);
    }
}
