<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->get('type', 'banner');
        $position = $request->get('position');

        $query = Banner::active();

        if ($type) {
            $query->where('type', $type);
        }

        if ($position) {
            $query->where('position', $position);
        }

        $banners = $query->orderBy('sort_order')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $banners->map(function ($banner) {
                return [
                    'id' => $banner->id,
                    'title' => $banner->title,
                    'type' => $banner->type,
                    'image' => $banner->image ? asset('storage/'.$banner->image) : null,
                    'mobile_image' => $banner->mobile_image ? asset('storage/'.$banner->mobile_image) : null,
                    'link' => $banner->link,
                    'description' => $banner->description,
                    'position' => $banner->position,
                    'display_duration' => $banner->display_duration,
                    'button_text' => $banner->button_text,
                    'button_link' => $banner->button_link,
                ];
            }),
        ]);
    }
}
