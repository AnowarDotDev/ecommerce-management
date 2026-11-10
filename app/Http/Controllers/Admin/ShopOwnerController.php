<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreShopOwnerRequest;
use App\Http\Requests\Admin\UpdateShopOwnerRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ShopOwnerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/shop-owners/index', [
            'shopOwners' => User::query()
                ->role('shop_owner')
                ->withCount('shops')
                ->latest('id')
                ->paginate(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/shop-owners/create');
    }

    public function store(StoreShopOwnerRequest $request): RedirectResponse
    {
        $attributes = $request->validated();
        $attributes['password'] = Hash::make($attributes['password']);
        $shopOwner = User::query()->create($attributes);
        $shopOwner->assignRole('shop_owner');

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Shop owner created successfully.']);

        return to_route('admin.shop-owners.index');
    }

    public function edit(User $shopOwner): Response
    {
        return Inertia::render('admin/shop-owners/edit', ['shopOwner' => $shopOwner]);
    }

    public function update(UpdateShopOwnerRequest $request, User $shopOwner): RedirectResponse
    {
        $attributes = $request->validated();

        if ($attributes['password'] ?? null) {
            $attributes['password'] = Hash::make($attributes['password']);
        } else {
            unset($attributes['password']);
        }

        $shopOwner->update($attributes);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Shop owner updated successfully.']);

        return to_route('admin.shop-owners.index');
    }
}
