<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * Liste de souhaits de l'utilisateur
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $wishlist = Wishlist::where('user_id', $user->id)
            ->with('product.images', 'product.category')
            ->latest()
            ->get();

        $products = $wishlist->map(function ($item) {
            return new ProductResource($item->product);
        });

        return response()->json([
            'success' => true,
            'data' => $products,
            'count' => $wishlist->count(),
        ]);
    }

    /**
     * Ajouter un produit à la liste de souhaits
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = $request->user();

        // Vérifier si déjà dans la wishlist
        $exists = Wishlist::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Ce produit est déjà dans votre liste de souhaits',
            ], 400);
        }

        Wishlist::create([
            'user_id' => $user->id,
            'product_id' => $request->product_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produit ajouté à la liste de souhaits',
        ], 201);
    }

    /**
     * Retirer un produit de la liste de souhaits
     */
    public function destroy(Request $request, $productId)
    {
        $user = $request->user();

        $deleted = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->delete();

        if (! $deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Produit non trouvé dans votre liste de souhaits',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Produit retiré de la liste de souhaits',
        ]);
    }

    /**
     * Vérifier si un produit est dans la wishlist
     */
    public function check(Request $request, $productId)
    {
        $user = $request->user();

        $exists = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->exists();

        return response()->json([
            'success' => true,
            'in_wishlist' => $exists,
        ]);
    }

    /**
     * Vider la liste de souhaits
     */
    public function clear(Request $request)
    {
        $user = $request->user();

        Wishlist::where('user_id', $user->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Liste de souhaits vidée',
        ]);
    }
}
