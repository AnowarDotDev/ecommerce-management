import * as TogglePrimitive from '@radix-ui/react-toggle';
import * as React from 'react';
import { cn } from '@/lib/utils';

function Switch({
    className,
    ...props
}: React.ComponentProps<typeof TogglePrimitive.Root>) {
    return (
        <TogglePrimitive.Root
            data-slot="switch"
            className={cn(
                'group inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent bg-muted p-0.5 shadow-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary',
                className,
            )}
            {...props}
        >
            <span className="pointer-events-none block size-5 rounded-full bg-background shadow-sm transition-transform group-data-[state=on]:translate-x-5" />
        </TogglePrimitive.Root>
    );
}

export { Switch };
