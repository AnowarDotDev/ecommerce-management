<?php

namespace App\Http\Controllers\ShopOwner;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShopOwner\StoreProductRequest;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('shop-owner/products/create');
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
