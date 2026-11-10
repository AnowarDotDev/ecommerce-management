import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import ShopOwnerController from '@/actions/App/Http/Controllers/Admin/ShopOwnerController';
import AdminListToolbar from '@/components/admin-list-toolbar';
import Heading from '@/components/heading';
import Pagination, { type PaginationData } from '@/components/pagination';
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

type Owner = {
    id: number;
    name: string;
    email: string;
    shops: Array<{ id: number; name: string }>;
};
type Props = {
    shopOwners: PaginationData & { data: Owner[] };
    search: string;
};

export default function ShopOwnersIndex({
    shopOwners,
    search: initialSearch,
}: Props) {
    const [search, setSearch] = useState(initialSearch);

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const query = search.trim();

        router.get(
            ShopOwnerController.index().url,
            query ? { search: query } : {},
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    const clearSearch = () => {
        setSearch('');
        router.get(
            ShopOwnerController.index().url,
            {},
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Shop owners" />
            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <Heading
                        title="Shop owners"
                        description="Manage accounts that own storefronts."
                    />
                    <Button asChild>
                        <Link href={ShopOwnerController.create()}>
                            <Plus /> New shop owner
                        </Link>
                    </Button>
                </div>
                <Card>
                    <div className="border-b p-4">
                        <AdminListToolbar
                            search={search}
                            placeholder="Search shop owners..."
                            onSearchChange={setSearch}
                            onSubmit={submitSearch}
                            onClear={clearSearch}
                        />
                    </div>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Shops</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {shopOwners.data.map((owner) => (
                                    <TableRow key={owner.id}>
                                        <TableCell className="font-medium">
                                            {owner.name}
                                        </TableCell>
                                        <TableCell>{owner.email}</TableCell>
                                        <TableCell>
                                            {owner.shops.length > 0 ? (
                                                <div className="space-y-1">
                                                    {owner.shops.map((shop) => (
                                                        <div key={shop.id}>
                                                            {shop.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    No shops
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                asChild
                                                size="icon"
                                                variant="ghost"
                                            >
                                                <Link
                                                    href={ShopOwnerController.edit(
                                                        owner,
                                                    )}
                                                >
                                                    <Pencil />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {shopOwners.data.length === 0 && (
                            <p className="p-6 text-center text-sm text-muted-foreground">
                                No shop owners found.
                            </p>
                        )}
                    </CardContent>
                    <Pagination data={shopOwners} />
                </Card>
            </div>
        </>
    );
}

ShopOwnersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Shop owners', href: ShopOwnerController.index() },
    ],
};
