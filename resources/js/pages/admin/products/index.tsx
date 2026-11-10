import { Head, Link } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    creator: { name: string };
};
type Props = { products: { data: Product[] } };

export default function ProductsIndex({ products }: Props) {
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
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
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
                                            <Badge
                                                variant={
                                                    product.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {product.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
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
                                                <Link
                                                    href={ProductController.destroy(
                                                        product,
                                                    )}
                                                    method="delete"
                                                    as="button"
                                                >
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </Link>
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
