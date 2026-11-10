import { Form, Head, Link } from '@inertiajs/react';
import ProductController from '@/actions/App/Http/Controllers/ShopOwner/ProductController';
import ListingController from '@/actions/App/Http/Controllers/ShopOwner/ListingController';
import DeleteConfirmation from '@/components/delete-confirmation';
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
        thumbnail_url?: string | null;
    };
    listing: {
        price: string;
        display_name?: string | null;
        description?: string | null;
        thumbnail_url?: string | null;
    };
};

export default function EditProduct({ product, listing }: Props) {
    return (
        <>
            <Head title={`Edit ${product.name}`} />
            <div className="space-y-6 p-4">
                <Heading
                    title={`Edit ${product.name}`}
                    description="Update how this product appears in your shop."
                />
                <Card>
                    <CardHeader>
                        <CardTitle>Shop listing details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...ListingController.update.form(product)}
                            encType="multipart/form-data"
                            className="grid gap-6 md:max-w-2xl"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="price">
                                            Shop price
                                        </Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            defaultValue={listing.price}
                                            required
                                        />
                                        <InputError message={errors.price} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="display_name">
                                            Display name
                                        </Label>
                                        <Input
                                            id="display_name"
                                            name="display_name"
                                            defaultValue={
                                                listing.display_name ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.display_name}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">
                                            Shop description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            defaultValue={
                                                listing.description ?? ''
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
                                        {listing.thumbnail_url ||
                                        product.thumbnail_url ? (
                                            <img
                                                src={
                                                    listing.thumbnail_url ??
                                                    product.thumbnail_url ??
                                                    ''
                                                }
                                                alt={`${product.name} thumbnail`}
                                                className="mt-2 h-40 w-40 rounded-lg border object-cover"
                                            />
                                        ) : null}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
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
                                        <DeleteConfirmation
                                            href={
                                                ListingController.destroy(
                                                    product,
                                                ).url
                                            }
                                            title={`Remove ${product.name} from your shop?`}
                                            description="The product will be removed from your shop listing but remain in the shared catalog."
                                        >
                                            <Button
                                                type="button"
                                                variant="destructive"
                                            >
                                                Delete
                                            </Button>
                                        </DeleteConfirmation>
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
        { title: 'My products', href: ProductController.index() },
        { title: 'Edit product', href: '#' },
    ],
};
