<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class ShopOwnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Shop Owner',
            'email' => 'owner@example.com',
        ])->assignRole('shop_owner');
    }
}
