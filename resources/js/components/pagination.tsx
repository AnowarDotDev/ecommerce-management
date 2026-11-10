import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export type PaginationData = {
    current_page: number;
    from: number | null;
    last_page: number;
    links: Array<{
        active: boolean;
        label: string;
        url: string | null;
    }>;
    to: number | null;
    total: number;
};

type Props = {
    data: PaginationData;
};

function formatLabel(label: string): string {
    return label.replace('&laquo;', '«').replace('&raquo;', '»');
}

export default function Pagination({ data }: Props) {
    if (data.last_page <= 1) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
            <p className="text-sm text-muted-foreground">
                Showing {data.from ?? 0} to {data.to ?? 0} of {data.total}
            </p>
            <div className="flex flex-wrap gap-2">
                {data.links.map((link) =>
                    link.url ? (
                        <Button
                            key={`${link.label}-${link.url}`}
                            asChild
                            size="sm"
                            variant={link.active ? 'default' : 'outline'}
                        >
                            <Link href={link.url} preserveScroll>
                                {formatLabel(link.label)}
                            </Link>
                        </Button>
                    ) : (
                        <Button
                            key={link.label}
                            size="sm"
                            variant="outline"
                            disabled
                        >
                            {formatLabel(link.label)}
                        </Button>
                    ),
                )}
            </div>
        </div>
    );
}
