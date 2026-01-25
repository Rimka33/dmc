<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminRoleController extends Controller
{
    public function index()
    {
        $roles = Role::withCount('users')->with('permissions')->get();
        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Roles/Create', [
            'permissions' => \App\Models\Permission::all()->groupBy('group')
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'slug' => \Illuminate\Support\Str::slug($validated['name']),
            'description' => $request->description ?? ''
        ]);

        if (!empty($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return redirect()->route('admin.roles.index')->with('success', 'Rôle créé avec succès.');
    }

    public function edit(Role $role)
    {
        if ($role->slug === 'admin') {
            return redirect()->route('admin.roles.index')->with('error', 'Le rôle Administrateur ne peut pas être modifié.');
        }

        $role->load('permissions');

        return Inertia::render('Admin/Roles/Edit', [
            'role' => $role,
            'permissions' => \App\Models\Permission::all()->groupBy('group'),
            'rolePermissions' => $role->permissions->pluck('id')
        ]);
    }

    public function update(Request $request, Role $role)
    {
        if ($role->slug === 'admin') {
            return back()->with('error', 'Le rôle Administrateur ne peut pas être modifié.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        $role->update([
            'name' => $validated['name'],
            // On ne change pas le slug pour éviter de casser des références statiques, ou alors on gère avec prudence.
            'description' => $request->description ?? $role->description
        ]);

        if (isset($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return redirect()->route('admin.roles.index')->with('success', 'Rôle mis à jour avec succès.');
    }


    public function destroy(Role $role)
    {
        if (in_array($role->slug, ['admin', 'manager', 'customer'])) {
            return back()->with('error', 'Les rôles système par défaut ne peuvent pas être supprimés.');
        }

        if ($role->users()->count() > 0) {
            return back()->with('error', 'Impossible de supprimer un rôle assigné à des utilisateurs.');
        }

        $role->permissions()->detach();
        $role->delete();

        return back()->with('success', 'Rôle supprimé.');
    }
}
