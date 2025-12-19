<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Liste toutes les catégories
     */
    public function index(Request $request)
    {
        $query = Category::withCount('products');

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $categories = $query->orderBy('sort_order')->get();

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories),
        ]);
    }

    /**
     * Créer une nouvelle catégorie
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|image|mimes:svg,png,jpg|max:2048',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        // Générer le slug
        $validated['slug'] = Str::slug($validated['name']);

        // Upload icon
        if ($request->hasFile('icon')) {
            $icon = $request->file('icon');
            $iconName = time() . '_icon_' . Str::random(10) . '.' . $icon->getClientOriginalExtension();
            $iconPath = $icon->storeAs('categories/icons', $iconName, 'public');
            $validated['icon'] = 'storage/' . $iconPath;
        }

        // Upload image
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_image_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('categories/images', $imageName, 'public');
            $validated['image'] = 'storage/' . $imagePath;
        }

        $category = Category::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Catégorie créée avec succès',
            'data' => new CategoryResource($category),
        ], 201);
    }

    /**
     * Afficher une catégorie
     */
    public function show($id)
    {
        $category = Category::withCount('products')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new CategoryResource($category),
        ]);
    }

    /**
     * Mettre à jour une catégorie
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|image|mimes:svg,png,jpg|max:2048',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        // Mettre à jour le slug si le nom change
        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Upload icon
        if ($request->hasFile('icon')) {
            // Supprimer l'ancien
            if ($category->icon && Storage::disk('public')->exists(str_replace('storage/', '', $category->icon))) {
                Storage::disk('public')->delete(str_replace('storage/', '', $category->icon));
            }

            $icon = $request->file('icon');
            $iconName = time() . '_icon_' . Str::random(10) . '.' . $icon->getClientOriginalExtension();
            $iconPath = $icon->storeAs('categories/icons', $iconName, 'public');
            $validated['icon'] = 'storage/' . $iconPath;
        }

        // Upload image
        if ($request->hasFile('image')) {
            // Supprimer l'ancienne
            if ($category->image && Storage::disk('public')->exists(str_replace('storage/', '', $category->image))) {
                Storage::disk('public')->delete(str_replace('storage/', '', $category->image));
            }

            $image = $request->file('image');
            $imageName = time() . '_image_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('categories/images', $imageName, 'public');
            $validated['image'] = 'storage/' . $imagePath;
        }

        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Catégorie mise à jour avec succès',
            'data' => new CategoryResource($category->fresh()),
        ]);
    }

    /**
     * Supprimer une catégorie
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        // Vérifier s'il y a des produits
        if ($category->products()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer une catégorie contenant des produits',
            ], 400);
        }

        // Supprimer les fichiers
        if ($category->icon && Storage::disk('public')->exists(str_replace('storage/', '', $category->icon))) {
            Storage::disk('public')->delete(str_replace('storage/', '', $category->icon));
        }

        if ($category->image && Storage::disk('public')->exists(str_replace('storage/', '', $category->image))) {
            Storage::disk('public')->delete(str_replace('storage/', '', $category->image));
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Catégorie supprimée avec succès',
        ]);
    }
}
