<?php

namespace App\Repositories\Contracts;

use App\Models\Shop;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ShopRepositoryInterface
{
    /** @return LengthAwarePaginator<int, Shop> */
    public function paginate(int $perPage = 15): LengthAwarePaginator;

    public function findOrFail(int $id): Shop;

    /** @param array<string, mixed> $attributes */
    public function create(array $attributes): Shop;

    /** @param array<string, mixed> $attributes */
    public function update(Shop $shop, array $attributes): bool;

    public function delete(Shop $shop): bool;
}
