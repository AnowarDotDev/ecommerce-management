<?php

namespace App\Models;

use Database\Factories\ShopFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['owner_id', 'name', 'slug', 'description', 'logo', 'is_active'])]
class Shop extends Model
{
    /** @use HasFactory<ShopFactory> */
    use HasFactory;

    /** @return BelongsTo<User, $this> */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /** @return BelongsToMany<Product, $this, ShopProduct> */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'shop_product')
            ->using(ShopProduct::class)
            ->withPivot(['price', 'display_name', 'description', 'thumbnail_path', 'is_active'])
            ->withTimestamps();
    }

    /** @return HasMany<ShopProduct, $this> */
    public function listings(): HasMany
    {
        return $this->hasMany(ShopProduct::class);
    }

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }
}
