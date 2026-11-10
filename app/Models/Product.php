<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['created_by', 'name', 'slug', 'description', 'base_price', 'thumbnail_path', 'is_active'])]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return BelongsToMany<Shop, $this, ShopProduct> */
    public function shops(): BelongsToMany
    {
        return $this->belongsToMany(Shop::class, 'shop_product')
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
        return [
            'base_price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }
}
