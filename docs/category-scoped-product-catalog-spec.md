# Category-scoped product catalog

## Summary

Add canonical `/category/[categoryName]` routes that reuse the existing catalog page, send the resolved category ID to product search, and load category-specific brands in the filter sidebar.

## Key changes

- Extract the current catalog page composition into a shared server component that accepts an optional category slug.
  - Fetch categories once, resolve `categoryName` against `Category.slug`, and call `notFound()` for unknown slugs.
  - Keep `/` category-agnostic.
  - Prefetch products with `{ categoryId, cityId }` for category routes.
  - Add `src/app/category/[categoryName]/page.tsx`, using the Promise-based `params` API and `instant = false` to match the existing uncached page behavior.
- Update `CategoriesLink` to generate `/category/${cat.slug}` links and receive the already-fetched category list.
- Change `ProductQuery.category` to `categoryId`, preserving it through canonical query keys and serialized product-search parameters.
- Thread `categoryId` through `ProductCatalog`, `ProductList`, and `FilterSidebar`.
  - Product requests include `categoryId`.
  - Brand filters call `useCategoryFilters(categoryId, selectedCity?.id)`.
  - Existing multi-select behavior remains: checkboxes are staged locally and applied with «اعمال فیلتر»; «حذف فیلتر» clears them.
- Update the product API contract documentation to use `categoryId` consistently.

## Validation

- `npx tsc --noEmit`
- `pnpm lint`
- Manual checks:
  - `/` loads products without a category filter and shows no category-specific brands.
  - A known `/category/<slug>` loads only that category’s products.
  - Its sidebar requests and displays that category’s brands, and multiple selected brands filter products after applying.
  - Clearing brands restores the category-wide product list.
  - An unknown slug renders the Next.js 404 response.
  - Navigating between category links uses the new canonical path.

## Assumptions

- `<category-name>` means the existing category `slug`; the API category identifier is `Category.id`.
- `categoryId` is the intended backend query parameter, superseding the stale `category` wording in the checked-in API document.
- Category filter loading may happen through the existing client query after hydration; no new filter-prefetch abstraction is added.
- Price, stock, and other existing placeholder filters remain outside this change.

The repository has no test framework or end-to-end harness, so validation uses typecheck, lint, build, and route behavior checks.
