<?php

namespace App\Policies;

use App\Models\ShopProduct;
use App\Models\User;

class ShopProductPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('browse catalog') || $user->can('view products');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ShopProduct $listing): bool
    {
        return $user->can('view products') || $listing->shop?->owner_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('list products');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ShopProduct $listing): bool
    {
        return $user->can('update products') || ($user->can('update own listings') && $listing->shop?->owner_id === $user->id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ShopProduct $listing): bool
    {
        return $user->can('delete products') || ($user->can('delete own listings') && $listing->shop?->owner_id === $user->id);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ShopProduct $listing): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ShopProduct $listing): bool
    {
        return false;
    }
}
