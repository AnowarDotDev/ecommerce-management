import { Form, Head, Link } from '@inertiajs/react';
import ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';

export default function CreateProduct() {
    return (
        <>
            <Head title="Create product" />
            <div className="space-y-6 p-4">
                <Heading
                    title="Create product"
                    description="Add a product to the shared catalog."
                />
                <Card>
                    <CardHeader>
                        <CardTitle>Product details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...ProductController.store.form()}
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
                                        <Label htmlFor="base_price">
                                            Base price
                                        </Label>
                                        <Input
                                            id="base_price"
                                            name="base_price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                        <InputError
                                            message={errors.base_price}
                                        />
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
                                        <Label htmlFor="thumbnail">
                                            Thumbnail
                                        </Label>
                                        <Input
                                            id="thumbnail"
                                            name="thumbnail"
                                            type="file"
                                            accept="image/*"
                                        />
                                        <InputError
                                            message={errors.thumbnail}
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button disabled={processing}>
                                            Create product
                                        </Button>
                                        <Button asChild variant="outline">
                                            <Link
                                                href={ProductController.index()}
                                            >
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

CreateProduct.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Create product', href: ProductController.create() },
    ],
};
