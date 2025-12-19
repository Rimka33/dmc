<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use App\Models\Category;
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
            'recent_orders' => Order::with('user')->latest()->limit(5)->get(),
            'low_stock_products' => Product::where('stock_quantity', '<=', 5)->limit(5)->get(),
            'revenue' => Order::where('payment_status', 'paid')->sum('total'),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats
        ]);
    }
}
