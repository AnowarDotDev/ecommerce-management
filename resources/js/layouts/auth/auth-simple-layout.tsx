import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background p-4 text-foreground sm:p-6 lg:p-10">
            <div className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-32 -bottom-32 size-96 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="relative hidden min-h-[650px] flex-col justify-between overflow-hidden bg-black p-10 text-white lg:flex">
                    <div className="absolute -top-24 -right-24 size-72 rounded-full border border-primary/20 bg-primary/10 blur-sm" />
                    <div className="absolute -bottom-28 -left-24 size-80 rounded-full bg-primary/10 blur-3xl" />

                    <Link
                        href={home()}
                        className="relative flex items-center gap-3"
                    >
                        <span className="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-white p-1 ring-1 ring-primary/40">
                            <AppLogoIcon
                                className="size-full object-contain"
                                alt="Application logo"
                            />
                        </span>
                        <span className="text-sm font-semibold tracking-[0.2em] text-primary">
                            MARKETPLACE
                        </span>
                    </Link>

                    <div className="relative space-y-5">
                        <p className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">
                            One platform. Every store.
                        </p>
                        <h2 className="max-w-sm text-4xl leading-tight font-semibold tracking-tight">
                            Run your marketplace with clarity.
                        </h2>
                        <p className="max-w-sm text-sm leading-6 text-zinc-400">
                            Manage shops, products and storefronts from one
                            focused workspace built for growth.
                        </p>
                    </div>

                    <p className="relative text-xs text-zinc-500">
                        Secure access to your workspace
                    </p>
                </div>

                <div className="flex min-h-[650px] items-center justify-center p-6 sm:p-10">
                    <div className="w-full max-w-sm">
                        <div className="mb-8 flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
                            <Link
                                href={home()}
                                className="flex items-center gap-3 lg:hidden"
                            >
                                <span className="flex size-11 items-center justify-center overflow-hidden rounded-xl bg-white p-1 ring-1 ring-primary/40">
                                    <AppLogoIcon
                                        className="size-full object-contain"
                                        alt="Application logo"
                                    />
                                </span>
                                <span className="text-sm font-semibold tracking-[0.2em] text-primary">
                                    MARKETPLACE
                                </span>
                            </Link>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    {title}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
