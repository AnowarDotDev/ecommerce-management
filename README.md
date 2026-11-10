# Small E-commerce Management

A Laravel 13, Inertia React 3 and shadcn/ui application for managing shops, a shared product catalog, shop-specific listings, and customer storefronts.

## Requirements

- PHP 8.4+
- Composer
- Node.js 20+
- MySQL or another Laravel-supported relational database

## Setup

```bash
composer install
copy .env.example .env
php artisan key:generate
```

Configure the database values in `.env`, then run:

```bash
php artisan migrate --seed
php artisan storage:link
npm install
npm run build
```

For local development:

```bash
composer run dev
```

## Demo accounts

The seeders create these accounts with the default factory password `password`:

| Role       | Email               | Password   |
| ---------- | ------------------- | ---------- |
| Admin      | `admin@example.com` | `password` |
| Shop Owner | `owner@example.com` | `password` |
| Customer   | `customer@example.com` | `password` |

Customer accounts can use the seeded credentials above, or be created through the registration form. Every newly registered user automatically receives the `customer` role after registration and email verification.

## Customer storefront flow

1. Register a new account from `/register`.
2. Verify the email address and log in.
3. Open `Browse shops` from the customer sidebar, or visit `/shops`.
4. Select an active shop and click `View products`.
5. The storefront opens at `/shops/{shop}/products` and displays only active products assigned to that shop.

The seeded `Demo Shop` normally uses ID `1`, so its storefront is usually available at `/shops/1/products`.

## Main routes

- `/admin/shops` — admin shop management
- `/admin/products` — admin product management
- `/admin/shop-owners` — admin shop-owner management
- `/shop-owner/catalog` — shared catalog and shop listing management
- `/shops` — customer shop selection page
- `/shops/{shop}/products` — customer storefront

## Architecture

- Laravel Form Requests handle validation.
- Spatie Laravel Permission handles roles and permissions.
- Repository contracts and Eloquent implementations handle persistence.
- Policies and middleware protect management and storefront operations.
- Inertia React pages use Wayfinder-generated route helpers.
- UI is built with shadcn/ui components and Tailwind CSS v4.

## Testing and quality checks

```bash
php artisan test --compact
vendor/bin/pint --dirty --format agent
vendor/bin/phpstan analyse --memory-limit=512M
npm run check
npm run types:check
npm run build
```

For a clean local database reset:

```bash
php artisan migrate:fresh --seed
```

## Troubleshooting

- If uploaded images are not visible, run `php artisan storage:link`.
- If frontend changes are not reflected, run `npm run dev` or rebuild with `npm run build`.
- If permissions appear stale, run `php artisan permission:cache-reset` and reseed roles and permissions.
- If the database is empty, run `php artisan migrate --seed`.
