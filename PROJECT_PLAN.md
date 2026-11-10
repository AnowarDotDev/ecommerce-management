# Small E-commerce Management — Project Plan

এই plan-টি `small_ecommerce_management_task.pdf`-এর requirements অনুযায়ী তৈরি করা হয়েছে। Project stack:

- Backend: Laravel 13 / PHP 8.4
- Frontend: Inertia React 3
- UI: shadcn/ui এবং Tailwind CSS v4
- Authentication: Laravel Fortify
- Authorization: Spatie Laravel Permission
- Database: MySQL বা compatible relational database
- Architecture: Repository pattern, Actions এবং Policies

## Implementation status

- Day 1 — Foundation: **Complete**
- Day 2 — Management features: Pending
- Day 3 — Storefront and submission: Pending

## 1. Project scope

Application-এ তিন ধরনের user থাকবে:

- Admin: shop, product এবং shop owner manage করবে
- Shop Owner: shared catalog থেকে product নিজের shop-এ list করবে এবং shop-specific information manage করবে
- Customer: নির্দিষ্ট shop-এর assigned active products দেখতে পারবে

মূল business rule:

> `products` shared catalog হিসেবে থাকবে এবং `shop_product` pivot table-এর মাধ্যমে product কোনো shop-এ list হবে।

একই product একাধিক shop-এ আলাদা price, description এবং thumbnail নিয়ে প্রদর্শিত হতে পারবে।

## 2. Backend architecture

Controller HTTP request, authorization এবং response coordinate করবে। Business operation Action/Service-এ থাকবে এবং database access Repository layer-এর মাধ্যমে হবে।

সম্ভাব্য structure:

```text
app/
├── Actions/
│   ├── Products/
│   ├── Shops/
│   └── ShopProducts/
├── Contracts/Repositories/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Resources/
├── Models/
├── Policies/
├── Repositories/Eloquent/
└── Providers/
```

প্রধান repository contracts:

- `ShopRepositoryInterface`
- `ProductRepositoryInterface`
- `ShopProductRepositoryInterface`
- `UserRepositoryInterface`

Repositories-এর concrete implementation `Repositories/Eloquent` namespace-এ থাকবে এবং service provider-এ bind করা হবে।

## 3. Database design

### `users`

Existing users table ব্যবহার করা হবে। Role Spatie package-এর মাধ্যমে assign হবে।

### `shops`

- `id`
- `owner_id`
- `name`
- `slug`
- `description`
- `logo`
- `is_active`
- timestamps

### `products`

Shared catalog-এর base product data:

- `id`
- `created_by`
- `name`
- `slug`
- `description`
- `base_price`
- `thumbnail_path`
- `is_active`
- timestamps

Admin অথবা Shop Owner product তৈরি করতে পারবে।

### `shop_product`

Shop-specific listing data:

- `shop_id`
- `product_id`
- `price`
- `display_name`
- `description`
- `thumbnail_path`
- `is_active`
- timestamps
- unique constraint: `shop_id + product_id`

Shop Owner নিজের shop-এর listing-এর price, description, display name এবং thumbnail override করতে পারবে।

## 4. Roles and permissions

### Roles

- `admin`
- `shop_owner`
- `customer`

### Permissions

- `view shops`
- `create shops`
- `update shops`
- `delete shops`
- `view products`
- `create products`
- `update products`
- `delete products`
- `manage shop owners`
- `browse catalog`
- `list products`
- `update own listings`
- `delete own listings`
- `view storefront`

Policies এবং Spatie permissions উভয় ব্যবহার করে authorization enforce করা হবে। Authentication থাকলেই protected operation অনুমোদিত হবে না।

## 5. Admin features

- Admin login
- Dashboard statistics
- Shop CRUD
- Product CRUD
- Shop Owner account create/update
- Shop Owner-এর shop manage করা
- Product creator দেখা
- Shop এবং product active/inactive করা
- Product thumbnail upload

সম্ভাব্য backend files:

