<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Blog;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index()
    {
        $products = Product::where('is_active', true)->latest()->get();
        $categories = Category::all();
        $posts = Blog::published()->latest()->get();

        return response()->view('sitemap', [
            'products' => $products,
            'categories' => $categories,
            'posts' => $posts,
        ])->header('Content-Type', 'text/xml');
    }
}
