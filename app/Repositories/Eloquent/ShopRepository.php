<?php

namespace App\Repositories\Eloquent;

use App\Models\Shop;
use App\Repositories\Contracts\ShopRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class ShopRepository implements ShopRepositoryInterface
{
    /** @return LengthAwarePaginator<int, Shop> */
    public function paginate(int $perPage = 15, ?string $search = null): LengthAwarePaginator
    {
        $query = Shop::query()->with('owner');

        if ($search !== null && $search !== '') {
            $searchTerm = "%{$search}%";

            $query->where(function ($query) use ($searchTerm): void {
                $query->where('name', 'like', $searchTerm)
                    ->orWhere('slug', 'like', $searchTerm)
                    ->orWhereHas('owner', function ($query) use ($searchTerm): void {
                        $query->where('name', 'like', $searchTerm)
                            ->orWhere('email', 'like', $searchTerm);
                    });
            });
        }

        return $query->latest('id')->paginate($perPage)->withQueryString();
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