```text
app/Http/Controllers/Admin/ShopController.php
app/Http/Controllers/Admin/ProductController.php
app/Http/Controllers/Admin/ShopOwnerController.php
app/Http/Requests/Admin/StoreShopRequest.php
app/Http/Requests/Admin/UpdateShopRequest.php
app/Http/Requests/Admin/StoreProductRequest.php
app/Http/Requests/Admin/UpdateProductRequest.php
```

## 6. Shop Owner features

- নিজের shop dashboard
- Shared catalog browse/search
- Existing product নিজের shop-এ list করা
- নিজের product তৈরি করা
- Shop-specific price update
- Shop-specific description এবং display name update
- Shop-specific thumbnail upload/update
- Product listing active/inactive করা
- নিজের shop থেকে product unassign করা

সম্ভাব্য backend files:

```text
app/Http/Controllers/ShopOwner/CatalogController.php
app/Http/Controllers/ShopOwner/ListingController.php
app/Http/Requests/ShopOwner/StoreListingRequest.php
app/Http/Requests/ShopOwner/UpdateListingRequest.php
```

## 7. Customer storefront

সম্ভাব্য route:

```text
/shops/{shop}/products
```

Customer শুধু নিচের data দেখতে পারবে:

- Active shop
- Active `shop_product` listing
- Shop-specific price
- Shop-specific description
- Shop-specific display name
- Shop-specific thumbnail

যে product কোনো shop-এ assigned নয়, সেটি customer view-তে আসবে না।

## 8. Frontend architecture

React/Inertia pages থাকবে `resources/js/pages`-এ। Role অনুযায়ী page grouping:

```text
resources/js/pages/
├── admin/
│   ├── dashboard.tsx
│   ├── shops/
│   ├── products/
│   └── shop-owners/
├── shop-owner/
│   ├── dashboard.tsx
│   ├── catalog.tsx
│   └── listings/
└── storefront/
    └── shop.tsx
```

Existing component এবং layout reuse করা হবে। নতুন UI component কেবল shadcn/ui pattern অনুসরণ করে তৈরি হবে।

## 9. shadcn/ui requirements

সব dashboard, form, table, modal, card, notification এবং storefront UI shadcn/ui component দিয়ে তৈরি হবে। আলাদা UI library ব্যবহার করা হবে না।

প্রধান component:

- `Button`
- `Input`
- `Textarea`
- `Label`
- `Select`
- `Checkbox`
- `Switch`
- `Card`
- `Table`
- `Badge`
- `Dialog`
- `AlertDialog`
- `DropdownMenu`
- `Tabs`
- `Sheet`
- `Skeleton`
- `Sonner`
- `Avatar`
- `Breadcrumb`

যে component বর্তমানে নেই, শুধু প্রয়োজনীয় component add করা হবে। Existing components পাওয়া যাবে [resources/js/components/ui](resources/js/components/ui)-তে।

### Admin UI

- Sidebar navigation
- Dashboard statistic cards
- shadcn data table
- Create/edit form
- Delete confirmation-এর জন্য `AlertDialog`
- Status-এর জন্য `Badge` বা `Switch`
- Success/error feedback-এর জন্য `Sonner`

### Shop Owner UI

- Catalog product cards/table
- Search এবং filter controls
- Add-to-shop action
- Listing management table
- Shop-specific edit form
- Upload preview
- Empty state এবং loading skeleton

### Customer UI

- Shop header
- Responsive product card grid
- Shop-specific pricing
- Empty state
- Mobile-friendly layout

Responsive dashboard-এর জন্য desktop sidebar এবং mobile `Sheet` navigation ব্যবহার করা হবে। Existing light/dark mode বজায় থাকবে।

## 10. Forms and validation

- Inertia React v3-এর `<Form>` অথবা project convention অনুযায়ী `useForm` ব্যবহার করা হবে
- Form Request-এ validation এবং request-level authorization রাখা হবে
- Controller-এ `$request->all()` ব্যবহার করা হবে না
- শুধু validated data Action/Repository-তে পাঠানো হবে
- Image upload-এ image type, MIME, extension এবং file size validate করা হবে
- File Laravel Storage ব্যবহার করে save করা হবে
- Upload-এর ক্ষেত্রে processing state এবং upload progress দেখানো হবে

