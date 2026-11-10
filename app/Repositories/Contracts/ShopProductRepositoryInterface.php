<?php

namespace App\Repositories\Contracts;

use App\Models\ShopProduct;

interface ShopProductRepositoryInterface
{
    public function findOrFail(int $shopId, int $productId): ShopProduct;

    /** @param array<string, mixed> $attributes */
    public function create(array $attributes): ShopProduct;

    /** @param array<string, mixed> $attributes */
    public function update(ShopProduct $listing, array $attributes): bool;

    public function delete(ShopProduct $listing): bool;
}
