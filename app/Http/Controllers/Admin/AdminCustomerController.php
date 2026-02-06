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
        // On affiche les clients (rôle customer) OU n'importe qui ayant déjà commandé
        $customers = User::whereHas('roleModel', function ($q) {
            $q->where('slug', 'customer');
        })
            ->orWhereHas('orders')
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
            // Assurer que les champs de localisation sont là
            $customer->location_preview = $customer->neighborhood ?: $customer->city ?: '-';

            return $customer;
        });

        return Inertia::render('Admin/Customers', [
            'customers' => $customers,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(User $customer)
    {
        if ($customer->role !== 'customer' && ! $customer->isAdmin()) {
            // Un admin peut aussi être un client
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

    public function destroy(User $customer)
    {
        // En mode Hybrid, supprimer un client supprime l'utilisateur
        if ($customer->isAdmin()) {
            return back()->with('error', 'Impossible de supprimer un administrateur depuis la liste client.');
        }

        $customer->delete();

        return back()->with('success', 'Client supprimé avec succès.');
    }
}
