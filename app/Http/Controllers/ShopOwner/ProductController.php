<?php

namespace App\Http\Controllers\ShopOwner;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShopOwner\StoreProductRequest;
use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $shop = $request->user()->shops()->firstOrFail();
        $products = $shop->products()
            ->with('creator:id,name')
            ->orderByDesc('shop_product.created_at')
            ->paginate(12)
            ->through(function (Product $product): array {
                $thumbnailPath = $product->pivot->thumbnail_path ?? $product->thumbnail_path;

                return [
                    ...$product->toArray(),
                    'listing' => [
                        'price' => $product->pivot->price,
                        'display_name' => $product->pivot->display_name,
                        'description' => $product->pivot->description,
                        'thumbnail_path' => $product->pivot->thumbnail_path,
                        'is_active' => (bool) $product->pivot->is_active,
                    ],
                    'thumbnail_url' => $thumbnailPath !== null
                        ? Storage::disk('public')->url($thumbnailPath)
                        : null,
                ];
            });

        return Inertia::render('shop-owner/products/index', [
            'shop' => $shop,
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('shop-owner/products/create');
    }

    public function edit(Request $request, Product $product): Response
    {
        $shop = $request->user()->shops()->firstOrFail();
        $listing = $shop->listings()
            ->where('product_id', $product->id)
            ->firstOrFail();

        return Inertia::render('shop-owner/products/edit', [
            'product' => [
                ...$product->toArray(),
                'thumbnail_url' => $product->thumbnail_path !== null
                    ? Storage::disk('public')->url($product->thumbnail_path)
                    : null,
            ],
            'listing' => [
                'price' => $listing->price,
                'display_name' => $listing->display_name,
                'description' => $listing->description,
                'thumbnail_url' => $listing->thumbnail_path !== null
                    ? Storage::disk('public')->url($listing->thumbnail_path)
                    : null,
            ],
        ]);
    }

    public function store(StoreProductRequest $request, ProductRepositoryInterface $products): RedirectResponse
    {
        $attributes = $request->validated();
        $thumbnail = $request->file('thumbnail');
        unset($attributes['thumbnail']);
        $attributes['created_by'] = $request->user()->id;
        $attributes['thumbnail_path'] = $thumbnail?->store('products', 'public');
        $products->create($attributes);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product created in the shared catalog.']);

        return to_route('shop-owner.catalog.index');
    }
}
