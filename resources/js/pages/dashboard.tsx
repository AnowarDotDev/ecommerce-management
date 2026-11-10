import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    {['Shops', 'Products', 'Active listings'].map((title) => (
                        <Card key={title}>
                            <CardHeader className="flex flex-row items-center justify-between gap-4">
                                <CardTitle className="text-sm font-medium">
                                    {title}
                                </CardTitle>
                                <Badge variant="secondary">Foundation</Badge>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-semibold">—</p>
                                <p className="text-sm text-muted-foreground">
                                    Management module coming next
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Card className="min-h-[40vh]">
                    <CardHeader>
                        <CardTitle>Welcome to your workspace</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Your role-based workspace is ready for the management
                        features.
                    </CardContent>
                </Card>
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
