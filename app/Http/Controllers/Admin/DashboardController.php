<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use App\Models\Category;
use App\Models\Collection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'total_categories' => Category::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            
            // Revenus détaillés
            'revenue_total' => Order::where('payment_status', 'paid')->sum('total'),
            'revenue_today' => Order::whereDate('created_at', today())->where('payment_status', 'paid')->sum('total'),
            'revenue_this_month' => Order::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->where('payment_status', 'paid')->sum('total'),
            
            // Interactions en attente
            'new_messages' => \App\Models\Message::where('status', 'new')->count(),
            'pending_reviews' => \App\Models\ProductReview::where('is_approved', false)->count(),
            'pending_questions' => \App\Models\Question::whereNull('answer')->count(),
            
            // Alertes
            'low_stock_count' => Product::where('stock_quantity', '<=', 5)->count(),
            
            // Listes
            'recent_orders' => Order::with('user')->latest()->limit(5)->get(),
            'low_stock_products' => Product::where('stock_quantity', '<=', 5)->limit(5)->get(),
        ];

        // Top produits vendus
        $stats['top_products'] = \DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select('products.name', \DB::raw('SUM(order_items.quantity) as total_sold'), 'products.price')
            ->groupBy('products.id', 'products.name', 'products.price')
            ->orderBy('total_sold', 'desc')
            ->limit(5)
            ->get();

        // Récupérer les collections actives pour la gestion de la page d'accueil
        $collections = Collection::where('is_active', true)
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'collections' => $collections
        ]);
    }
}
