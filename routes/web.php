<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Routes ADMIN (Protégées par middleware role:admin)
|--------------------------------------------------------------------------
| Toutes les routes client sont maintenant gérées par l'API REST.
| Seules les routes admin Inertia sont conservées ici.
*/

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard admin
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    
    // CRUD Produits & Catégories
    Route::resource('products', \App\Http\Controllers\Admin\AdminProductController::class);
    Route::resource('categories', \App\Http\Controllers\Admin\AdminCategoryController::class);
    Route::resource('orders', \App\Http\Controllers\Admin\AdminOrderController::class);
    Route::resource('users', \App\Http\Controllers\Admin\AdminUserController::class);
    Route::get('/settings', [\App\Http\Controllers\Admin\AdminSettingController::class, 'index'])->name('settings.index');

    // Routes additionnelles complètes
    Route::resource('customers', \App\Http\Controllers\Admin\AdminCustomerController::class);
    Route::resource('reviews', \App\Http\Controllers\Admin\AdminReviewController::class);
    Route::resource('questions', \App\Http\Controllers\Admin\AdminQuestionController::class);
    Route::resource('messages', \App\Http\Controllers\Admin\AdminMessageController::class);
    Route::resource('blog', \App\Http\Controllers\Admin\AdminBlogController::class);
    Route::resource('newsletter', \App\Http\Controllers\Admin\AdminNewsletterController::class);
    Route::resource('collections', \App\Http\Controllers\Admin\AdminCollectionController::class);
    Route::resource('pages', \App\Http\Controllers\Admin\AdminPageController::class);
    Route::resource('banners', \App\Http\Controllers\Admin\AdminBannerController::class);
});

// Redirection pour le middleware auth
Route::get('/login', function () {
    return view('app');
})->name('login');

Route::post('/logout', function (Illuminate\Http\Request $request) {
    Illuminate\Support\Facades\Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
})->name('logout');

/*
|--------------------------------------------------------------------------
| Fallback pour SPA
|--------------------------------------------------------------------------
| Toutes les autres routes retournent l'application React
*/

Route::get('/{any}', function () {
    return Inertia::render('ClientEntry');
})->where('any', '.*');
