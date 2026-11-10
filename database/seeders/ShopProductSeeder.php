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
        $products = Product::query()->get();

        Shop::query()->orderBy('id')->each(function (Shop $shop) use ($products): void {
            $shop->products()->sync(
                $products->shuffle()->take(min(8, $products->count()))
                    ->mapWithKeys(fn (Product $product): array => [
                        $product->id => [
                            'price' => fake()->randomFloat(2, 100, 2500),
                            'is_active' => true,
                        ],
                    ])->all(),
            );
        });
    }
}
