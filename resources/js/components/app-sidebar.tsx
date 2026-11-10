import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Package, Store, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import AdminProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import AdminShopController from '@/actions/App/Http/Controllers/Admin/ShopController';
import AdminShopOwnerController from '@/actions/App/Http/Controllers/Admin/ShopOwnerController';
import CatalogController from '@/actions/App/Http/Controllers/ShopOwner/CatalogController';
import ShopOwnerProductController from '@/actions/App/Http/Controllers/ShopOwner/ProductController';
import StorefrontController from '@/actions/App/Http/Controllers/StorefrontController';
import type { NavItem } from '@/types';

const dashboardNavItem: NavItem = {
    title: 'Dashboard',
    href: dashboard(),
    icon: LayoutGrid,
};

const adminNavItems: NavItem[] = [
    dashboardNavItem,
    { title: 'Shops', href: AdminShopController.index(), icon: Store },
    { title: 'Products', href: AdminProductController.index(), icon: Package },
    {
        title: 'Shop owners',
        href: AdminShopOwnerController.index(),
        icon: Users,
    },
];

const shopOwnerNavItems: NavItem[] = [
    dashboardNavItem,
    { title: 'Shared catalog', href: CatalogController.index(), icon: Package },
    {
        title: 'My products',
        href: ShopOwnerProductController.index(),
        icon: Store,
    },
];

const customerNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Browse shops',
        href: StorefrontController.index(),
        icon: Store,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const role = auth.roles[0]?.replace('_', ' ') ?? 'user';
    const mainNavItems = auth.roles.includes('admin')
        ? adminNavItems
        : auth.roles.includes('shop_owner')
          ? shopOwnerNavItems
          : customerNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} label={`${role} workspace`} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
