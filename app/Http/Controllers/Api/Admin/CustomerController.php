<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Liste tous les clients
     */
    public function index(Request $request)
    {
        $query = User::where('role', 'customer');

        // Filtres
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('email', 'like', '%'.$request->search.'%')
                    ->orWhere('phone', 'like', '%'.$request->search.'%');
            });
        }

        $customers = $query->latest()->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => UserResource::collection($customers),
            'meta' => [
                'total' => $customers->total(),
                'per_page' => $customers->perPage(),
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
            ],
        ]);
    }

    /**
     * Détails d'un client
     */
    public function show($id)
    {
        $customer = User::where('role', 'customer')->findOrFail($id);

        // Statistiques du client
        $stats = [
            'total_orders' => Order::where('user_id', $id)->count(),
            'total_spent' => Order::where('user_id', $id)
                ->where('payment_status', 'paid')
                ->sum('total'),
            'pending_orders' => Order::where('user_id', $id)
                ->where('status', 'pending')
                ->count(),
        ];

        // Dernières commandes
        $recentOrders = Order::where('user_id', $id)
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total' => $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at->toISOString(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'customer' => new UserResource($customer),
                'stats' => $stats,
                'recent_orders' => $recentOrders,
            ],
        ]);
    }

    /**
     * Activer/Désactiver un client
     */
    public function toggleStatus($id)
    {
        $customer = User::where('role', 'customer')->findOrFail($id);

        $customer->update([
            'is_active' => ! $customer->is_active,
        ]);

        return response()->json([
            'success' => true,
            'message' => $customer->is_active ? 'Client activé' : 'Client désactivé',
            'data' => new UserResource($customer),
        ]);
    }

    /**
     * Historique des commandes d'un client
     */
    public function orders($id, Request $request)
    {
        $customer = User::where('role', 'customer')->findOrFail($id);

        $orders = Order::where('user_id', $id)
            ->with('items.product')
            ->latest()
            ->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => $orders->items(),
            'meta' => [
                'total' => $orders->total(),
                'per_page' => $orders->perPage(),
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
            ],
        ]);
    }

    /**
     * Statistiques globales des clients
     */
    public function stats()
    {
        $stats = [
            'total_customers' => User::where('role', 'customer')->count(),
            'active_customers' => User::where('role', 'customer')->where('is_active', true)->count(),
            'inactive_customers' => User::where('role', 'customer')->where('is_active', false)->count(),
            'new_this_month' => User::where('role', 'customer')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'customers_with_orders' => User::where('role', 'customer')
                ->whereHas('orders')
                ->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
