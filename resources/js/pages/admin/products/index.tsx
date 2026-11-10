import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import AdminListToolbar from '@/components/admin-list-toolbar';
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
    is_active: boolean;
    thumbnail_url?: string | null;
    creator: { name: string };
};
type Props = { products: PaginationData & { data: Product[] }; search: string };

export default function ProductsIndex({
    products,
    search: initialSearch,
}: Props) {
    const [search, setSearch] = useState(initialSearch);

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const query = search.trim();

        router.get(
            ProductController.index().url,
            query ? { search: query } : {},
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    const clearSearch = () => {
        setSearch('');
        router.get(
            ProductController.index().url,
            {},
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Products" />
            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <Heading
                        title="Products"
                        description="Manage the shared product catalog."
                    />
                    <Button asChild>
                        <Link href={ProductController.create()}>
                            <Plus /> New product
                        </Link>
                    </Button>
                </div>
                <Card>
                    <div className="border-b p-4">
                        <AdminListToolbar
                            search={search}
                            placeholder="Search products or creators..."
                            onSearchChange={setSearch}
                            onSubmit={submitSearch}
                            onClear={clearSearch}
                        />
                    </div>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Thumbnail</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Creator</TableHead>
                                    <TableHead>Base price</TableHead>
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
                                                    src={product.thumbnail_url}
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
                                            {product.name}
                                            <div className="text-xs text-muted-foreground">
                                                {product.slug}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {product.creator.name}
                                        </TableCell>
                                        <TableCell>
                                            ৳ {product.base_price}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    pressed={product.is_active}
                                                    aria-label={`${product.is_active ? 'Deactivate' : 'Activate'} ${product.name}`}
                                                    onPressedChange={() =>
                                                        router.patch(
                                                            ProductController.toggleStatus(
                                                                product,
                                                            ).url,
                                                            {},
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                />
                                            </div>
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
                                                        ProductController.destroy(
                                                            product,
                                                        ).url
                                                    }
                                                    title={`Delete ${product.name}?`}
                                                    description="This action cannot be undone. The product and its thumbnail will be permanently removed."
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
                        {products.data.length === 0 && (
                            <p className="p-6 text-center text-sm text-muted-foreground">
                                No products found.
                            </p>
                        )}
                    </CardContent>
                    <Pagination data={products} />
                </Card>
            </div>
        </>
    );
}

ProductsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Products', href: ProductController.index() },
    ],
};
