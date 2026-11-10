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

type Props = { owners: { id: number; name: string }[] };

export default function CreateShop({ owners }: Props) {
    return (
        <>
            <Head title="Create shop" />
            <div className="space-y-6 p-4">
                <Heading
                    title="Create shop"
                    description="Add a storefront and assign its owner."
                />
                <Card>
                    <CardHeader>
                        <CardTitle>Shop details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...ShopController.store.form()}
                            className="grid gap-6 md:max-w-2xl"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" name="name" required />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="slug">Slug</Label>
                                        <Input id="slug" name="slug" required />
                                        <InputError message={errors.slug} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="owner_id">
                                            Shop owner
                                        </Label>
                                        <OwnerCombobox
                                            name="owner_id"
                                            owners={owners}
                                            defaultValue={owners[0]?.id}
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
                                        />
                                        <InputError
                                            message={errors.description}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="logo">Logo</Label>
                                        <Input
                                            id="logo"
                                            name="logo"
                                            type="file"
                                            accept="image/*"
                                        />
                                        <InputError message={errors.logo} />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button disabled={processing}>
                                            Create shop
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

CreateShop.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Create shop', href: ShopController.create() },
    ],
};
