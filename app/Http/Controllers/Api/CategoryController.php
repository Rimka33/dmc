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
            ->orderBy('sort_order')
            ->get();

        return CategoryResource::collection($categories);
    }

    /**
     * Affiche une catégorie avec ses produits
     */
    public function show($slug)
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->withCount('products')
            ->firstOrFail();

        // Récupérer les produits de cette catégorie
        $products = $category->products()
            ->with(['images', 'category'])
            ->where('is_active', true)
            ->inStock()
            ->paginate(12);

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
