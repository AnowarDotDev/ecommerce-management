import { Head, Link } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import ShopOwnerController from '@/actions/App/Http/Controllers/Admin/ShopOwnerController';
import Heading from '@/components/heading';
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

type Owner = { id: number; name: string; email: string; shops_count: number };
type Props = { shopOwners: { data: Owner[] } };

export default function ShopOwnersIndex({ shopOwners }: Props) {
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
                                            {owner.shops_count}
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
