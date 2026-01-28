<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Liste des avis d'un produit
     */
    public function index($productId)
    {
        $product = Product::findOrFail($productId);

        $reviews = ProductReview::where('product_id', $productId)
            ->approved()
            ->with('user')
            ->latest()
            ->paginate(10);

        $stats = [
            'average_rating' => $product->rating,
            'total_reviews' => $product->review_count,
            'rating_distribution' => [
                5 => ProductReview::where('product_id', $productId)->where('rating', 5)->count(),
                4 => ProductReview::where('product_id', $productId)->where('rating', 4)->count(),
                3 => ProductReview::where('product_id', $productId)->where('rating', 3)->count(),
                2 => ProductReview::where('product_id', $productId)->where('rating', 2)->count(),
                1 => ProductReview::where('product_id', $productId)->where('rating', 1)->count(),
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'title' => $review->title,
                    'comment' => $review->comment,
                    'is_verified_purchase' => $review->is_verified_purchase,
                    'helpful_count' => $review->helpful_count,
                    'user' => [
                        'name' => $review->user->name,
                    ],
                    'created_at' => $review->created_at->toISOString(),
                ];
            }),
            'stats' => $stats,
            'meta' => [
                'total' => $reviews->total(),
                'per_page' => $reviews->perPage(),
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
            ],
        ]);
    }

    /**
     * Créer un avis
     */
    public function store(Request $request, $productId)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $product = Product::findOrFail($productId);

        // Vérifier si l'utilisateur a déjà laissé un avis
        $existingReview = ProductReview::where('product_id', $productId)
            ->where('user_id', $user->id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà laissé un avis pour ce produit',
            ], 400);
        }

        // Vérifier si c'est un achat vérifié
        $isVerifiedPurchase = Order::where('user_id', $user->id)
            ->whereHas('items', function ($query) use ($productId) {
                $query->where('product_id', $productId);
            })
            ->where('status', 'delivered')
            ->exists();

        $review = ProductReview::create([
            'product_id' => $productId,
            'user_id' => $user->id,
            'rating' => $request->rating,
            'title' => $request->title,
            'comment' => $request->comment,
            'is_verified_purchase' => $isVerifiedPurchase,
            'is_approved' => true, // Auto-approuvé (peut être modifié)
        ]);

        // Mettre à jour la note moyenne du produit
        $this->updateProductRating($productId);

        return response()->json([
            'success' => true,
            'message' => 'Avis publié avec succès',
            'data' => $review,
        ], 201);
    }

    /**
     * Créer un avis pour la boutique (sans produit spécifique)
     */
    public function storeShopReview(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        // Vérifier si l'utilisateur a déjà laissé un avis "boutique" récent (optionnel, pour éviter le spam)
        // Ici on autorise plusieurs avis boutique pour l'instant

        $review = ProductReview::create([
            'product_id' => null,
            'user_id' => $user->id,
            'rating' => $request->rating,
            'title' => $request->title ?? 'Avis Boutique',
            'comment' => $request->comment,
            'is_verified_purchase' => true, // On considère qu'un user connecté peut laisser un avis
            'is_approved' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Merci pour votre avis sur notre boutique !',
            'data' => $review,
        ], 201);
    }

    /**
     * Modifier un avis
     */
    public function update(Request $request, $reviewId)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $review = ProductReview::findOrFail($reviewId);

        // Vérifier que c'est bien l'auteur
        if ($review->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $review->update([
            'rating' => $request->rating,
            'title' => $request->title,
            'comment' => $request->comment,
        ]);

        // Mettre à jour la note moyenne du produit
        $this->updateProductRating($review->product_id);

        return response()->json([
            'success' => true,
            'message' => 'Avis modifié avec succès',
            'data' => $review,
        ]);
    }

    /**
     * Supprimer un avis
     */
    public function destroy(Request $request, $reviewId)
    {
        $user = $request->user();
        $review = ProductReview::findOrFail($reviewId);

        // Vérifier que c'est bien l'auteur
        if ($review->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $productId = $review->product_id;
        $review->delete();

        // Mettre à jour la note moyenne du produit
        $this->updateProductRating($productId);

        return response()->json([
            'success' => true,
            'message' => 'Avis supprimé avec succès',
        ]);
    }

    /**
     * Marquer un avis comme utile
     */
    public function markHelpful(Request $request, $reviewId)
    {
        $review = ProductReview::findOrFail($reviewId);
        $review->increment('helpful_count');

        return response()->json([
            'success' => true,
            'message' => 'Merci pour votre retour',
            'helpful_count' => $review->helpful_count,
        ]);
    }

    /**
     * Mettre à jour la note moyenne d'un produit
     */
    private function updateProductRating($productId)
    {
        if (! $productId) {
            return;
        }

        $product = Product::findOrFail($productId);

        $avgRating = ProductReview::where('product_id', $productId)
            ->approved()
            ->avg('rating');

        $reviewCount = ProductReview::where('product_id', $productId)
            ->approved()
            ->count();

        $product->update([
            'rating' => round($avgRating, 2),
            'review_count' => $reviewCount,
        ]);
    }
}
