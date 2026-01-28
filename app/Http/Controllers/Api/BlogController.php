<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = Blog::where('status', 'published');

        // Filtre par catégorie
        if ($request->has('category') && $request->category !== 'Tous') {
            $query->where('category', $request->category);
        }

        // Recherche
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                    ->orWhere('excerpt', 'like', "%{$request->search}%")
                    ->orWhere('content', 'like', "%{$request->search}%");
            });
        }

        $blogs = $query->orderBy('is_featured', 'desc')
            ->orderBy('sort_order')
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 12));

        return response()->json([
            'success' => true,
            'data' => $blogs->map(function ($blog) {
                return [
                    'id' => $blog->id,
                    'title' => $blog->title,
                    'slug' => $blog->slug,
                    'excerpt' => $blog->excerpt,
                    'content' => $blog->content,
                    'image' => $blog->image ? asset('storage/'.$blog->image) : asset('images/back.jpg'),
                    'category' => $blog->category,
                    'author' => $blog->author,
                    'date' => \Carbon\Carbon::parse($blog->created_at)->locale('fr')->translatedFormat('d M Y'),
                    'read_time' => $blog->read_time ?? 5,
                    'views' => $blog->views,
                    'is_featured' => $blog->is_featured,
                ];
            }),
            'meta' => [
                'current_page' => $blogs->currentPage(),
                'last_page' => $blogs->lastPage(),
                'per_page' => $blogs->perPage(),
                'total' => $blogs->total(),
            ],
        ]);
    }

    public function show($slug)
    {
        $blog = Blog::where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        // Incrémenter les vues
        $blog->increment('views');

        // Articles connexes (même catégorie)
        $relatedPosts = Blog::where('category', $blog->category)
            ->where('id', '!=', $blog->id)
            ->where('status', 'published')
            ->take(3)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'image' => $post->image ? asset('storage/'.$post->image) : asset('images/back.jpg'),
                    'date' => \Carbon\Carbon::parse($post->created_at)->locale('fr')->translatedFormat('d M Y'),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $blog->id,
                'title' => $blog->title,
                'slug' => $blog->slug,
                'excerpt' => $blog->excerpt,
                'content' => $blog->content,
                'image' => $blog->image ? asset('storage/'.$blog->image) : asset('images/back.jpg'),
                'category' => $blog->category,
                'author' => $blog->author,
                'date' => \Carbon\Carbon::parse($blog->created_at)->locale('fr')->translatedFormat('d M Y'),
                'read_time' => $blog->read_time ?? 5,
                'views' => $blog->views,
                'meta_title' => $blog->meta_title,
                'meta_description' => $blog->meta_description,
                'related_posts' => $relatedPosts,
            ],
        ]);
    }

    public function categories()
    {
        $categories = Blog::where('status', 'published')
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }
}
