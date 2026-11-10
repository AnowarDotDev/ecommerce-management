<?php

use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

function storefrontUser(string $role, string $email): User
{
    $user = User::factory()->create(['email' => $email]);
    $user->assignRole($role);

    return $user;
}

test('customer can browse active shops', function () {
    $customer = storefrontUser('customer', 'customer-shops@example.com');
    $owner = storefrontUser('shop_owner', 'owner-shops@example.com');
    $activeShop = Shop::factory()->create([
        'owner_id' => $owner->id,
        'name' => 'Active Shop',
        'is_active' => true,
    ]);
    Shop::factory()->create([
        'owner_id' => $owner->id,
        'name' => 'Inactive Shop',
        'is_active' => false,
    ]);

    $this->actingAs($customer)
        ->get(route('storefront.shops'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('storefront/index')
            ->has('shops', 1)
            ->where('shops.0.id', $activeShop->id)
            ->where('shops.0.name', 'Active Shop'));
});

test('customer can view only active shop products with shop overrides', function () {
    $customer = storefrontUser('customer', 'customer-storefront@example.com');
    $owner = storefrontUser('shop_owner', 'owner-storefront@example.com');
    $shop = Shop::factory()->create([
        'owner_id' => $owner->id,
        'name' => 'Public Shop',
        'is_active' => true,
    ]);
    $activeProduct = Product::factory()->create([
        'name' => 'Active Product',
        'is_active' => true,
    ]);
    $inactiveProduct = Product::factory()->create(['is_active' => false]);
    $shop->products()->attach($activeProduct, [
        'price' => 125,
        'display_name' => 'Featured Product',
        'description' => 'Shop-specific description',
        'is_active' => true,
    ]);
    $shop->products()->attach($inactiveProduct, ['price' => 200, 'is_active' => true]);

    $this->actingAs($customer)
        ->get(route('storefront.shop', $shop))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('storefront/shop')
            ->where('shop.name', 'Public Shop')
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Featured Product')
            ->where('products.data.0.price', '125.00')
            ->where('products.data.0.description', 'Shop-specific description'));
});

test('customer cannot view an inactive shop storefront', function () {
    $customer = storefrontUser('customer', 'customer-inactive@example.com');
    $owner = storefrontUser('shop_owner', 'owner-inactive@example.com');
    $shop = Shop::factory()->create(['owner_id' => $owner->id, 'is_active' => false]);

    $this->actingAs($customer)
        ->get(route('storefront.shop', $shop))
        ->assertNotFound();
});

test('users without storefront permission cannot access a storefront', function () {
    $owner = storefrontUser('shop_owner', 'owner-permission@example.com');
    $shop = Shop::factory()->create(['owner_id' => $owner->id]);

    $this->actingAs(User::factory()->create())
        ->get(route('storefront.shop', $shop))
        ->assertForbidden();
});
