<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(ProductRepositoryInterface $products): Response
    {
        $paginatedProducts = $products->paginate();
        $paginatedProducts->getCollection()->transform(function (Product $product): Product {
            $product->setAttribute(
                'thumbnail_url',
                $product->thumbnail_path !== null
                    ? Storage::disk('public')->url($product->thumbnail_path)
                    : null,
            );

            return $product;
        });

        return Inertia::render('admin/products/index', ['products' => $paginatedProducts]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/products/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request, ProductRepositoryInterface $products): RedirectResponse
    {
        $attributes = $request->validated();
        $thumbnail = $request->file('thumbnail');
        unset($attributes['thumbnail']);
        $attributes['created_by'] = $request->user()->id;
        $attributes['thumbnail_path'] = $thumbnail?->store('products', 'public');
        $products->create($attributes);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product created successfully.']);

        return to_route('admin.products.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): Response
    {
        return Inertia::render('admin/products/show', ['product' => $product->load('creator')]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product): Response
    {
        return Inertia::render('admin/products/edit', [
            'product' => tap($product, function (Product $product): void {
                $product->setAttribute(
                    'thumbnail_url',
                    $product->thumbnail_path !== null
                        ? Storage::disk('public')->url($product->thumbnail_path)
                        : null,
                );
            }),
        ]);
    }

    /**
     * Toggle whether the product is available in the shared catalog.
     */
    public function toggleStatus(Product $product, ProductRepositoryInterface $products): RedirectResponse
    {
        Gate::authorize('update', $product);

        $products->update($product, ['is_active' => ! $product->is_active]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $product->is_active
                ? 'Product activated successfully.'
                : 'Product deactivated successfully.',
        ]);

        return back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product, ProductRepositoryInterface $products): RedirectResponse
    {
        $attributes = $request->validated();
        $oldThumbnail = $product->thumbnail_path;
        $newThumbnail = $request->file('thumbnail')?->store('products', 'public');
        unset($attributes['thumbnail']);
        if ($newThumbnail !== null) {
            $attributes['thumbnail_path'] = $newThumbnail;
        }

        $products->update($product, $attributes);

        if ($newThumbnail !== null && $oldThumbnail !== null) {
            Storage::disk('public')->delete($oldThumbnail);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product updated successfully.']);

        return to_route('admin.products.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product, ProductRepositoryInterface $products): RedirectResponse
    {
        Gate::authorize('delete', $product);
        $thumbnail = $product->thumbnail_path;
        $products->delete($product);

        if ($thumbnail !== null) {
            Storage::disk('public')->delete($thumbnail);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product deleted successfully.']);

        return to_route('admin.products.index');
    }
}
