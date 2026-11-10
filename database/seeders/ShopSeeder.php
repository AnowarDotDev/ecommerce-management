<?php

namespace Database\Seeders;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Seeder;

class ShopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owner = User::query()->role('shop_owner')->firstOrFail();

        Shop::factory()->create([
            'owner_id' => $owner->id,
            'name' => 'Demo Shop',
            'slug' => 'demo-shop',
        ]);
    }
}
