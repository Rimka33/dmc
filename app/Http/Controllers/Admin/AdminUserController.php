<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::with('roleModel')
            ->whereHas('roleModel', function ($q) {
                $q->where('slug', '!=', 'customer');
            })
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($request->role, function ($query, $role) {
                if ($role === 'admin') {
                    $query->where('role', 'admin');
                } elseif ($role === 'customer') {
                    $query->where('role', 'customer');
                }
                // Support for role_id if passed
                elseif (is_numeric($role)) {
                    $query->where('role_id', $role);
                }
            })
            ->when($request->status, function ($query, $status) {
                if ($status === 'active') {
                    $query->where('is_active', true);
                } elseif ($status === 'inactive') {
                    $query->where('is_active', false);
                }
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'city' => $user->city,
                    'region' => $user->region,
                    'neighborhood' => $user->neighborhood,
                    'role' => $user->roleModel ? $user->roleModel->name : ($user->role === 'admin' ? 'Administrateur' : 'Client'),
                    'role_id' => $user->role_id,
                    'is_active' => $user->is_active,
                    'created_at' => $user->created_at->format('d/m/Y'),
                ];
            });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status']),
        ]);
    }

    public function search(Request $request)
    {
        $search = $request->get('q');
        $users = User::where('name', 'like', "%{$search}%")
            ->orWhere('phone', 'like', "%{$search}%")
            ->limit(10)
            ->get(['id', 'name', 'phone', 'email', 'address', 'city', 'region', 'neighborhood']);

        return response()->json($users);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => \App\Models\Role::all(['id', 'name', 'slug']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => $request->filled('email') ? 'nullable|email|unique:users,email,'.$request->user_id : 'nullable',
            'password' => $request->user_id ? 'nullable|string|min:8' : 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
            'is_active' => 'boolean',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'region' => 'nullable|string',
            'neighborhood' => 'nullable|string',
        ]);

        // Vérification manuelle de l'unicité du téléphone si pas d'ID (ou si l'ID ne correspond pas)
        if (! $request->user_id) {
            $existingUser = User::where('phone', $validated['phone'])->first();
            if ($existingUser) {
                $user = $existingUser;
            }
        } else {
            $user = User::find($request->user_id);
        }

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'city' => $validated['city'],
            'region' => $validated['region'],
            'neighborhood' => $validated['neighborhood'],
            'is_active' => $validated['is_active'] ?? true,
            'role_id' => $validated['role_id'],
        ];

        if ($request->filled('password')) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
        }

        // Synchro avec l'ancienne colonne role
        $role = \App\Models\Role::find($validated['role_id']);
        $data['role'] = $role->slug === 'admin' ? 'admin' : 'customer';

        if (isset($user)) {
            $user->update($data);
            $msg = 'Utilisateur mis à jour avec succès (Rôle assigné).';
        } else {
            User::create($data);
            $msg = 'Nouvel utilisateur créé avec succès.';
        }

        return redirect()->route('admin.users.index')->with('success', $msg);
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role_id' => $user->role_id,
                'address' => $user->address,
                'city' => $user->city,
                'region' => $user->region,
                'neighborhood' => $user->neighborhood,
                'is_active' => $user->is_active,
            ],
            'roles' => \App\Models\Role::all(['id', 'name']),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|unique:users,email,'.$user->id,
            'role_id' => 'required|exists:roles,id',
            'password' => 'nullable|string|min:8',
            'is_active' => 'boolean',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'region' => 'nullable|string',
            'neighborhood' => 'nullable|string',
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'city' => $validated['city'],
            'region' => $validated['region'],
            'neighborhood' => $validated['neighborhood'],
            'is_active' => $validated['is_active'] ?? true,
            'role_id' => $validated['role_id'],
        ];

        if ($request->filled('password')) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
        }

        // Synchro avec l'ancienne colonne role
        $role = \App\Models\Role::find($validated['role_id']);
        $data['role'] = $role->slug === 'admin' ? 'admin' : 'customer';

        $user->update($data);

        return redirect()->route('admin.users.index')->with('success', 'Utilisateur mis à jour avec succès.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Vous ne pouvez pas supprimer votre propre compte.');
        }

        if ($user->isAdmin() && User::admins()->count() <= 1) {
            return back()->with('error', 'Impossible de supprimer le dernier administrateur.');
        }

        // Si l'utilisateur est aussi un client (a des commandes), on retire juste son rôle staff
        if ($user->orders()->exists()) {
            $customerRole = \App\Models\Role::where('slug', 'customer')->first();
            $user->update([
                'role_id' => $customerRole->id,
                'role' => 'customer',
            ]);

            return back()->with('success', 'Rôle staff retiré. L\'utilisateur est conservé en tant que client (commandes existantes).');
        }

        $user->delete();

        return back()->with('success', 'Utilisateur supprimé.');
    }
}
