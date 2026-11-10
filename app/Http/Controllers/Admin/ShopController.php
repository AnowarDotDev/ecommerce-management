<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreShopRequest;
use App\Http\Requests\Admin\UpdateShopRequest;
use App\Models\Shop;
use App\Models\User;
use App\Repositories\Contracts\ShopRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(ShopRepositoryInterface $shops): Response
    {
        return Inertia::render('admin/shops/index', [
            'shops' => $shops->paginate(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/shops/create', [
            'owners' => User::role('shop_owner')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreShopRequest $request, ShopRepositoryInterface $shops): RedirectResponse
    {
        $attributes = $request->validated();

        unset($attributes['logo']);
        $attributes['logo'] = $request->file('logo')?->store('shops', 'public');
        $shops->create($attributes);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Shop created successfully.']);

        return to_route('admin.shops.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Shop $shop): Response
    {
        return Inertia::render('admin/shops/show', ['shop' => $shop->load('owner')]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Shop $shop): Response
    {
        return Inertia::render('admin/shops/edit', [
            'shop' => $shop,
            'owners' => User::role('shop_owner')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateShopRequest $request, Shop $shop): RedirectResponse
    {
        $attributes = $request->validated();
        $oldLogo = $shop->logo;
        $newLogo = $request->file('logo')?->store('shops', 'public');

        unset($attributes['logo']);
        if ($newLogo !== null) {
            $attributes['logo'] = $newLogo;
        }

        app(ShopRepositoryInterface::class)->update($shop, $attributes);

        if ($newLogo !== null && $oldLogo !== null) {
            Storage::disk('public')->delete($oldLogo);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Shop updated successfully.']);

        return to_route('admin.shops.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Shop $shop, ShopRepositoryInterface $shops): RedirectResponse
    {
        Gate::authorize('delete', $shop);
        $logo = $shop->logo;
        $shops->delete($shop);

        if ($logo !== null) {
            Storage::disk('public')->delete($logo);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Shop deleted successfully.']);

        return to_route('admin.shops.index');
    }
}
