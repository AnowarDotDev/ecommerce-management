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
        return Inertia::render('admin/products/index', ['products' => $products->paginate()]);
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
        return Inertia::render('admin/products/edit', ['product' => $product]);
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
