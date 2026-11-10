<?php

namespace App\Http\Controllers\ShopOwner;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function index(Request $request): Response
    {
        $shop = $request->user()->shops()->firstOrFail();
        $products = Product::query()
            ->where('is_active', true)
            ->whereDoesntHave('listings', fn ($query) => $query->where('shop_id', $shop->id))
            ->with(['creator:id,name', 'listings' => fn ($query) => $query->where('shop_id', $shop->id)])
            ->latest('id')
            ->paginate(15)
            ->through(function (Product $product): array {
                $listing = $product->listings->first();
                $thumbnailPath = $product->thumbnail_path;

                if ($listing !== null && $listing->thumbnail_path !== null) {
                    $thumbnailPath = $listing->thumbnail_path;
                }

                return [
                    ...$product->toArray(),
                    'thumbnail_url' => $thumbnailPath !== null
                        ? Storage::disk('public')->url($thumbnailPath)
                        : null,
                ];
            });

        return Inertia::render('shop-owner/catalog', [
            'shop' => $shop,
            'products' => $products,
        ]);
    }
}
