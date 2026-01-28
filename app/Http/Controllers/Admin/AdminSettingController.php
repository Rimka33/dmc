<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSettingController extends Controller
{
    public function index()
    {
        $settings = \App\Models\Setting::all()->pluck('value', 'key');

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
            'roles' => [
                ['id' => 1, 'name' => 'Admin', 'permissions' => ['create' => true, 'read' => true, 'update' => true, 'delete' => true]],
                ['id' => 2, 'name' => 'Editor', 'permissions' => ['create' => true, 'read' => true, 'update' => true, 'delete' => false]],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->except(['_token']);
        $group = $request->get('group', 'general');

        foreach ($data as $key => $value) {
            if ($key === 'group') {
                continue;
            }

            \App\Models\Setting::set($key, $value, $group);
        }

        return redirect()->back()->with('success', 'Paramètres mis à jour avec succès');
    }
}