## 11. Routes

```text
/admin/shops
/admin/products
/admin/shop-owners

/shop-owner/catalog
/shop-owner/listings
/shop-owner/listings/{product}

/shops/{shop}/products
```

Admin এবং Shop Owner route authentication, email verification এবং permission middleware দ্বারা protected হবে। Laravel route model binding এবং nested resource-এর ক্ষেত্রে scoped binding ব্যবহার করা হবে।

Frontend route call-এর জন্য hardcoded URL না লিখে Wayfinder ব্যবহার করা হবে।

## 12. Factories and seeders

Factories:

- `UserFactory`
- `ShopFactory`
- `ProductFactory`

Seeders:

- `RolePermissionSeeder`
- `AdminUserSeeder`
- `ShopOwnerSeeder`
- `ShopSeeder`
- `ProductSeeder`
- `ShopProductSeeder`

`DatabaseSeeder` থেকে deterministic demo data তৈরি করা হবে। Demo credentials README-তে থাকবে; production credentials commit করা হবে না।

## 13. Tests

Pest feature tests-এ নিচের behavior cover করা হবে:

- Admin shop CRUD করতে পারে
- Admin product CRUD করতে পারে
- Admin shop owner account manage করতে পারে
- Shop Owner shared catalog দেখতে পারে
- Shop Owner নিজের shop-এ product list করতে পারে
- Shop Owner অন্য owner-এর shop modify করতে পারে না
- একই product একই shop-এ duplicate assign করা যায় না
- Customer shop-specific price দেখতে পায়
- Unassigned product customer দেখতে পায় না
- Inactive shop/listing customer দেখতে পায় না
- Unauthorized user admin route access করতে পারে না
- Invalid image upload reject হয়

## 14. Three-day delivery plan

### Day 1 — Foundation

- Spatie permission install/configure
- Role এবং permission seeder
- Shop, Product এবং pivot migrations
- Models এবং relationships
- Factories
- Repository contracts এবং Eloquent implementations
- Policies
- Shared dashboard layout এবং role-based navigation
- প্রয়োজনীয় shadcn components

### Day 2 — Management features

- Admin shop CRUD
- Admin product CRUD
- Admin shop owner management
- Shop Owner catalog
- Product listing/unlisting
- Shop-specific overrides
- Image upload
- shadcn forms, tables, dialogs এবং toast feedback

### Day 3 — Storefront and submission

- Customer storefront
- Responsive/mobile polish
- Dark mode verification
- Authorization এবং validation tests
- Build, type check, Pest এবং Pint verification
- Fresh database setup test
- README এবং setup instructions
- Public GitHub repository preparation

## 15. README requirements

Final repository-তে README অবশ্যই থাকবে এবং এতে থাকবে:

1. PHP, Composer, Node এবং database requirements
2. `.env` setup
3. `composer install`
4. `npm install`
5. `php artisan key:generate`
6. Database configuration
7. `php artisan migrate --seed`
8. `php artisan storage:link`
9. `npm run build`
10. Development commands
11. Demo login credentials
12. Role/permission overview
13. Test command
14. Troubleshooting instructions

## 16. Completion checklist

- [ ] Fresh install থেকে application চালু হয়
- [ ] Admin login এবং permissions কাজ করে
- [ ] Admin shop/product CRUD কাজ করে
- [ ] Shop Owner catalog browse এবং listing manage করতে পারে
- [ ] Customer শুধু assigned active product দেখতে পায়
- [ ] Product factory এবং seed data আছে
- [ ] shadcn/ui সব application UI-তে ব্যবহার হয়েছে
- [ ] Responsive এবং dark mode কাজ করে
- [ ] Feature tests pass করে
- [ ] Type check এবং build pass করে
- [ ] Pint pass করে
- [ ] README সম্পূর্ণ
- [ ] Public GitHub repository ready
