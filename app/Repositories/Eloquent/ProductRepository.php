<?php

namespace App\Repositories\Eloquent;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductRepository implements ProductRepositoryInterface
{
    /** @return LengthAwarePaginator<int, Product> */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Product::query()->with('creator')->latest('id')->paginate($perPage);
    }

    public function findOrFail(int $id): Product
    {
        return Product::query()->findOrFail($id);
    }

    public function create(array $attributes): Product
    {
        return Product::query()->create($attributes);
    }

    public function update(Product $product, array $attributes): bool
    {
        return $product->update($attributes);
    }

    public function delete(Product $product): bool
    {
        return (bool) $product->delete();
    }
}
