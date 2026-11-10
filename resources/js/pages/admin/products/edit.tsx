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

type Props = {
    product: {
        id: number;
        name: string;
        slug: string;
        description?: string | null;
        base_price: string;
    };
};

export default function EditProduct({ product }: Props) {
    return (
        <>
            <Head title={`Edit ${product.name}`} />
            <div className="space-y-6 p-4">
                <Heading
                    title={`Edit ${product.name}`}
                    description="Update catalog product details."
                />
                <Card>
                    <CardHeader>
                        <CardTitle>Product details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...ProductController.update.form(product)}
                            className="grid gap-6 md:max-w-2xl"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={product.name}
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="slug">Slug</Label>
                                        <Input
                                            id="slug"
                                            name="slug"
                                            defaultValue={product.slug}
                                            required
                                        />
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
                                            defaultValue={product.base_price}
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
                                            defaultValue={
                                                product.description ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.description}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="thumbnail">
                                            Replace thumbnail
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
                                            Save changes
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

EditProduct.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Edit product', href: ProductController.edit({ id: 0 }) },
    ],
};
