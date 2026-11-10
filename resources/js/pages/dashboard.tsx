import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    Building2,
    CircleCheck,
    LayoutDashboard,
    Package,
    Plus,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Store,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AdminProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import AdminShopController from '@/actions/App/Http/Controllers/Admin/ShopController';
import AdminShopOwnerController from '@/actions/App/Http/Controllers/Admin/ShopOwnerController';
import CatalogController from '@/actions/App/Http/Controllers/ShopOwner/CatalogController';
import ProductController from '@/actions/App/Http/Controllers/ShopOwner/ProductController';
import StorefrontController from '@/actions/App/Http/Controllers/StorefrontController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { dashboard } from '@/routes';

type WorkspaceLink = {
    description: string;
    href: string;
    icon: LucideIcon;
    label: string;
};

const adminLinks: WorkspaceLink[] = [
    {
        label: 'Shops',
        description: 'Manage storefronts, logos and availability.',
        href: AdminShopController.index().url,
        icon: Store,
    },
    {
        label: 'Products',
        description: 'Keep the shared product catalog organized.',
        href: AdminProductController.index().url,
        icon: Package,
    },
    {
        label: 'Shop owners',
        description: 'Manage the people behind each storefront.',
        href: AdminShopOwnerController.index().url,
        icon: Users,
    },
];

const shopOwnerLinks: WorkspaceLink[] = [
    {
        label: 'Shared catalog',
        description: 'Choose products and tailor them for your shop.',
        href: CatalogController.index().url,
        icon: Package,
    },
    {
        label: 'Create product',
        description: 'Add a new product to the shared catalog.',
        href: ProductController.create().url,
        icon: Plus,
    },
];

const customerLinks: WorkspaceLink[] = [
    {
        label: 'Browse shops',
        description: 'Explore active shops and their products.',
        href: StorefrontController.index().url,
        icon: Store,
    },
];

function getWorkspaceContent(roles: string[]) {
    if (roles.includes('admin')) {
        return {
            badge: 'Admin workspace',
            description:
                'Your central place to keep shops, products and owners moving together.',
            links: adminLinks,
            title: 'Run your marketplace with clarity.',
            action: {
                label: 'Create a shop',
                href: AdminShopController.create().url,
            },
        };
    }

    if (roles.includes('shop_owner')) {
        return {
            badge: 'Shop owner workspace',
            description:
                'Curate your shop, choose the right products and keep your storefront fresh.',
            links: shopOwnerLinks,
            title: 'Build a storefront customers remember.',
            action: {
                label: 'Open catalog',
                href: CatalogController.index().url,
            },
        };
    }

    return {
        badge: 'Customer workspace',
        description:
            'Discover active shops and find products from the storefronts you love.',
        links: customerLinks,
        title: 'Find something worth bringing home.',
        action: {
            label: 'Browse shops',
            href: StorefrontController.index().url,
        },
    };
}

export default function Dashboard() {
    const { auth } = usePage().props;
    const content = getWorkspaceContent(auth.roles);
    const firstName = auth.user?.name?.split(' ')[0] ?? 'there';

    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-full bg-gradient-to-b from-background via-background to-muted/30 p-4 md:p-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    <section className="relative overflow-hidden rounded-3xl bg-zinc-900 p-6 text-zinc-50 shadow-xl shadow-black/20 md:p-10 dark:bg-zinc-950">
                        <div className="absolute -top-24 -right-20 size-72 rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-white/10 blur-3xl" />
                        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-2xl space-y-5">
                                <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                                    <Sparkles /> {content.badge}
                                </Badge>
                                <div className="space-y-3">
                                    <p className="text-sm text-zinc-300">
                                        Welcome back, {firstName}
                                    </p>
                                    <h1 className="text-3xl leading-tight font-semibold tracking-tight md:text-5xl">
                                        {content.title}
                                    </h1>
                                    <p className="max-w-xl text-sm leading-6 text-zinc-300 md:text-base">
                                        {content.description}
                                    </p>
                                </div>
                            </div>
                            <Button
                                asChild
                                size="lg"
                                variant="secondary"
                                className="group w-full border border-white/15 bg-zinc-800 text-white hover:bg-zinc-700 lg:w-auto dark:border-white/15 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                            >
                                <Link href={content.action.href}>
                                    {content.action.label}
                                    <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>
                            </Button>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-primary">
                                    Quick access
                                </p>
                                <h2 className="text-2xl font-semibold tracking-tight">
                                    Your workspace
                                </h2>
                            </div>
                            <Badge variant="outline" className="hidden sm:flex">
                                <CircleCheck /> Ready to use
                            </Badge>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {content.links.map((link) => {
                                const Icon = link.icon;

                                return (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="group"
                                    >
                                        <Card className="h-full transition-all duration-200 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/5">
                                            <CardHeader>
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                                        <Icon className="size-5" />
                                                    </div>
                                                    <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                                                </div>
                                                <CardTitle className="pt-2 text-lg">
                                                    {link.label}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex-1 text-sm leading-6 text-muted-foreground">
                                                {link.description}
                                            </CardContent>
                                            <CardFooter className="text-xs font-medium text-primary">
                                                Open workspace
                                            </CardFooter>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>

                    <Card className="overflow-hidden">
                        <div className="grid md:grid-cols-[1.1fr_0.9fr]">
                            <div className="space-y-5 p-6 md:p-8">
                                <div className="flex size-11 items-center justify-center rounded-2xl bg-muted">
                                    <LayoutDashboard className="size-5 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold">
                                        A calmer way to manage commerce
                                    </h2>
                                    <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                                        Keep the important work close: manage
                                        your catalog, maintain storefronts and
                                        move between tasks without losing
                                        context.
                                    </p>
                                </div>
                            </div>
                            <div className="border-t bg-muted/30 p-6 md:border-t-0 md:border-l md:p-8">
                                <div className="flex items-center gap-3 text-sm font-medium">
                                    <ShieldCheck className="size-5 text-primary" />
                                    Role-based workspace
                                </div>
                                <Separator className="my-5" />
                                <div className="space-y-4 text-sm text-muted-foreground">
                                    <div className="flex items-start gap-3">
                                        <ShoppingBag className="mt-0.5 size-4 shrink-0 text-primary" />
                                        <span>
                                            Everything is organized around your
                                            role.
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Building2 className="mt-0.5 size-4 shrink-0 text-primary" />
                                        <span>
                                            Use the quick links above to jump
                                            into your next task.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
