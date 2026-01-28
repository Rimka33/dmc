<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminCustomerController extends Controller
{
    public function index(Request $request)
    {
        $customers = User::where('role', 'customer')
            ->withCount(['orders' => function ($query) {
                $query->where('payment_status', 'paid');
            }])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Ajouter les statistiques pour chaque client
        $customers->getCollection()->transform(function ($customer) {
            $totalSpent = Order::where('user_id', $customer->id)
                ->where('payment_status', 'paid')
                ->sum('total');

            $customer->total_spent = $totalSpent;
            $customer->total_orders = $customer->orders_count;

            return $customer;
        });

        return Inertia::render('Admin/Customers', [
            'customers' => $customers,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(User $customer)
    {
        if ($customer->role !== 'customer') {
            abort(404);
        }

        $customer->load('addresses');

        $orders = Order::where('user_id', $customer->id)
            ->with('items.product')
            ->latest()
            ->paginate(10);

        $stats = [
            'total_orders' => Order::where('user_id', $customer->id)->count(),
            'total_spent' => Order::where('user_id', $customer->id)
                ->where('payment_status', 'paid')
                ->sum('total'),
            'pending_orders' => Order::where('user_id', $customer->id)
                ->where('status', 'pending')
                ->count(),
        ];

        return Inertia::render('Admin/Customers/Show', [
            'customer' => $customer,
            'orders' => $orders,
            'stats' => $stats,
        ]);
    }
}
