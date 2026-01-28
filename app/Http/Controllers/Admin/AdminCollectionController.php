<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminCollectionController extends Controller
{
    public function index(Request $request)
    {
        $collections = Collection::withCount('products')
            ->orderByRaw('CASE WHEN sort_order = 0 OR sort_order IS NULL THEN 1 ELSE 0 END, sort_order ASC')
            ->orderBy('name', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Collections/Index', [
            'collections' => $collections,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(Request $request)
    {
        $products = Product::where('is_active', true)
            ->with('images')
            ->select('id', 'name', 'sku', 'price')
            ->orderBy('name')
            ->get();

        $defaultType = $request->get('type', 'custom');

        return Inertia::render('Admin/Collections/Create', [
            'products' => $products,
            'defaultType' => $defaultType,
            'types' => [
                ['value' => 'featured', 'label' => 'Produits en vedette'],
                ['value' => 'new', 'label' => 'Nouveautés'],
                ['value' => 'special_offers', 'label' => 'Offres spéciales'],
                ['value' => 'best_sellers', 'label' => 'Meilleures ventes'],
                ['value' => 'custom', 'label' => 'Collection personnalisée'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:collections,slug',
            'description' => 'nullable|string',
            'type' => 'required|in:featured,new,special_offers,best_sellers,custom',
            'sort_order' => 'nullable|integer',
            'limit' => 'nullable|integer|min:1|max:50',
            'is_active' => 'boolean',
            'products' => 'nullable|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.sort_order' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if (empty($validated['limit'])) {
            $validated['limit'] = 8;
        }

        $products = $validated['products'] ?? [];
        unset($validated['products']);

        $collection = Collection::create($validated);

        // Attacher les produits avec leur ordre
        if (! empty($products)) {
            $syncData = [];
            foreach ($products as $product) {
                $syncData[$product['id']] = ['sort_order' => $product['sort_order'] ?? 0];
            }
            $collection->products()->sync($syncData);
        }

        return redirect()->route('admin.collections.index')->with('success', 'Collection créée avec succès.');
    }

    public function edit(Collection $collection)
    {
        $collection->load(['products' => function ($query) {
            $query->with('images')->orderBy('collection_product.sort_order');
        }]);

        $products = Product::where('is_active', true)
            ->with('images')
            ->select('id', 'name', 'sku', 'price')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Collections/Edit', [
            'collection' => $collection,
            'products' => $products,
            'types' => [
                ['value' => 'featured', 'label' => 'Produits en vedette'],
                ['value' => 'new', 'label' => 'Nouveautés'],
                ['value' => 'special_offers', 'label' => 'Offres spéciales'],
                ['value' => 'best_sellers', 'label' => 'Meilleures ventes'],
                ['value' => 'custom', 'label' => 'Collection personnalisée'],
            ],
        ]);
    }

    public function update(Request $request, Collection $collection)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:collections,slug,'.$collection->id,
            'description' => 'nullable|string',
            'type' => 'required|in:featured,new,special_offers,best_sellers,custom',
            'sort_order' => 'nullable|integer',
            'limit' => 'nullable|integer|min:1|max:50',
            'is_active' => 'boolean',
            'products' => 'nullable|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.sort_order' => 'nullable|integer',
        ]);

        $products = $validated['products'] ?? [];
        unset($validated['products']);

        $collection->update($validated);

        // Synchroniser les produits
        if (isset($request->products)) {
            $syncData = [];
            foreach ($products as $product) {
                $syncData[$product['id']] = ['sort_order' => $product['sort_order'] ?? 0];
            }
            $collection->products()->sync($syncData);
        }

        return redirect()->route('admin.collections.index')->with('success', 'Collection mise à jour avec succès.');
    }

    public function destroy(Collection $collection)
    {
        $collection->delete();

        return redirect()->route('admin.collections.index')->with('success', 'Collection supprimée.');
    }
}
