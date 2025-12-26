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
    Route::get('orders/{order}/invoice', [\App\Http\Controllers\Admin\AdminOrderController::class, 'downloadInvoice'])->name('orders.invoice');
    Route::resource('users', \App\Http\Controllers\Admin\AdminUserController::class);
    Route::get('/settings', [\App\Http\Controllers\Admin\AdminSettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [\App\Http\Controllers\Admin\AdminSettingController::class, 'store'])->name('settings.store');

    // Routes additionnelles complètes
    Route::resource('customers', \App\Http\Controllers\Admin\AdminCustomerController::class);
    Route::resource('reviews', \App\Http\Controllers\Admin\AdminReviewController::class);
    Route::post('reviews/{review}/approve', [\App\Http\Controllers\Admin\AdminReviewController::class, 'approve'])->name('reviews.approve');
    Route::post('reviews/{review}/reject', [\App\Http\Controllers\Admin\AdminReviewController::class, 'reject'])->name('reviews.reject');
    
    Route::resource('questions', \App\Http\Controllers\Admin\AdminQuestionController::class);
    Route::post('questions/{question}/answer', [\App\Http\Controllers\Admin\AdminQuestionController::class, 'answer'])->name('questions.answer');
    Route::post('questions/{question}/toggle-visibility', [\App\Http\Controllers\Admin\AdminQuestionController::class, 'toggleVisibility'])->name('questions.toggle-visibility');
    
    Route::resource('messages', \App\Http\Controllers\Admin\AdminMessageController::class);
    Route::post('messages/{message}/mark-as-read', [\App\Http\Controllers\Admin\AdminMessageController::class, 'markAsRead'])->name('messages.mark-as-read');
    Route::post('messages/{message}/mark-as-replied', [\App\Http\Controllers\Admin\AdminMessageController::class, 'markAsReplied'])->name('messages.mark-as-replied');
    Route::post('messages/{message}/archive', [\App\Http\Controllers\Admin\AdminMessageController::class, 'archive'])->name('messages.archive');
    
    Route::resource('blog', \App\Http\Controllers\Admin\AdminBlogController::class);
    
    // Routes spécifiques avant la ressource pour éviter les conflits
    Route::get('newsletter/export', [\App\Http\Controllers\Admin\AdminNewsletterController::class, 'export'])->name('newsletter.export');
    Route::post('newsletter/{newsletter}/toggle-status', [\App\Http\Controllers\Admin\AdminNewsletterController::class, 'toggleStatus'])->name('newsletter.toggle-status');
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

// SEO Tools
Route::get('/sitemap.xml', [\App\Http\Controllers\SitemapController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Fallback pour SPA
|--------------------------------------------------------------------------
| Toutes les autres routes retournent l'application React
*/

Route::get('/{any}', function () {
    return Inertia::render('ClientEntry');
})->where('any', '.*');
