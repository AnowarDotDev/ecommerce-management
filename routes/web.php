<?php

use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ShopController as AdminShopController;
use App\Http\Controllers\Admin\ShopOwnerController;
use App\Http\Controllers\ShopOwner\CatalogController;
use App\Http\Controllers\ShopOwner\ListingController;
use App\Http\Controllers\ShopOwner\ProductController as ShopOwnerProductController;
use App\Http\Controllers\StorefrontController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('shops', [StorefrontController::class, 'index'])
        ->middleware('permission:view storefront')
        ->name('storefront.shops');
    Route::get('shops/{shop}/products', [StorefrontController::class, 'shop'])
        ->middleware('permission:view storefront')
        ->name('storefront.shop');

    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        Route::patch('shops/{shop}/toggle-status', [AdminShopController::class, 'toggleStatus'])
            ->name('shops.toggle-status');
        Route::resource('shops', AdminShopController::class)->except(['show']);
        Route::patch('products/{product}/toggle-status', [AdminProductController::class, 'toggleStatus'])
            ->name('products.toggle-status');
        Route::resource('products', AdminProductController::class)->except(['show']);
        Route::resource('shop-owners', ShopOwnerController::class)
            ->parameters(['shop-owners' => 'shopOwner'])
            ->only(['index', 'create', 'store', 'edit', 'update']);
    });

    Route::prefix('shop-owner')->name('shop-owner.')->middleware('role:shop_owner')->group(function () {
        Route::get('catalog', [CatalogController::class, 'index'])->name('catalog.index');
        Route::get('products/create', [ShopOwnerProductController::class, 'create'])->name('products.create');
        Route::post('products', [ShopOwnerProductController::class, 'store'])->name('products.store');
        Route::post('catalog/{product}/list', [ListingController::class, 'store'])->name('catalog.list');
        Route::patch('listings/{product}', [ListingController::class, 'update'])->name('listings.update');
        Route::delete('listings/{product}', [ListingController::class, 'destroy'])->name('listings.destroy');
    });
});

require __DIR__.'/settings.php';
