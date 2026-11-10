<?php

namespace App\Repositories\Eloquent;

use App\Models\Shop;
use App\Repositories\Contracts\ShopRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ShopRepository implements ShopRepositoryInterface
{
    /** @return LengthAwarePaginator<int, Shop> */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Shop::query()->with('owner')->latest('id')->paginate($perPage);
    }

    public function findOrFail(int $id): Shop
    {
        return Shop::query()->findOrFail($id);
    }

    public function create(array $attributes): Shop
    {
        return Shop::query()->create($attributes);
    }

    public function update(Shop $shop, array $attributes): bool
    {
        return $shop->update($attributes);
    }

    public function delete(Shop $shop): bool
    {
        return (bool) $shop->delete();
    }
}
