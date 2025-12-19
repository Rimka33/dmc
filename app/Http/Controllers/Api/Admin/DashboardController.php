<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Statistiques du dashboard admin
     */
    public function index()
    {
        // Statistiques générales
        $stats = [
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'total_products' => Product::count(),
            'active_products' => Product::where('is_active', true)->count(),
            'low_stock_products' => Product::where('stock_status', 'low_stock')->count(),
            'out_of_stock_products' => Product::where('stock_status', 'out_of_stock')->count(),
        ];

        // Revenus
        $revenue = [
            'today' => Order::whereDate('created_at', today())
                ->where('payment_status', 'paid')
                ->sum('total'),
            'this_week' => Order::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
                ->where('payment_status', 'paid')
                ->sum('total'),
            'this_month' => Order::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->where('payment_status', 'paid')
                ->sum('total'),
            'total' => Order::where('payment_status', 'paid')->sum('total'),
        ];

        // Dernières commandes
        $recentOrders = Order::with('user')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer_name,
                    'total' => $order->total,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'created_at' => $order->created_at->toISOString(),
                ];
            });

        // Produits en rupture de stock
        $outOfStockProducts = Product::where('stock_status', 'out_of_stock')
            ->orWhere('stock_status', 'low_stock')
            ->with('category')
            ->limit(10)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'stock_quantity' => $product->stock_quantity,
                    'stock_status' => $product->stock_status,
                    'category' => $product->category->name ?? 'N/A',
                ];
            });

        // Produits les plus vendus (ce mois)
        $topProducts = \DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->whereMonth('orders.created_at', now()->month)
            ->whereYear('orders.created_at', now()->year)
            ->select('products.id', 'products.name', \DB::raw('SUM(order_items.quantity) as total_sold'))
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_sold', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'revenue' => $revenue,
                'recent_orders' => $recentOrders,
                'out_of_stock_products' => $outOfStockProducts,
                'top_products' => $topProducts,
            ],
        ]);
    }

    /**
     * Statistiques de ventes par période
     */
    public function salesStats(Request $request)
    {
        $period = $request->get('period', 'month'); // day, week, month, year

        $query = Order::where('payment_status', 'paid');

        switch ($period) {
            case 'day':
                $data = $query->whereDate('created_at', today())
                    ->selectRaw('HOUR(created_at) as period, SUM(total) as total, COUNT(*) as count')
                    ->groupBy('period')
                    ->get();
                break;
            case 'week':
                $data = $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
                    ->selectRaw('DAYNAME(created_at) as period, SUM(total) as total, COUNT(*) as count')
                    ->groupBy('period')
                    ->get();
                break;
            case 'month':
                $data = $query->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->selectRaw('DAY(created_at) as period, SUM(total) as total, COUNT(*) as count')
                    ->groupBy('period')
                    ->get();
                break;
            case 'year':
                $data = $query->whereYear('created_at', now()->year)
                    ->selectRaw('MONTH(created_at) as period, SUM(total) as total, COUNT(*) as count')
                    ->groupBy('period')
                    ->get();
                break;
            default:
                $data = [];
        }

        return response()->json([
            'success' => true,
            'period' => $period,
            'data' => $data,
        ]);
    }
}
