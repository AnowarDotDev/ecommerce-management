<?php

namespace App\Repositories\Eloquent;

use App\Models\ShopProduct;
use App\Repositories\Contracts\ShopProductRepositoryInterface;

class ShopProductRepository implements ShopProductRepositoryInterface
{
    public function findOrFail(int $shopId, int $productId): ShopProduct
    {
        return ShopProduct::query()
            ->where('shop_id', $shopId)
            ->where('product_id', $productId)
            ->firstOrFail();
    }

    public function create(array $attributes): ShopProduct
    {
        return ShopProduct::query()->create($attributes);
    }

    public function update(ShopProduct $listing, array $attributes): bool
    {
        return $listing->update($attributes);
    }

    public function delete(ShopProduct $listing): bool
    {
        return (bool) $listing->delete();
    }
}
