<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function show($slug)
    {
        $page = Page::published()->where('slug', $slug)->firstOrFail();

        return response()->json([
            'data' => $page
        ]);
    }
}
