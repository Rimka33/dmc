<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminBlogController extends Controller
{
    public function index(Request $request)
    {
        $blogs = Blog::when($request->search, function ($query, $search) {
            $query->where('title', 'like', "%{$search}%")
                ->orWhere('excerpt', 'like', "%{$search}%");
        })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Blog', [
            'articles' => $blogs,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Blog/Create', [
            'categories' => $this->getCategories(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blogs,slug',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'category' => 'nullable|string|max:255',
            'author' => 'nullable|string|max:255',
            'status' => 'required|in:draft,published,archived',
            'read_time' => 'nullable|integer|min:1',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'is_featured' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Calculer le temps de lecture si non fourni
        if (empty($validated['read_time'])) {
            $wordCount = str_word_count(strip_tags($validated['content']));
            $validated['read_time'] = max(1, ceil($wordCount / 200)); // ~200 mots par minute
        }

        // Upload de l'image
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('blogs', 'public');
            $validated['image'] = $imagePath;
        }

        $blog = Blog::create($validated);

        return redirect()->route('admin.blog.index')->with('success', 'Article créé avec succès.');
    }

    public function edit(Blog $blog)
    {
        return Inertia::render('Admin/Blog/Edit', [
            'article' => $blog,
            'categories' => $this->getCategories(),
        ]);
    }

    public function update(Request $request, Blog $blog)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:blogs,slug,'.$blog->id,
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'category' => 'nullable|string|max:255',
            'author' => 'nullable|string|max:255',
            'status' => 'required|in:draft,published,archived',
            'read_time' => 'nullable|integer|min:1',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'is_featured' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        // Calculer le temps de lecture si non fourni
        if (empty($validated['read_time'])) {
            $wordCount = str_word_count(strip_tags($validated['content']));
            $validated['read_time'] = max(1, ceil($wordCount / 200));
        }

        // Upload de l'image si nouvelle
        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image
            if ($blog->image) {
                \Storage::disk('public')->delete($blog->image);
            }
            $imagePath = $request->file('image')->store('blogs', 'public');
            $validated['image'] = $imagePath;
        } else {
            // Garder l'image existante
            $validated['image'] = $blog->image;
        }

        $blog->update($validated);

        return redirect()->route('admin.blog.index')->with('success', 'Article mis à jour avec succès.');
    }

    public function destroy(Blog $blog)
    {
        if ($blog->image) {
            \Storage::disk('public')->delete($blog->image);
        }
        $blog->delete();

        return redirect()->route('admin.blog.index')->with('success', 'Article supprimé.');
    }

    private function getCategories()
    {
        return [
            'Guide Hardware',
            'Configs PC',
            'Actualités',
            'Tutoriels',
            'Tests & Avis',
            'Promotions',
        ];
    }
}
