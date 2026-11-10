import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import ShopController from '@/actions/App/Http/Controllers/Admin/ShopController';
import AdminListToolbar from '@/components/admin-list-toolbar';
import DeleteConfirmation from '@/components/delete-confirmation';
import Heading from '@/components/heading';
import Pagination, { type PaginationData } from '@/components/pagination';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

type Shop = {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    logo_url?: string | null;
    owner: { name: string };
};
type Props = { shops: PaginationData & { data: Shop[] }; search: string };

export default function ShopsIndex({ shops, search: initialSearch }: Props) {
    const [search, setSearch] = useState(initialSearch);

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const query = search.trim();

        router.get(ShopController.index().url, query ? { search: query } : {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const clearSearch = () => {
        setSearch('');
        router.get(
            ShopController.index().url,
            {},
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

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
                    <div className="border-b p-4">
                        <AdminListToolbar
                            search={search}
                            placeholder="Search shops or owners..."
                            onSearchChange={setSearch}
                            onSubmit={submitSearch}
                            onClear={clearSearch}
                        />
                    </div>
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
                                            <Switch
                                                pressed={shop.is_active}
                                                aria-label={`${shop.is_active ? 'Deactivate' : 'Activate'} ${shop.name}`}
                                                onPressedChange={() =>
                                                    router.patch(
                                                        ShopController.toggleStatus(
                                                            shop,
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
                    <Pagination data={shops} />
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
