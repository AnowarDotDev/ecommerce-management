import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import ProductController from '@/actions/App/Http/Controllers/ShopOwner/ProductController';
import ListingController from '@/actions/App/Http/Controllers/ShopOwner/ListingController';
import DeleteConfirmation from '@/components/delete-confirmation';
import Heading from '@/components/heading';
import Pagination, { type PaginationData } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';

type Product = {
    id: number;
    name: string;
    slug: string;
    base_price: string;
    thumbnail_url?: string | null;
    creator: { name: string };
    listing: {
        price: string;
        display_name?: string | null;
        is_active: boolean;
    };
};

type Props = {
    shop: { id: number; name: string };
    products: PaginationData & { data: Product[] };
};

export default function MyProducts({ shop, products }: Props) {
    return (
        <>
            <Head title="My products" />
            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="My products"
                        description={`Manage the products listed in ${shop.name}.`}
                    />
                    <Button asChild>
                        <Link href={ProductController.create()}>
                            <Plus /> New product
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Thumbnail</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Creator</TableHead>
                                        <TableHead>Shop price</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.data.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                {product.thumbnail_url ? (
                                                    <img
                                                        src={
                                                            product.thumbnail_url
                                                        }
                                                        alt={product.name}
                                                        className="size-12 rounded-md border object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex size-12 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
                                                        N/A
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {product.listing.display_name ||
                                                    product.name}
                                                <div className="text-xs text-muted-foreground">
                                                    {product.slug}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {product.creator.name}
                                            </TableCell>
                                            <TableCell>
                                                ৳ {product.listing.price}
                                                <div className="text-xs text-muted-foreground">
                                                    Base: ৳ {product.base_price}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    pressed={
                                                        product.listing
                                                            .is_active
                                                    }
                                                    aria-label={`${product.listing.is_active ? 'Deactivate' : 'Activate'} ${product.name}`}
                                                    onPressedChange={() =>
                                                        router.patch(
                                                            ListingController.toggleStatus(
                                                                product,
                                                            ).url,
                                                            {},
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        asChild
                                                        size="icon"
                                                        variant="ghost"
                                                    >
                                                        <Link
                                                            href={ProductController.edit(
                                                                product,
                                                            )}
                                                        >
                                                            <Pencil />
                                                        </Link>
                                                    </Button>
                                                    <DeleteConfirmation
                                                        href={
                                                            ListingController.destroy(
                                                                product,
                                                            ).url
                                                        }
                                                        title={`Remove ${product.name} from your shop?`}
                                                        description="The product will be removed from your shop, but it will remain in the shared catalog."
                                                    >
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="ghost"
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </DeleteConfirmation>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {products.data.length === 0 && (
                            <p className="p-6 text-center text-sm text-muted-foreground">
                                You have not added any products to your shop
                                yet.
                            </p>
                        )}
                    </CardContent>
                    <Pagination data={products} />
                </Card>
            </div>
        </>
    );
}

MyProducts.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'My products', href: ProductController.index() },
    ],
};
