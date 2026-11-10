import { Head, Link } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import ShopController from '@/actions/App/Http/Controllers/Admin/ShopController';
import DeleteConfirmation from '@/components/delete-confirmation';
import Heading from '@/components/heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

type Shop = {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    logo_url?: string | null;
    owner: { name: string };
};
type Props = { shops: { data: Shop[] } };

export default function ShopsIndex({ shops }: Props) {
    return (
        <>
            <Head title="Shops" />
            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <Heading
                        title="Shops"
                        description="Manage shop owners and storefronts."
                    />
                    <Button asChild>
                        <Link href={ShopController.create()}>
                            <Plus /> New shop
                        </Link>
                    </Button>
                </div>
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Logo</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {shops.data.map((shop) => (
                                    <TableRow key={shop.id}>
                                        <TableCell>
                                            <Avatar className="size-10 rounded-md">
                                                <AvatarImage
                                                    src={
                                                        shop.logo_url ??
                                                        undefined
                                                    }
                                                    alt={`${shop.name} logo`}
                                                />
                                                <AvatarFallback className="rounded-md">
                                                    {shop.name
                                                        .slice(0, 2)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {shop.name}
                                            <div className="text-xs text-muted-foreground">
                                                {shop.slug}
                                            </div>
                                        </TableCell>
                                        <TableCell>{shop.owner.name}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    shop.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {shop.is_active
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
                                                        href={ShopController.edit(
                                                            shop,
                                                        )}
                                                    >
                                                        <Pencil />
                                                    </Link>
                                                </Button>
                                                <DeleteConfirmation
                                                    href={
                                                        ShopController.destroy(
                                                            shop,
                                                        ).url
                                                    }
                                                    title={`Delete ${shop.name}?`}
                                                    description="This action cannot be undone. The shop and its logo will be permanently removed."
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
                        {shops.data.length === 0 && (
                            <p className="p-6 text-center text-sm text-muted-foreground">
                                No shops found.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ShopsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Shops', href: ShopController.index() },
    ],
};
