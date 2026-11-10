<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'view shops', 'create shops', 'update shops', 'delete shops',
            'view products', 'create products', 'update products', 'delete products',
            'manage shop owners', 'browse catalog', 'list products',
            'update own listings', 'delete own listings', 'view storefront',
        ];

        $permissionModels = collect($permissions)
            ->map(fn (string $permission): Permission => Permission::query()->firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]));

        Role::findOrCreate('admin', 'web')->givePermissionTo($permissionModels);
        Role::findOrCreate('shop_owner', 'web')->givePermissionTo([
            ...$permissionModels->whereIn('name', [
                'view shops', 'view products', 'create products', 'update products',
                'browse catalog', 'list products', 'update own listings', 'delete own listings',
            ])->all(),
        ]);
        Role::findOrCreate('customer', 'web')->givePermissionTo(
            $permissionModels->firstWhere('name', 'view storefront'),
        );
    }
}
