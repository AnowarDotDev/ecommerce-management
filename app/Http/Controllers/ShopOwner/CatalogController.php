<?php

namespace App\Http\Controllers\ShopOwner;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function index(Request $request): Response
    {
        $shop = $request->user()->shops()->firstOrFail();

        return Inertia::render('shop-owner/catalog', [
            'shop' => $shop,
            'products' => Product::query()
                ->where('is_active', true)
                ->with(['creator:id,name', 'listings' => fn ($query) => $query->where('shop_id', $shop->id)])
                ->latest('id')
                ->paginate(15),
        ]);
    }
}
