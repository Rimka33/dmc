<?php

use Illuminate\Support\Facades\Route;

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
    
    // Les autres routes admin seront ajoutées dans les phases suivantes
});

/*
|--------------------------------------------------------------------------
| Fallback pour SPA
|--------------------------------------------------------------------------
| Toutes les autres routes retournent l'application React
*/

Route::get('/{any}', function () {
    return view('app'); // Vue qui charge le frontend React
})->where('any', '.*');
