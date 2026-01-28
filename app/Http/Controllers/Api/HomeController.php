<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\SpecialOffer;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        // 1. Catégories actives (pour l'affichage en grille sur la home)
        $categories = Category::where('is_active', true)
            ->orderByRaw('CASE WHEN sort_order = 0 OR sort_order IS NULL THEN 1 ELSE 0 END, sort_order ASC')
            ->orderBy('name', 'asc')
            // On remonte davantage de catégories pour inclure les nouvelles
            ->limit(20)
            ->get();

        // 2. Produits en vedette depuis la collection "featured"
        $featuredCollection = Collection::where('type', 'featured')
            ->where('is_active', true)
            ->first();

        $featuredProducts = collect();
        if ($featuredCollection) {
            $featuredProducts = $featuredCollection->products()
                ->with(['images', 'category'])
                ->where('is_active', true)
                ->limit($featuredCollection->limit ?? 8)
                ->get();
        } else {
            // Fallback: utiliser les produits avec is_featured si aucune collection n'existe
            $featuredProducts = Product::with(['images', 'category'])
                ->where('is_featured', true)
                ->where('is_active', true)
                ->limit(8)
                ->get();
        }

        // 3. Nouveautés depuis la collection "new"
        $newCollection = Collection::where('type', 'new')
            ->where('is_active', true)
            ->first();

        $newProducts = collect();
        if ($newCollection) {
            $newProducts = $newCollection->products()
                ->with(['images', 'category'])
                ->where('is_active', true)
                ->limit($newCollection->limit ?? 8)
                ->get();
        } else {
            // Fallback: utiliser les produits avec is_new si aucune collection n'existe
            $newProducts = Product::with(['images', 'category'])
                ->where('is_new', true)
                ->where('is_active', true)
                ->latest()
                ->limit(8)
                ->get();
        }

        // 4. Offres spéciales depuis la collection "special_offers" ou SpecialOffer
        $specialOffersCollection = Collection::where('type', 'special_offers')
            ->where('is_active', true)
            ->first();

        $specialOffers = collect();
        if ($specialOffersCollection) {
            $specialOffers = $specialOffersCollection->products()
                ->with(['images', 'category', 'features'])
                ->where('is_active', true)
                ->limit($specialOffersCollection->limit ?? 3)
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'product_id' => $product->id,
                        'name' => $product->name,
                        'slug' => $product->slug,
                        'sku' => $product->sku,
                        'price_formatted' => number_format($product->finalPrice, 0, ',', '.').' FCFA',
                        'old_price_formatted' => $product->hasDiscount ? number_format($product->price, 0, ',', '.').' FCFA' : null,
                        'has_discount' => $product->hasDiscount,
                        'discount_percentage' => $product->discount_percentage,
                        'primary_image' => $product->primaryImage ? $product->primaryImage->url : asset('images/products/default.png'),
                        'category_name' => $product->category->name ?? '',
                        'stock_quantity' => $product->stock_quantity,
                        'is_on_sale' => $product->is_on_sale,
                        'features' => $product->features->pluck('feature')->toArray(),
                        'end_date' => null,
                        'available_stock' => $product->stock_quantity,
                        'total_stock' => $product->stock_quantity,
                        'sold_percentage' => 0,
                    ];
                });
        } else {
            // Fallback: utiliser SpecialOffer si aucune collection n'existe
            $specialOffers = SpecialOffer::with(['product.images', 'product.category', 'product.features'])
                ->where('is_active', true)
                ->where('end_date', '>', now())
                ->limit(3)
                ->get()
                ->map(function ($offer) {
                    $product = $offer->product;

                    return [
                        'id' => $offer->id,
                        'product_id' => $offer->product_id,
                        'name' => $product->name,
                        'slug' => $product->slug,
                        'sku' => $product->sku,
                        'price_formatted' => number_format($product->finalPrice, 0, ',', '.').' FCFA',
                        'old_price_formatted' => $product->hasDiscount ? number_format($product->price, 0, ',', '.').' FCFA' : null,
                        'has_discount' => $product->hasDiscount,
                        'discount_percentage' => $product->discount_percentage,
                        'primary_image' => $product->primaryImage ? $product->primaryImage->url : asset('images/products/default.png'),
                        'category_name' => $product->category->name,
                        'stock_quantity' => $product->stock_quantity,
                        'is_on_sale' => $product->is_on_sale,
                        'features' => $product->features->pluck('feature')->toArray(),
                        'end_date' => $offer->end_date->toISOString(),
                        'available_stock' => $offer->available_stock,
                        'total_stock' => $offer->total_stock,
                        'sold_percentage' => $offer->total_stock > 0 ? (($offer->total_stock - $offer->available_stock) / $offer->total_stock) * 100 : 0,
                    ];
                });
        }

        // 5. Meilleures ventes depuis la collection "best_sellers" (pour la section "Meilleures Ventes")
        $bestSellersCollection = Collection::where('type', 'best_sellers')
            ->where('is_active', true)
            ->first();

        $bestSellers = collect();
        if ($bestSellersCollection) {
            $bestSellers = $bestSellersCollection->products()
                ->with(['images', 'category'])
                ->where('is_active', true)
                ->limit($bestSellersCollection->limit ?? 8)
                ->get();
        }

        // 6. Bannières (tous types et positions)
        $banners = \App\Models\Banner::active()
            ->orderBy('sort_order')
            ->get()
            ->map(function ($banner) {
                return [
                    'id' => $banner->id,
                    'title' => $banner->title,
                    'type' => $banner->type,
                    'description' => $banner->description,
                    'image' => $banner->image ? (str_starts_with($banner->image, 'http') ? $banner->image : asset('storage/'.$banner->image)) : null,
                    'mobile_image' => $banner->mobile_image ? (str_starts_with($banner->mobile_image, 'http') ? $banner->mobile_image : asset('storage/'.$banner->mobile_image)) : null,
                    'link' => $banner->link,
                    'button_text' => $banner->button_text,
                    'button_link' => $banner->button_link,
                    'position' => $banner->position,
                    'display_duration' => $banner->display_duration,
                ];
            });

        // 7. Avis clients approuvés
        $reviews = ProductReview::with('user')
            ->where('is_approved', true)
            ->latest()
            ->limit(6)
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'name' => $review->user->name ?? 'Anonyme',
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'date' => $review->created_at->locale('fr')->diffForHumans(),
                    'avatar' => $review->user->avatar ? asset('storage/'.$review->user->avatar) : null,
                ];
            });

        // 8. Statistiques des avis
        $reviewStats = [
            'average' => round(ProductReview::where('is_approved', true)->avg('rating') ?? 4.2, 1),
            'total' => ProductReview::where('is_approved', true)->count(),
            'counts' => [
                '5' => ProductReview::where('is_approved', true)->where('rating', 5)->count(),
                '4' => ProductReview::where('is_approved', true)->where('rating', 4)->count(),
                '3' => ProductReview::where('is_approved', true)->where('rating', 3)->count(),
                '2' => ProductReview::where('is_approved', true)->where('rating', 2)->count(),
                '1' => ProductReview::where('is_approved', true)->where('rating', 1)->count(),
            ],
        ];

        return response()->json([
            'categories' => CategoryResource::collection($categories),
            'featuredProducts' => ProductResource::collection($featuredProducts),
            'newProducts' => ProductResource::collection($newProducts),
            'specialOffers' => $specialOffers,
            'bestSellers' => ProductResource::collection($bestSellers),
            'banners' => $banners,
            'reviews' => $reviews,
            'reviewStats' => $reviewStats,
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
            'data' => $specialOffers->map(function ($offer) {
                return [
                    'id' => $offer->id,
                    'product_id' => $offer->product_id,
                    'name' => $offer->product->name,
                    'slug' => $offer->product->slug,
                    'sku' => $offer->product->sku,
                    'price_formatted' => number_format($offer->product->finalPrice, 0, ',', '.').' FCFA',
                    'old_price_formatted' => $offer->product->hasDiscount ? number_format($offer->product->price, 0, ',', '.').' FCFA' : null,
                    'has_discount' => $offer->product->hasDiscount,
                    'discount_percentage' => $offer->product->discount_percentage,
                    'primary_image' => $offer->product->primaryImage ? $offer->product->primaryImage->url : asset('images/products/default.png'),
                    'category_name' => $offer->product->category->name,
                    'stock_quantity' => $offer->product->stock_quantity,
                    'is_on_sale' => $offer->product->is_on_sale,
                    'features' => $offer->product->features->pluck('feature')->toArray(),
                    'end_date' => $offer->end_date->toISOString(),
                    'available_stock' => $offer->available_stock,
                    'total_stock' => $offer->total_stock,
                    'sold_percentage' => $offer->total_stock > 0 ? (($offer->total_stock - $offer->available_stock) / $offer->total_stock) * 100 : 0,
                ];
            }),
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
            'message' => 'Votre message a été envoyé avec succès.',
        ]);
    }
}
