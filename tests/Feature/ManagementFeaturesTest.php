<?php

use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

function managementUser(string $role, string $email): User
{
    $user = User::factory()->create(['email' => $email]);
    $user->assignRole($role);

    return $user;
}

test('admin can create a shop and product', function () {
    $admin = managementUser('admin', 'admin-management@example.com');
    $owner = managementUser('shop_owner', 'owner-management@example.com');

    $this->actingAs($admin)
        ->post(route('admin.shops.store'), [
            'owner_id' => $owner->id,
            'name' => 'Admin Shop',
            'slug' => 'admin-shop',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.shops.index'));

    $this->actingAs($admin)
        ->post(route('admin.products.store'), [
            'name' => 'Catalog Product',
            'slug' => 'catalog-product',
            'base_price' => 250,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.products.index'));

    $this->assertDatabaseHas('shops', ['slug' => 'admin-shop', 'owner_id' => $owner->id]);
    $this->assertDatabaseHas('products', ['slug' => 'catalog-product', 'created_by' => $admin->id]);
});

test('admin can create a shop owner account', function () {
    $admin = managementUser('admin', 'admin-owner@example.com');

    $this->actingAs($admin)
        ->post(route('admin.shop-owners.store'), [
            'name' => 'New Owner',
            'email' => 'new-owner@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.shop-owners.index'));

    expect(User::where('email', 'new-owner@example.com')->firstOrFail()->hasRole('shop_owner'))->toBeTrue();
});

test('admin product thumbnail is stored safely', function () {
    Storage::fake('public');
    $admin = managementUser('admin', 'admin-image@example.com');

    $this->actingAs($admin)
        ->post(route('admin.products.store'), [
            'name' => 'Image Product',
            'slug' => 'image-product',
            'base_price' => 300,
            'thumbnail' => UploadedFile::fake()->image('product.jpg'),
        ])
        ->assertSessionHasNoErrors();

    $product = Product::where('slug', 'image-product')->firstOrFail();

    expect($product->thumbnail_path)->not->toBeNull();
    Storage::disk('public')->assertExists($product->thumbnail_path);
});

test('admin can toggle a product status', function () {
    $admin = managementUser('admin', 'admin-toggle@example.com');
    $product = Product::factory()->create([
        'created_by' => $admin->id,
        'is_active' => true,
    ]);

    $this->actingAs($admin)
        ->patch(route('admin.products.toggle-status', $product))
        ->assertRedirect();

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'is_active' => false,
    ]);

    $this->actingAs($admin)
        ->patch(route('admin.products.toggle-status', $product))
        ->assertRedirect();

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'is_active' => true,
    ]);
});

test('shop owner can list and update a shared catalog product', function () {
    $admin = managementUser('admin', 'admin-catalog@example.com');
    $owner = managementUser('shop_owner', 'owner-catalog@example.com');
    $shop = Shop::factory()->create(['owner_id' => $owner->id]);
    $product = Product::factory()->create(['created_by' => $admin->id, 'is_active' => true]);

    $this->actingAs($owner)
        ->post(route('shop-owner.catalog.list', $product), ['price' => 425])
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('shop_product', [
        'shop_id' => $shop->id,
        'product_id' => $product->id,
        'price' => 425,
    ]);

    $this->actingAs($owner)
        ->patch(route('shop-owner.listings.update', $product), [
            'price' => 450,
            'display_name' => 'Featured Product',
            'description' => 'Shop-specific details',
        ])
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('shop_product', [
        'shop_id' => $shop->id,
        'product_id' => $product->id,
        'price' => 450,
        'display_name' => 'Featured Product',
    ]);
});

test('shop owner cannot update another shop owner listing', function () {
    $admin = managementUser('admin', 'admin-isolation@example.com');
    $owner = managementUser('shop_owner', 'owner-isolation@example.com');
    $otherOwner = managementUser('shop_owner', 'other-owner-isolation@example.com');
    $product = Product::factory()->create(['created_by' => $admin->id]);
    Shop::factory()->create(['owner_id' => $otherOwner->id])->products()->attach($product, ['price' => 100]);

    $this->actingAs($owner)
        ->patch(route('shop-owner.listings.update', $product), ['price' => 999])
        ->assertNotFound();
});

test('shop owner cannot access admin management routes', function () {
    $owner = managementUser('shop_owner', 'owner-access@example.com');

    $this->actingAs($owner)
        ->get(route('admin.products.index'))
        ->assertForbidden();
});
