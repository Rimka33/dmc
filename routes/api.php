<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ShopController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\WishlistController;

use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes - Frontend/Backend Séparés
|--------------------------------------------------------------------------
| Backend API REST complet pour le site e-commerce DMC
*/

// ============================================================================
// AUTHENTIFICATION
// ============================================================================

Route::prefix('auth')->group(function () {
    // Public
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    
    // Protégé (nécessite token Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/password', [AuthController::class, 'updatePassword']);
    });
});

// ============================================================================
// PAGES PUBLIQUES
// ============================================================================

// Homepage data
Route::get('/home', [HomeController::class, 'index']);

// Shop & Products
Route::get('/shop', [ShopController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/new', [ProductController::class, 'new']);
Route::get('/products/on-sale', [ProductController::class, 'onSale']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/search', [ProductController::class, 'search']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

// Blog
Route::get('/blog', [\App\Http\Controllers\Api\BlogController::class, 'index']);
Route::get('/blog/categories', [\App\Http\Controllers\Api\BlogController::class, 'categories']);
Route::get('/blog/{slug}', [\App\Http\Controllers\Api\BlogController::class, 'show']);

// Banners
Route::get('/banners', [\App\Http\Controllers\Api\BannerController::class, 'index']);

// Pages
Route::get('/pages/{slug}', [\App\Http\Controllers\Api\PageController::class, 'show']);

// Special Offers
Route::get('/special-offers', [HomeController::class, 'specialOffers']);

// ============================================================================
// PANIER (Session-based pour invités, DB pour connectés)
// ============================================================================

Route::prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'index']);
    Route::post('/add', [CartController::class, 'add']);
    Route::put('/update/{productId}', [CartController::class, 'update']);
    Route::delete('/remove/{productId}', [CartController::class, 'remove']);
    Route::delete('/clear', [CartController::class, 'clear']);
    Route::get('/count', [CartController::class, 'count']);
});

// ============================================================================
// COMMANDES
// ============================================================================

Route::prefix('orders')->group(function () {
    // Public - Créer une commande
    Route::post('/', [OrderController::class, 'store']);
    Route::get('/{orderNumber}', [OrderController::class, 'show']);
    
    // Protégé - Historique des commandes utilisateur
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user/history', [OrderController::class, 'userOrders']);
        Route::get('/user/{id}', [OrderController::class, 'userOrderDetails']);
    });
});

// ============================================================================
// WISHLIST (Liste de souhaits) - Authentification requise
// ============================================================================

Route::middleware('auth:sanctum')->prefix('wishlist')->group(function () {
    Route::get('/', [WishlistController::class, 'index']);
    Route::post('/', [WishlistController::class, 'store']);
    Route::delete('/{productId}', [WishlistController::class, 'destroy']);
    Route::get('/check/{productId}', [WishlistController::class, 'check']);
    Route::delete('/clear/all', [WishlistController::class, 'clear']);
});

// ============================================================================
// AVIS PRODUITS
// ============================================================================

// Public - Voir les avis et questions
Route::get('/products/{productId}/reviews', [ReviewController::class, 'index']);
Route::get('/products/{productId}/questions', [QuestionController::class, 'index']);

// Authentifié - Gérer ses avis et questions
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/reviews/shop', [ReviewController::class, 'storeShopReview']);
    Route::post('/products/{productId}/reviews', [ReviewController::class, 'store']);
    Route::post('/products/{productId}/questions', [QuestionController::class, 'store']);
    Route::put('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
    Route::post('/reviews/{id}/helpful', [ReviewController::class, 'markHelpful']);
});

// ============================================================================
// ADRESSES DE LIVRAISON - Authentification requise
// ============================================================================

Route::middleware('auth:sanctum')->prefix('addresses')->group(function () {
    Route::get('/', [AddressController::class, 'index']);
    Route::post('/', [AddressController::class, 'store']);
    Route::put('/{id}', [AddressController::class, 'update']);
    Route::delete('/{id}', [AddressController::class, 'destroy']);
    Route::post('/{id}/default', [AddressController::class, 'setDefault']);
});

// ============================================================================
// NOTIFICATIONS - Authentification requise
// ============================================================================

