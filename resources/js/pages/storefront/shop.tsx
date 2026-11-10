import { Head } from '@inertiajs/react';
import { Search, Store } from 'lucide-react';
import { useMemo, useState } from 'react';
import { dashboard } from '@/routes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Shop = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    logo_url?: string | null;
};

type Product = {
    id: number;
    name: string;
    description?: string | null;
    price: string;
    thumbnail_url?: string | null;
};

type Props = {
    shop: Shop;
    products: { data: Product[] };
};

export default function ShopStorefront({ shop, products }: Props) {
    const [search, setSearch] = useState('');
    const normalizedSearch = search.trim().toLowerCase();
    const visibleProducts = useMemo(
        () =>
            products.data.filter((product) =>
                `${product.name} ${product.description ?? ''}`
                    .toLowerCase()
                    .includes(normalizedSearch),
            ),
        [normalizedSearch, products.data],
    );

    return (
        <>
            <Head title={shop.name} />
            <div className="min-h-screen bg-muted/20 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    <Card className="overflow-hidden">
                        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
                            <Avatar className="size-20 rounded-xl sm:size-24">
                                <AvatarImage
                                    src={shop.logo_url ?? undefined}
                                    alt={`${shop.name} logo`}
                                />
                                <AvatarFallback className="rounded-xl">
                                    <Store className="size-8" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <Badge variant="secondary">Storefront</Badge>
                                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                    {shop.name}
                                </h1>
                                <p className="max-w-2xl text-muted-foreground">
                                    {shop.description ||
                                        'Browse products available from this shop.'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-xl font-semibold">
                                Available products
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Shop-specific pricing and product details.
                            </p>
                        </div>
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search products"
                                aria-label="Search products"
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {visibleProducts.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {visibleProducts.map((product) => (
                                <Card
                                    key={product.id}
                                    className="overflow-hidden transition-shadow hover:shadow-md"
                                >
                                    <div className="aspect-[4/3] bg-muted">
                                        {product.thumbnail_url ? (
                                            <img
                                                src={product.thumbnail_url}
                                                alt={product.name}
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                                                No image
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="line-clamp-2">
                                            {product.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <p className="line-clamp-3 min-h-15 text-sm text-muted-foreground">
                                            {product.description ||
                                                'No description provided.'}
                                        </p>
                                        <p className="text-xl font-semibold">
                                            ৳ {product.price}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-10 text-center">
                                <p className="font-medium">
                                    {search
                                        ? 'No matching products found.'
                                        : 'No products are available right now.'}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Please check back later.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

ShopStorefront.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
