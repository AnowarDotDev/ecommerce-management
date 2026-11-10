<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Shop;
use Illuminate\Database\Seeder;

class ShopProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shop = Shop::query()->where('slug', 'demo-shop')->firstOrFail();

        $shop->products()->attach(
            Product::query()->limit(3)->pluck('id')->mapWithKeys(fn (int $productId): array => [
                $productId => ['price' => fake()->randomFloat(2, 100, 2500)],
            ])->all(),
        );
    }
}
