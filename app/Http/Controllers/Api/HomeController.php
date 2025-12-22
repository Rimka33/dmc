<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\SpecialOffer;

class HomeController extends Controller
{
    public function index()
    {
        $categories = Category::where('is_active', true)
            ->orderBy('sort_order')
            ->limit(7)
            ->get();

        $featuredProducts = Product::with(['images', 'category'])
            ->where('is_featured', true)
            ->where('is_active', true)
            ->limit(8)
            ->get();

        $specialOffers = SpecialOffer::with(['product.images', 'product.category', 'product.features'])
            ->where('is_active', true)
            ->where('end_date', '>', now())
            ->limit(3)
            ->get();

        return response()->json([
            'categories' => CategoryResource::collection($categories),
            'featuredProducts' => ProductResource::collection($featuredProducts),
            'specialOffers' => $specialOffers->map(function($offer) {
                return [
                    'id' => $offer->id,
                    'product_id' => $offer->product_id,
                    'name' => $offer->product->name,
                    'slug' => $offer->product->slug,
                    'sku' => $offer->product->sku,
                    'price_formatted' => number_format($offer->product->finalPrice, 0, ',', '.') . ' FCFA',
                    'old_price_formatted' => $offer->product->hasDiscount ? number_format($offer->product->price, 0, ',', '.') . ' FCFA' : null,
                    'has_discount' => $offer->product->hasDiscount,
                    'discount_percentage' => $offer->product->discount_percentage,
                    'primary_image' => $offer->product->primaryImage ? asset($offer->product->primaryImage->image_path) : asset('images/products/default.png'),
                    'category_name' => $offer->product->category->name,
                    'stock_quantity' => $offer->product->stock_quantity,
                    'is_on_sale' => $offer->product->is_on_sale,
                    'features' => $offer->product->features->pluck('feature')->toArray(),
                    'end_date' => $offer->end_date->toISOString(),
                    'available_stock' => $offer->available_stock,
                    'total_stock' => $offer->total_stock,
                    'sold_percentage' => $offer->total_stock > 0 ? (($offer->total_stock - $offer->available_stock) / $offer->total_stock) * 100 : 0,
                ];
            })
        ]);
    }

    /**
     * Retourne uniquement les offres spéciales actives
     */
    public function specialOffers()
    {
        $specialOffers = SpecialOffer::with(['product.images', 'product.category', 'product.features'])
            ->where('is_active', true)
            ->where('end_date', '>', now())
            ->get();

        return response()->json([
            'data' => $specialOffers->map(function($offer) {
                return [
                    'id' => $offer->id,
                    'product_id' => $offer->product_id,
                    'name' => $offer->product->name,
                    'slug' => $offer->product->slug,
                    'sku' => $offer->product->sku,
                    'price_formatted' => number_format($offer->product->finalPrice, 0, ',', '.') . ' FCFA',
                    'old_price_formatted' => $offer->product->hasDiscount ? number_format($offer->product->price, 0, ',', '.') . ' FCFA' : null,
                    'has_discount' => $offer->product->hasDiscount,
                    'discount_percentage' => $offer->product->discount_percentage,
                    'primary_image' => $offer->product->primaryImage ? asset($offer->product->primaryImage->image_path) : asset('images/products/default.png'),
                    'category_name' => $offer->product->category->name,
                    'stock_quantity' => $offer->product->stock_quantity,
                    'is_on_sale' => $offer->product->is_on_sale,
                    'features' => $offer->product->features->pluck('feature')->toArray(),
                    'end_date' => $offer->end_date->toISOString(),
                    'available_stock' => $offer->available_stock,
                    'total_stock' => $offer->total_stock,
                    'sold_percentage' => $offer->total_stock > 0 ? (($offer->total_stock - $offer->available_stock) / $offer->total_stock) * 100 : 0,
                ];
            })
        ]);
    }

    /**
     * Gère l'envoi du formulaire de contact
     */
    public function contact(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // Simuler le succès
        return response()->json([
            'success' => true,
            'message' => 'Votre message a été envoyé avec succès.'
        ]);
    }
}