Route::middleware('auth:sanctum')->prefix('notifications')->group(function () {
    Route::get('/', [NotificationController::class, 'index']);
    Route::get('/unread', [NotificationController::class, 'unread']);
    Route::get('/count', [NotificationController::class, 'count']);
    Route::post('/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/{id}', [NotificationController::class, 'destroy']);
});

// ============================================================================
// CONTACT
// ============================================================================

Route::post('/contact', [ContactController::class, 'submit']);
Route::middleware('auth:sanctum')->get('/contact/my-messages', [ContactController::class, 'userMessages']);
Route::post('/newsletter/subscribe', [\App\Http\Controllers\Api\NewsletterController::class, 'subscribe']);

// ============================================================================
// ROUTES ADMIN - Authentification + Role Admin requis
// ============================================================================

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    
    // Dashboard & Statistiques
    Route::get('/dashboard', [\App\Http\Controllers\Api\Admin\DashboardController::class, 'index']);
    Route::get('/dashboard/sales-stats', [\App\Http\Controllers\Api\Admin\DashboardController::class, 'salesStats']);
    
    // Gestion Produits
    Route::prefix('products')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\Admin\ProductController::class, 'index']);
        Route::post('/', [\App\Http\Controllers\Api\Admin\ProductController::class, 'store']);
        Route::get('/{id}', [\App\Http\Controllers\Api\Admin\ProductController::class, 'show']);
        Route::put('/{id}', [\App\Http\Controllers\Api\Admin\ProductController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\Api\Admin\ProductController::class, 'destroy']);
        Route::post('/{id}/images', [\App\Http\Controllers\Api\Admin\ProductController::class, 'uploadImage']);
        Route::delete('/{productId}/images/{imageId}', [\App\Http\Controllers\Api\Admin\ProductController::class, 'deleteImage']);
    });
    
    // Gestion Catégories
    Route::prefix('categories')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\Admin\CategoryController::class, 'index']);
        Route::post('/', [\App\Http\Controllers\Api\Admin\CategoryController::class, 'store']);
        Route::get('/{id}', [\App\Http\Controllers\Api\Admin\CategoryController::class, 'show']);
        Route::put('/{id}', [\App\Http\Controllers\Api\Admin\CategoryController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\Api\Admin\CategoryController::class, 'destroy']);
    });
    
    // Gestion Commandes
    Route::prefix('orders')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\Admin\OrderController::class, 'index']);
        Route::get('/stats', [\App\Http\Controllers\Api\Admin\OrderController::class, 'stats']);
        Route::get('/{id}', [\App\Http\Controllers\Api\Admin\OrderController::class, 'show']);
        Route::put('/{id}/status', [\App\Http\Controllers\Api\Admin\OrderController::class, 'updateStatus']);
        Route::get('/{id}/history', [\App\Http\Controllers\Api\Admin\OrderController::class, 'statusHistory']);
    });
    
    // Gestion Clients
    Route::prefix('customers')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\Admin\CustomerController::class, 'index']);
        Route::get('/stats', [\App\Http\Controllers\Api\Admin\CustomerController::class, 'stats']);
        Route::get('/{id}', [\App\Http\Controllers\Api\Admin\CustomerController::class, 'show']);
        Route::post('/{id}/toggle-status', [\App\Http\Controllers\Api\Admin\CustomerController::class, 'toggleStatus']);
        Route::get('/{id}/orders', [\App\Http\Controllers\Api\Admin\CustomerController::class, 'orders']);
    });
    
    // Modération Avis
    Route::prefix('reviews')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\Admin\ReviewController::class, 'index']);
        Route::get('/stats', [\App\Http\Controllers\Api\Admin\ReviewController::class, 'stats']);
        Route::post('/{id}/approve', [\App\Http\Controllers\Api\Admin\ReviewController::class, 'approve']);
        Route::post('/{id}/reject', [\App\Http\Controllers\Api\Admin\ReviewController::class, 'reject']);
        Route::delete('/{id}', [\App\Http\Controllers\Api\Admin\ReviewController::class, 'destroy']);
    });
});

// ============================================================================
// ROUTE DE TEST
// ============================================================================

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
