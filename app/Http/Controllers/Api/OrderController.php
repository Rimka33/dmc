<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Services\CartService;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    protected $orderService;
    protected $cartService;

    public function __construct(OrderService $orderService, CartService $cartService)
    {
        $this->orderService = $orderService;
        $this->cartService = $cartService;
    }

    /**
     * Créer une nouvelle commande
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:50',
            'shipping_address' => 'required|string',
            'shipping_city' => 'required|string|max:100',
            'shipping_postal_code' => 'nullable|string|max:20',
            'payment_method' => 'required|in:cash_on_delivery,bank_transfer,mobile_money',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Récupérer les items du panier
            $cartItems = $this->cartService->getItems();

            if (empty($cartItems)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Votre panier est vide',
                ], 400);
            }

            // Créer la commande
            $order = $this->orderService->createOrder(
                $request->all(),
                $cartItems
            );

            // Vider le panier
            $this->cartService->clear();

            // Charger les relations pour la réponse
            $order->load(['items.product.images', 'user']);

            return response()->json([
                'success' => true,
                'message' => 'Commande créée avec succès',
                'data' => new OrderResource($order),
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Afficher les détails d'une commande
     */
    public function show($orderNumber)
    {
        try {
            $order = $this->orderService->getOrderByNumber($orderNumber);

            return response()->json([
                'success' => true,
                'data' => new OrderResource($order),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Commande non trouvée',
            ], 404);
        }
    }

    /**
     * Historique des commandes de l'utilisateur connecté
     */
    public function userOrders(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié',
                ], 401);
            }

            $orders = $this->orderService->getUserOrders($user->id);

            return response()->json([
                'success' => true,
                'data' => OrderResource::collection($orders),
                'meta' => [
                    'total' => $orders->total(),
                    'per_page' => $orders->perPage(),
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
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
     * Détails d'une commande spécifique de l'utilisateur
     */
    public function userOrderDetails(Request $request, $id)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié',
                ], 401);
            }

            $order = \App\Models\Order::with(['items.product.images'])
                ->where('id', $id)
                ->where('user_id', $user->id)
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'data' => new OrderResource($order),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Commande non trouvée',
            ], 404);
        }
    }
}
