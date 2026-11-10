<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Shop;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StorefrontController extends Controller
{
    /**
     * Display active shops that customers can browse.
     */
    public function index(): Response
    {
        $shops = Shop::query()
            ->where('is_active', true)
            ->latest('id')
            ->get()
            ->map(fn (Shop $shop): array => [
                'id' => $shop->id,
                'name' => $shop->name,
                'slug' => $shop->slug,
                'description' => $shop->description,
                'logo_url' => $shop->logo !== null
                    ? Storage::disk('public')->url($shop->logo)
                    : null,
            ])
            ->values();

        return Inertia::render('storefront/index', ['shops' => $shops]);
    }

    /**
     * Display the active products assigned to a shop.
     */
    public function shop(Shop $shop): Response
    {
        abort_unless($shop->is_active, 404);

        $products = $shop->products()
            ->where('products.is_active', true)
            ->wherePivot('is_active', true)
            ->orderBy('products.name')
            ->paginate(12)
            ->through(function (Product $product): array {
                $thumbnailPath = $product->pivot->thumbnail_path ?? $product->thumbnail_path;

                return [
                    'id' => $product->id,
                    'name' => $product->pivot->display_name ?: $product->name,
                    'description' => $product->pivot->description ?: $product->description,
                    'price' => $product->pivot->price,
                    'thumbnail_url' => $thumbnailPath !== null
                        ? Storage::disk('public')->url($thumbnailPath)
                        : null,
                ];
            });

        return Inertia::render('storefront/shop', [
            'shop' => [
                'id' => $shop->id,
                'name' => $shop->name,
                'slug' => $shop->slug,
                'description' => $shop->description,
                'logo_url' => $shop->logo !== null
                    ? Storage::disk('public')->url($shop->logo)
                    : null,
            ],
            'products' => $products,
        ]);
    }
}
