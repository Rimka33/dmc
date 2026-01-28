<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Liste tous les avis (avec filtres)
     */
    public function index(Request $request)
    {
        $query = ProductReview::with(['product', 'user']);

        // Filtres
        if ($request->has('is_approved')) {
            $query->where('is_approved', $request->is_approved);
        }

        if ($request->has('rating')) {
            $query->where('rating', $request->rating);
        }

        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%'.$request->search.'%')
                    ->orWhere('comment', 'like', '%'.$request->search.'%');
            });
        }

        $reviews = $query->latest()->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'product' => [
                        'id' => $review->product->id,
                        'name' => $review->product->name,
                    ],
                    'user' => [
                        'id' => $review->user->id,
                        'name' => $review->user->name,
                        'email' => $review->user->email,
                    ],
                    'rating' => $review->rating,
                    'title' => $review->title,
                    'comment' => $review->comment,
                    'is_verified_purchase' => $review->is_verified_purchase,
                    'is_approved' => $review->is_approved,
                    'helpful_count' => $review->helpful_count,
                    'created_at' => $review->created_at->toISOString(),
                ];
            }),
            'meta' => [
                'total' => $reviews->total(),
                'per_page' => $reviews->perPage(),
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
            ],
        ]);
    }

    /**
     * Approuver un avis
     */
    public function approve($id)
    {
        $review = ProductReview::findOrFail($id);
        $review->update(['is_approved' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Avis approuvé',
        ]);
    }

    /**
     * Rejeter un avis
     */
    public function reject($id)
    {
        $review = ProductReview::findOrFail($id);
        $review->update(['is_approved' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Avis rejeté',
        ]);
    }

    /**
     * Supprimer un avis
     */
    public function destroy($id)
    {
        $review = ProductReview::findOrFail($id);
        $productId = $review->product_id;
        $review->delete();

        // Mettre à jour la note moyenne du produit
        $this->updateProductRating($productId);

        return response()->json([
            'success' => true,
            'message' => 'Avis supprimé',
        ]);
    }

    /**
     * Statistiques des avis
     */
    public function stats()
    {
        $stats = [
            'total' => ProductReview::count(),
            'approved' => ProductReview::where('is_approved', true)->count(),
            'pending' => ProductReview::where('is_approved', false)->count(),
            'verified_purchases' => ProductReview::where('is_verified_purchase', true)->count(),
            'average_rating' => round(ProductReview::avg('rating'), 2),
            'by_rating' => [
                5 => ProductReview::where('rating', 5)->count(),
                4 => ProductReview::where('rating', 4)->count(),
                3 => ProductReview::where('rating', 3)->count(),
                2 => ProductReview::where('rating', 2)->count(),
                1 => ProductReview::where('rating', 1)->count(),
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Mettre à jour la note moyenne d'un produit
     */
    private function updateProductRating($productId)
    {
        $product = \App\Models\Product::findOrFail($productId);

        $avgRating = ProductReview::where('product_id', $productId)
            ->where('is_approved', true)
            ->avg('rating');

        $reviewCount = ProductReview::where('product_id', $productId)
            ->where('is_approved', true)
            ->count();

        $product->update([
            'rating' => round($avgRating, 2),
            'review_count' => $reviewCount,
        ]);
    }
}
