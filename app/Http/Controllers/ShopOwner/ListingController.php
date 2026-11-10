<?php

namespace App\Http\Controllers\ShopOwner;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShopOwner\StoreListingRequest;
use App\Http\Requests\ShopOwner\UpdateListingRequest;
use App\Models\Product;
use App\Repositories\Contracts\ShopProductRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ListingController extends Controller
{
    public function store(StoreListingRequest $request, Product $product, ShopProductRepositoryInterface $listings): RedirectResponse
    {
        $shop = $request->user()->shops()->firstOrFail();
        abort_unless($product->is_active, 404);

        if ($shop->listings()->where('product_id', $product->id)->exists()) {
            return back()->withErrors(['product' => 'This product is already listed in your shop.']);
        }

        $attributes = $request->validated();
        $thumbnail = $request->file('thumbnail');
        unset($attributes['thumbnail']);
        $attributes['shop_id'] = $shop->id;
        $attributes['product_id'] = $product->id;
        $attributes['thumbnail_path'] = $thumbnail?->store('listings', 'public');
        $listings->create($attributes);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product added to your shop.']);

        return back();
    }

    public function update(UpdateListingRequest $request, Product $product, ShopProductRepositoryInterface $listings): RedirectResponse
    {
        $shop = $request->user()->shops()->firstOrFail();
        $listing = $listings->findOrFail($shop->id, $product->id);
        Gate::authorize('update', $listing);

        $attributes = $request->validated();
        $oldThumbnail = $listing->thumbnail_path;
        $newThumbnail = $request->file('thumbnail')?->store('listings', 'public');
        unset($attributes['thumbnail']);
        if ($newThumbnail !== null) {
            $attributes['thumbnail_path'] = $newThumbnail;
        }

        $listings->update($listing, $attributes);

        if ($newThumbnail !== null && $oldThumbnail !== null) {
            Storage::disk('public')->delete($oldThumbnail);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Shop listing updated successfully.']);

        return back();
    }

    public function destroy(Request $request, Product $product, ShopProductRepositoryInterface $listings): RedirectResponse
    {
        $shop = $request->user()->shops()->firstOrFail();
        $listing = $listings->findOrFail($shop->id, $product->id);
        Gate::authorize('delete', $listing);
        $thumbnail = $listing->thumbnail_path;
        $listings->delete($listing);

        if ($thumbnail !== null) {
            Storage::disk('public')->delete($thumbnail);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product removed from your shop.']);

        return back();
    }
}
