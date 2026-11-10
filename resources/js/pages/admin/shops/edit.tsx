import { Form, Head, Link } from '@inertiajs/react';
import ShopController from '@/actions/App/Http/Controllers/Admin/ShopController';
import OwnerCombobox from '@/components/owner-combobox';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';

type Props = {
    shop: {
        id: number;
        owner_id: number;
        name: string;
        slug: string;
        description?: string | null;
        logo_url?: string | null;
    };
    owners: { id: number; name: string }[];
};

export default function EditShop({ shop, owners }: Props) {
    return (
        <>
            <Head title={`Edit ${shop.name}`} />
            <div className="space-y-6 p-4">
                <Heading
                    title={`Edit ${shop.name}`}
                    description="Update shop details."
                />
                <Card>
                    <CardHeader>
                        <CardTitle>Shop details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...ShopController.update.form(shop)}
                            className="grid gap-6 md:max-w-2xl"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={shop.name}
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="slug">Slug</Label>
                                        <Input
                                            id="slug"
                                            name="slug"
                                            defaultValue={shop.slug}
                                            required
                                        />
                                        <InputError message={errors.slug} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="owner_id">
                                            Shop owner
                                        </Label>
                                        <OwnerCombobox
                                            name="owner_id"
                                            owners={owners}
                                            defaultValue={shop.owner_id}
                                        />
                                        <InputError message={errors.owner_id} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            defaultValue={
                                                shop.description ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.description}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="logo">
                                            Replace logo
                                        </Label>
                                        <Input
                                            id="logo"
                                            name="logo"
                                            type="file"
                                            accept="image/*"
                                        />
                                        <InputError message={errors.logo} />
                                        {shop.logo_url ? (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium">
                                                    Current logo
                                                </p>
                                                <img
                                                    src={shop.logo_url}
                                                    alt={`${shop.name} logo`}
                                                    className="size-24 rounded-md border object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">
                                                No logo uploaded.
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        <Button disabled={processing}>
                                            Save changes
                                        </Button>
                                        <Button asChild variant="outline">
                                            <Link href={ShopController.index()}>
                                                Cancel
                                            </Link>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EditShop.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Edit shop', href: ShopController.edit({ id: 0 }) },
    ],
};
