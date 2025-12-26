<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware as InertiaMiddleware;

class HandleInertiaRequests extends InertiaMiddleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                ] : null,
            ],
            'admin_notifications' => $request->user() && $request->user()->role === 'admin' ? [
                'pending_orders' => \App\Models\Order::where('status', 'pending')->count(),
                'new_messages' => \App\Models\Message::where('status', 'new')->count(),
                'pending_reviews' => \App\Models\ProductReview::where('is_approved', false)->count(),
                'pending_questions' => \App\Models\Question::whereNull('answer')->count(),
                'low_stock' => \App\Models\Product::where('stock_quantity', '<=', 5)->count(),
            ] : null,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}
