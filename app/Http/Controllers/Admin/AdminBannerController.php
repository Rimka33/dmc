<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminBannerController extends Controller
{
    public function index(Request $request)
    {
        $banners = Banner::when($request->search, function($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->when($request->type, function($query, $type) {
                $query->where('type', $type);
            })
            ->orderBy('sort_order')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Banners', [
            'banners' => $banners,
            'filters' => $request->only(['search', 'type'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Banners/Create', [
            'types' => [
                ['value' => 'popup', 'label' => 'Popup (Modal)'],
                ['value' => 'banner', 'label' => 'Bannière'],
                ['value' => 'slider', 'label' => 'Slider'],
            ],
            'positions' => [
                ['value' => 'top', 'label' => 'Haut de page'],
                ['value' => 'middle', 'label' => 'Milieu de page'],
                ['value' => 'bottom', 'label' => 'Bas de page'],
                ['value' => 'popup', 'label' => 'Popup (Modal)'],
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:popup,banner,slider',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'mobile_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'link' => 'nullable|url|max:255',
            'description' => 'nullable|string',
            'position' => 'required|in:top,middle,bottom,popup',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
            'display_duration' => 'nullable|integer|min:1',
            'sort_order' => 'nullable|integer',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|url|max:255',
        ]);

        // Upload des images
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('banners', 'public');
            $validated['image'] = $imagePath;
        }

        if ($request->hasFile('mobile_image')) {
            $mobileImagePath = $request->file('mobile_image')->store('banners', 'public');
            $validated['mobile_image'] = $mobileImagePath;
        }

        $banner = Banner::create($validated);

        return redirect()->route('admin.banners.index')->with('success', 'Bannière créée avec succès.');
    }

    public function edit(Banner $banner)
    {
        return Inertia::render('Admin/Banners/Edit', [
            'banner' => $banner,
            'types' => [
                ['value' => 'popup', 'label' => 'Popup (Modal)'],
                ['value' => 'banner', 'label' => 'Bannière'],
                ['value' => 'slider', 'label' => 'Slider'],
            ],
            'positions' => [
                ['value' => 'top', 'label' => 'Haut de page'],
                ['value' => 'middle', 'label' => 'Milieu de page'],
                ['value' => 'bottom', 'label' => 'Bas de page'],
                ['value' => 'popup', 'label' => 'Popup (Modal)'],
            ]
        ]);
    }

    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:popup,banner,slider',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'mobile_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'link' => 'nullable|url|max:255',
            'description' => 'nullable|string',
            'position' => 'required|in:top,middle,bottom,popup',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
            'display_duration' => 'nullable|integer|min:1',
            'sort_order' => 'nullable|integer',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|url|max:255',
        ]);

        // Upload des nouvelles images
        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image
            if ($banner->image) {
                \Storage::disk('public')->delete($banner->image);
            }
            $imagePath = $request->file('image')->store('banners', 'public');
            $validated['image'] = $imagePath;
        } else {
            $validated['image'] = $banner->image;
        }

        if ($request->hasFile('mobile_image')) {
            // Supprimer l'ancienne image mobile
            if ($banner->mobile_image) {
                \Storage::disk('public')->delete($banner->mobile_image);
            }
            $mobileImagePath = $request->file('mobile_image')->store('banners', 'public');
            $validated['mobile_image'] = $mobileImagePath;
        } else {
            $validated['mobile_image'] = $banner->mobile_image;
        }

        $banner->update($validated);

        return redirect()->route('admin.banners.index')->with('success', 'Bannière mise à jour avec succès.');
    }

    public function destroy(Banner $banner)
    {
        if ($banner->image) {
            \Storage::disk('public')->delete($banner->image);
        }
        if ($banner->mobile_image) {
            \Storage::disk('public')->delete($banner->mobile_image);
        }
        $banner->delete();

        return redirect()->route('admin.banners.index')->with('success', 'Bannière supprimée.');
    }
}
