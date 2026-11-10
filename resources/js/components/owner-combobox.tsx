import { Check, ChevronsUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

type Owner = { id: number; name: string };

type Props = {
    name: string;
    owners: Owner[];
    defaultValue?: number;
};

export default function OwnerCombobox({ name, owners, defaultValue }: Props) {
    const initialOwner = owners.find((owner) => owner.id === defaultValue);
    const [query, setQuery] = useState(initialOwner?.name ?? '');
    const [selectedId, setSelectedId] = useState<number | ''>(
        initialOwner?.id ?? '',
    );
    const [open, setOpen] = useState(false);

    const filteredOwners = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            return owners;
        }

        return owners.filter((owner) =>
            `${owner.name} ${owner.id}`.toLowerCase().includes(normalizedQuery),
        );
    }, [owners, query]);

    return (
        <div className="relative">
            <div className="relative">
                <Input
                    role="combobox"
                    aria-expanded={open}
                    aria-controls={`${name}-options`}
                    value={query}
                    placeholder="Search owner by name or ID"
                    onFocus={() => setOpen(true)}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setSelectedId('');
                        setOpen(true);
                    }}
                    onBlur={() => {
                        window.setTimeout(() => setOpen(false), 150);
                    }}
                    className="pr-10"
                />
                <ChevronsUpDown className="pointer-events-none absolute top-2.5 right-3 size-4 text-muted-foreground" />
            </div>
            {open && (
                <div
                    id={`${name}-options`}
                    role="listbox"
                    className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                >
                    {filteredOwners.length > 0 ? (
                        filteredOwners.map((owner) => (
                            <button
                                key={owner.id}
                                type="button"
                                role="option"
                                aria-selected={selectedId === owner.id}
                                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => {
                                    setSelectedId(owner.id);
                                    setQuery(owner.name);
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        'size-4',
                                        selectedId === owner.id
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                    )}
                                />
                                <span>
                                    {owner.name} (#{owner.id})
                                </span>
                            </button>
                        ))
                    ) : (
                        <p className="px-2 py-1.5 text-sm text-muted-foreground">
                            No owners found.
                        </p>
                    )}
                </div>
            )}
            <input type="hidden" name={name} value={selectedId} required />
        </div>
    );
}
