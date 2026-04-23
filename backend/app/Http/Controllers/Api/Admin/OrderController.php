<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Liste toutes les commandes avec filtres
     */
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.product']);

        // Filtres
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('order_number', 'like', '%'.$request->search.'%')
                    ->orWhere('customer_email', 'like', '%'.$request->search.'%')
                    ->orWhere('customer_name', 'like', '%'.$request->search.'%');
            });
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Tri
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $orders = $query->paginate($request->get('per_page', 20));

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
    }

    /**
     * Détails d'une commande
     */
    public function show($id)
    {
        $order = Order::with(['items.product.images', 'user', 'statusHistories.changedBy'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new OrderResource($order),
        ]);
    }

    /**
     * Changer le statut d'une commande
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'comment' => 'nullable|string|max:500',
        ]);

        $order = Order::findOrFail($id);
        $oldStatus = $order->status;
        $newStatus = $request->status;

        // Mettre à jour le statut
        $order->update(['status' => $newStatus]);

        // Créer l'historique
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'comment' => $request->comment,
            'changed_by' => $request->user()->id,
        ]);

        // Créer une notification pour le client (si connecté)
        if ($order->user_id) {
            \App\Models\Notification::create([
                'user_id' => $order->user_id,
                'type' => 'order',
                'title' => 'Statut de commande mis à jour',
                'message' => "Votre commande {$order->order_number} est maintenant : {$newStatus}",
                'data' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $newStatus,
                ],
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Statut de commande mis à jour',
            'data' => new OrderResource($order->fresh(['items.product', 'user'])),
        ]);
    }

    /**
     * Historique des changements de statut
     */
    public function statusHistory($id)
    {
        $order = Order::findOrFail($id);

        $history = OrderStatusHistory::where('order_id', $id)
            ->with('changedBy')
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'old_status' => $item->old_status,
                    'new_status' => $item->new_status,
                    'comment' => $item->comment,
                    'changed_by' => $item->changedBy ? $item->changedBy->name : 'Système',
                    'created_at' => $item->created_at->toISOString(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $history,
        ]);
    }

    /**
     * Statistiques des commandes
     */
    public function stats()
    {
        $stats = [
            'total' => Order::count(),
            'by_status' => [
                'pending' => Order::where('status', 'pending')->count(),
                'processing' => Order::where('status', 'processing')->count(),
                'shipped' => Order::where('status', 'shipped')->count(),
                'delivered' => Order::where('status', 'delivered')->count(),
                'cancelled' => Order::where('status', 'cancelled')->count(),
            ],
            'by_payment_status' => [
                'pending' => Order::where('payment_status', 'pending')->count(),
                'paid' => Order::where('payment_status', 'paid')->count(),
                'failed' => Order::where('payment_status', 'failed')->count(),
                'refunded' => Order::where('payment_status', 'refunded')->count(),
            ],
            'revenue' => [
                'total' => Order::where('payment_status', 'paid')->sum('total'),
                'this_month' => Order::whereMonth('created_at', now()->month)
                    ->where('payment_status', 'paid')
                    ->sum('total'),
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
