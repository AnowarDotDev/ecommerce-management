<?php

namespace App\Repositories\Contracts;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface
{
    /** @return LengthAwarePaginator<int, Product> */
    public function paginate(int $perPage = 15): LengthAwarePaginator;

    public function findOrFail(int $id): Product;

    /** @param array<string, mixed> $attributes */
    public function create(array $attributes): Product;

    /** @param array<string, mixed> $attributes */
    public function update(Product $product, array $attributes): bool;

    public function delete(Product $product): bool;
}
