import { Search, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
    search: string;
    placeholder: string;
    onSearchChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onClear: () => void;
};

export default function AdminListToolbar({
    search,
    placeholder,
    onSearchChange,
    onSubmit,
    onClear,
}: Props) {
    return (
        <form onSubmit={onSubmit} className="flex flex-wrap gap-2">
            <div className="relative min-w-60 flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder={placeholder}
                    className="pl-9"
                    aria-label="Search"
                />
            </div>
            <Button type="submit">
                <Search /> Search
            </Button>
            {search && (
                <Button type="button" variant="outline" onClick={onClear}>
                    <X /> Clear
                </Button>
            )}
        </form>
    );
}
