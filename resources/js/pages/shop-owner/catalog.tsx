import { Form, Head, Link } from '@inertiajs/react';
import { Plus, Store, Trash2 } from 'lucide-react';
import CatalogController from '@/actions/App/Http/Controllers/ShopOwner/CatalogController';
import ListingController from '@/actions/App/Http/Controllers/ShopOwner/ListingController';
import ProductController from '@/actions/App/Http/Controllers/ShopOwner/ProductController';
import DeleteConfirmation from '@/components/delete-confirmation';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';

type Listing = {
    id: number;
    price: string;
    display_name?: string | null;
    description?: string | null;
    is_active: boolean;
    thumbnail_path?: string | null;
};
type Product = {
    id: number;
    name: string;
    description?: string | null;
    base_price: string;
    thumbnail_url?: string | null;
    creator: { name: string };
    listings: Listing[];
};
type Props = {
    shop: { id: number; name: string };
    products: { data: Product[] };
};

export default function Catalog({ shop, products }: Props) {
    return (
        <>
            <Head title="Shared catalog" />
            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="Shared catalog"
                        description={`Choose products to list in ${shop.name}.`}
                    />
                    <Button asChild>
                        <Link href={ProductController.create()}>
                            <Plus /> Create product
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {products.data.map((product) => {
                        const listing = product.listings[0];
                        return (
                            <Card key={product.id} className="h-full">
                                <div className="aspect-[4/3] overflow-hidden bg-muted">
                                    {product.thumbnail_url ? (
                                        <img
                                            src={product.thumbnail_url}
                                            alt={product.name}
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                                            No image
                                        </div>
                                    )}
                                </div>
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-3">
                                        <CardTitle>{product.name}</CardTitle>
                                        <Badge
                                            variant={
                                                listing ? 'default' : 'outline'
                                            }
                                        >
                                            {listing ? 'Listed' : 'Available'}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Created by {product.creator.name}
                                    </p>
                                </CardHeader>
                                <CardContent className="flex flex-1 flex-col gap-4">
                                    <p className="text-sm text-muted-foreground">
                                        {product.description ||
                                            'No description provided.'}
                                    </p>
                                    {listing ? (
                                        <Form
                                            {...ListingController.update.form(
                                                product,
                                            )}
                                            className="grid gap-3"
                                        >
                                            {({ errors, processing }) => (
                                                <>
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`price-${product.id}`}
                                                        >
                                                            Shop price
                                                        </Label>
                                                        <Input
                                                            id={`price-${product.id}`}
                                                            name="price"
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            defaultValue={
                                                                listing.price
                                                            }
                                                            required
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.price
                                                            }
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`display-name-${product.id}`}
                                                        >
                                                            Display name
                                                        </Label>
                                                        <Input
                                                            id={`display-name-${product.id}`}
                                                            name="display_name"
                                                            defaultValue={
                                                                listing.display_name ??
                                                                ''
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.display_name
                                                            }
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`description-${product.id}`}
                                                        >
                                                            Shop description
                                                        </Label>
                                                        <Textarea
                                                            id={`description-${product.id}`}
                                                            name="description"
                                                            defaultValue={
                                                                listing.description ??
                                                                ''
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.description
                                                            }
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`thumbnail-${product.id}`}
                                                        >
                                                            Shop thumbnail
                                                        </Label>
                                                        <Input
                                                            id={`thumbnail-${product.id}`}
                                                            name="thumbnail"
                                                            type="file"
                                                            accept="image/*"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.thumbnail
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            disabled={
                                                                processing
                                                            }
                                                        >
                                                            Save listing
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
                                                                variant="outline"
                                                            >
                                                                <Trash2 />{' '}
                                                                Remove
                                                            </Button>
                                                        </DeleteConfirmation>
                                                    </div>
                                                </>
                                            )}
                                        </Form>
                                    ) : (
                                        <Form
                                            {...ListingController.store.form(
                                                product,
                                            )}
                                            className="mt-auto grid gap-3"
                                        >
                                            {({ errors, processing }) => (
                                                <>
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`new-price-${product.id}`}
                                                        >
                                                            Shop price
                                                        </Label>
                                                        <Input
                                                            id={`new-price-${product.id}`}
                                                            name="price"
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            defaultValue={
                                                                product.base_price
                                                            }
                                                            required
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.price
                                                            }
                                                        />
                                                    </div>
                                                    <Button
                                                        disabled={processing}
                                                    >
                                                        <Store /> Add to my shop
                                                    </Button>
                                                    <InputError
                                                        message={errors.product}
                                                    />
                                                </>
                                            )}
                                        </Form>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <p className="text-xs text-muted-foreground">
                                        Base price: ৳ {product.base_price}
                                    </p>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
                {products.data.length === 0 && (
                    <Card>
                        <CardContent className="p-8 text-center text-sm text-muted-foreground">
                            No active products are available in the shared
                            catalog.
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

Catalog.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Shared catalog', href: CatalogController.index() },
    ],
};
