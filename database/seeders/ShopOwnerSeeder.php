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
        $owners = [
            ['name' => 'Shop Owner', 'email' => 'owner@example.com'],
        ];

        foreach (range(2, 10) as $number) {
            $owners[] = [
                'name' => "Shop Owner {$number}",
                'email' => "owner{$number}@example.com",
            ];
        }

        foreach ($owners as $owner) {
            User::factory()->create($owner)->assignRole('shop_owner');
        }
    }
}
