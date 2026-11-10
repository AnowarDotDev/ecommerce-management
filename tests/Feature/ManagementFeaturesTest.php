<?php

use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

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

test('admin listing pages support search', function () {
    $admin = managementUser('admin', 'admin-list-search@example.com');
    $owner = managementUser('shop_owner', 'owner-list-search@example.com');
    $targetOwner = managementUser('shop_owner', 'target-owner@example.com');
    Shop::factory()->create([
        'owner_id' => $owner->id,
        'name' => 'Target Shop',
        'slug' => 'target-shop',
    ]);
    Shop::factory()->create([
        'owner_id' => $targetOwner->id,
        'name' => 'Target Owner Shop',
    ]);
    Product::factory()->create([
        'created_by' => $admin->id,
        'name' => 'Target Product',
        'slug' => 'target-product',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.shops.index', ['search' => 'Target Shop']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/shops/index')
            ->where('search', 'Target Shop')
            ->has('shops.data', 1)
            ->where('shops.data.0.name', 'Target Shop'));

    $this->actingAs($admin)
        ->get(route('admin.products.index', ['search' => 'Target Product']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/index')
            ->where('search', 'Target Product')
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Target Product'));

    $this->actingAs($admin)
        ->get(route('admin.shop-owners.index', ['search' => 'target-owner@example.com']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/shop-owners/index')
            ->where('search', 'target-owner@example.com')
            ->has('shopOwners.data', 1)
            ->where('shopOwners.data.0.email', 'target-owner@example.com')
            ->where('shopOwners.data.0.shops.0.name', 'Target Owner Shop'));
});

test('admin listings preserve search while paginating', function () {
    $admin = managementUser('admin', 'admin-list-pagination@example.com');
    $owner = managementUser('shop_owner', 'owner-list-pagination@example.com');

    Shop::factory(16)->create([
        'owner_id' => $owner->id,
        'name' => 'Paginated Shop',
    ]);
    Product::factory(16)->create([
        'created_by' => $admin->id,
        'name' => 'Paginated Product',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.shops.index', ['search' => 'Paginated', 'page' => 2]))
        ->assertInertia(fn (Assert $page) => $page
            ->where('search', 'Paginated')
            ->where('shops.current_page', 2)
            ->where('shops.total', 16));

    $this->actingAs($admin)
        ->get(route('admin.products.index', ['search' => 'Paginated', 'page' => 2]))
        ->assertInertia(fn (Assert $page) => $page
            ->where('search', 'Paginated')
            ->where('products.current_page', 2)
            ->where('products.total', 16));

    $owners = User::factory(16)->create(['name' => 'Paginated Owner']);
    $owners->each(function (User $shopOwner): void {
        $shopOwner->assignRole('shop_owner');
    });

    $this->actingAs($admin)
        ->get(route('admin.shop-owners.index', ['search' => 'Paginated Owner', 'page' => 2]))
        ->assertInertia(fn (Assert $page) => $page
            ->where('search', 'Paginated Owner')
            ->where('shopOwners.current_page', 2)
            ->where('shopOwners.total', 16));
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

test('shop owner catalog includes a product thumbnail url', function () {
    Storage::fake('public');
    $admin = managementUser('admin', 'admin-catalog-image@example.com');
    $owner = managementUser('shop_owner', 'owner-catalog-image@example.com');
    $shop = Shop::factory()->create(['owner_id' => $owner->id]);
    $product = Product::factory()->create([
        'created_by' => $admin->id,
        'thumbnail_path' => 'products/catalog.jpg',
        'is_active' => true,
    ]);

    Storage::disk('public')->put('products/catalog.jpg', 'image');
    $shop->products()->attach($product, ['price' => 125, 'is_active' => true]);

    $this->actingAs($owner)
        ->get(route('shop-owner.catalog.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('shop-owner/catalog')
            ->where('products.data.0.thumbnail_url', Storage::disk('public')->url('products/catalog.jpg')));
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

test('admin can toggle a shop status', function () {
    $admin = managementUser('admin', 'admin-shop-toggle@example.com');
    $owner = managementUser('shop_owner', 'owner-shop-toggle@example.com');
    $shop = Shop::factory()->create([
        'owner_id' => $owner->id,
        'is_active' => true,
    ]);

    $this->actingAs($admin)
        ->patch(route('admin.shops.toggle-status', $shop))
        ->assertRedirect();

    $this->assertDatabaseHas('shops', [
        'id' => $shop->id,
        'is_active' => false,
    ]);

    $this->actingAs($admin)
        ->patch(route('admin.shops.toggle-status', $shop))
        ->assertRedirect();

    $this->assertDatabaseHas('shops', [
        'id' => $shop->id,
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
