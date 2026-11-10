import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Store } from 'lucide-react';
import StorefrontController from '@/actions/App/Http/Controllers/StorefrontController';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/heading';
import { dashboard } from '@/routes';

type Shop = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    logo_url?: string | null;
};

type Props = { shops: Shop[] };

export default function StorefrontShops({ shops }: Props) {
    return (
        <>
            <Head title="Browse shops" />
            <div className="space-y-6 p-4">
                <Heading
                    title="Browse shops"
                    description="Choose a shop to view its available products."
                />
                {shops.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {shops.map((shop) => (
                            <Card
                                key={shop.id}
                                className="flex flex-col overflow-hidden transition-shadow hover:shadow-md"
                            >
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <Avatar className="size-14 rounded-lg">
                                        <AvatarImage
                                            src={shop.logo_url ?? undefined}
                                            alt={`${shop.name} logo`}
                                        />
                                        <AvatarFallback className="rounded-lg">
                                            <Store className="size-6" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <CardTitle className="truncate">
                                            {shop.name}
                                        </CardTitle>
                                        <p className="truncate text-sm text-muted-foreground">
                                            {shop.slug}
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-1 flex-col gap-4">
                                    <p className="line-clamp-3 min-h-15 text-sm text-muted-foreground">
                                        {shop.description ||
                                            'Explore products available from this shop.'}
                                    </p>
                                    <Button asChild className="mt-auto w-full">
                                        <Link
                                            href={StorefrontController.shop(
                                                shop,
                                            )}
                                        >
                                            View products <ArrowRight />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-10 text-center">
                            <p className="font-medium">
                                No active shops found.
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Please check back later.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

StorefrontShops.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Browse shops', href: StorefrontController.index() },
    ],
};
