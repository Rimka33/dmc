<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Récupérer le panier
     */
    public function index()
    {
        try {
            $cart = $this->cartService->getSummary();
            
            return response()->json([
                'success' => true,
                'data' => $cart,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du panier',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Ajouter un produit au panier
     */
    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $items = $this->cartService->add(
                $request->product_id,
                $request->quantity
            );

            return response()->json([
                'success' => true,
                'message' => 'Produit ajouté au panier',
                'data' => $this->cartService->getSummary(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Mettre à jour la quantité d'un produit
     */
    public function update(Request $request, $productId)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $items = $this->cartService->update($productId, $request->quantity);

            return response()->json([
                'success' => true,
                'message' => 'Panier mis à jour',
                'data' => $this->cartService->getSummary(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Retirer un produit du panier
     */
    public function remove($productId)
    {
        try {
            $items = $this->cartService->remove($productId);

            return response()->json([
                'success' => true,
                'message' => 'Produit retiré du panier',
                'data' => $this->cartService->getSummary(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Vider le panier
     */
    public function clear()
    {
        try {
            $this->cartService->clear();

            return response()->json([
                'success' => true,
                'message' => 'Panier vidé',
                'data' => [
                    'items' => [],
                    'count' => 0,
                    'subtotal' => 0,
                    'shipping' => 0,
                    'tax' => 0,
                    'total' => 0,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtenir le nombre d'articles dans le panier
     */
    public function count()
    {
        try {
            $count = $this->cartService->getCount();

            return response()->json([
                'success' => true,
                'count' => $count,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
