# Frontend Auth and Product API Specification

## 1. Scope

This specification defines the frontend integration for the NestJS authentication and products APIs.

The frontend will use:

- Next.js Route Handlers as a same-origin backend-for-frontend (BFF).
- Native `fetch` behind one shared transport abstraction.
- TanStack Query for browser cache, server state, and mutations.
- HttpOnly cookies for access and refresh tokens.

The first implementation does not include a full OTP form, category selector, profile page, compare UI, or pagination UI. It does expose the API and state hooks required by those screens.

## 2. Request boundary

Browser code must call same-origin `/api/...` routes. It must never call the Nest backend directly or read an access/refresh token.

The BFF forwards requests to the backend URL from the server-only `BACKEND_API_URL` environment variable. It copies the request method, query string, JSON body, and safe response status/body. It adds `Authorization: Bearer <access token>` when an access cookie exists.

Route Handlers are explicit and allowlisted:

```text
/api/auth/otp/request
/api/auth/otp/verify
/api/auth/token/refresh
/api/auth/logout
/api/auth/logout-all
/api/auth/session
/api/cities
/api/categories/:categoryId/filters
/api/products
/api/products/:productId
/api/products/:productId/offers
/api/products/compare
/api/me/city
```

Shared BFF helpers own backend URL construction, JSON/error parsing, authorization forwarding, cookie writes, and cookie clearing. There must be no unrestricted catch-all proxy.

## 3. Token storage and refresh

Use these cookies:

| Cookie              | Flags                                                                | Lifetime                                             |
| ------------------- | -------------------------------------------------------------------- | ---------------------------------------------------- |
| `torobland_access`  | `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` in production         | Backend `accessTokenExpiresIn` (normally 15 minutes) |
| `torobland_refresh` | `HttpOnly`, `SameSite=Lax`, `Path=/api/auth`, `Secure` in production | Backend `refreshTokenExpiresIn` (normally 30 days)   |

Tokens must never be placed in localStorage, sessionStorage, React props, query data, logs, or client-visible JSON responses.

### Authentication flows

- `POST /api/auth/otp/request` forwards the mobile number and returns the backend’s generic message.
- `POST /api/auth/otp/verify` forwards the mobile and OTP, stores both returned tokens in cookies, then returns `{ authenticated: true }` plus safe expiry metadata.
- `POST /api/auth/token/refresh` reads the refresh cookie, rotates it through the backend, replaces both cookies, and returns a sanitized success response.
- `POST /api/auth/logout` forwards the refresh cookie, then clears both cookies even when the backend reports an already-logged-out session.
- `POST /api/auth/logout-all` forwards the access cookie, then clears both cookies.
- `GET /api/auth/session` returns `{ authenticated: boolean }` from cookie presence. It does not expose a user profile because the backend has no `/auth/me` endpoint.

The browser transport handles a `401` once per request:

1. Coordinate refresh through a module-level single-flight promise.
2. Call `/api/auth/token/refresh`.
3. Retry the original request once.
4. If refresh fails, clear the auth query state and surface the original request as unauthenticated.

Never retry a failed refresh or loop on repeated `401` responses.

## 4. Transport and errors

Keep native `fetch`. Create two transport entry points:

- **Browser transport:** relative `/api/...` URLs, `credentials: "same-origin"`, JSON headers, refresh/retry handling, and typed errors.
- **Server transport:** direct `BACKEND_API_URL` requests, optional access-cookie forwarding, and `cache: "no-store"` for authenticated or user-specific data.

`ApiError` must preserve:

```ts
type ApiError = Error & {
  status: number;
  code?: string;
  retryAfter?: number;
};
```

Backend error objects have the shape `{ code, message }`. UI code maps stable codes to Persian messages and never displays provider or token details.

## 5. TanStack Query setup

Add `@tanstack/react-query` and a client `QueryProvider` in the root layout. The browser QueryClient uses:

```ts
{
  staleTime: 30_000,
  gcTime: 600_000,
  refetchOnWindowFocus: false,
  retry: (count, error) => error.status >= 500 && count < 2,
}
```

Override cache times by resource:

| Resource         | `staleTime` |   `gcTime` |
| ---------------- | ----------: | ---------: |
| Product search   |  30 seconds | 10 minutes |
| Product offers   |  30 seconds | 10 minutes |
| Product details  |  60 seconds | 30 minutes |
| Cities           |  10 minutes |     1 hour |
| Category filters |  10 minutes |     1 hour |
| Auth session     |   5 minutes | 30 minutes |

Use canonical query keys. Sort repeatable brand IDs and omit undefined/default values before building both the key and URL. A product query key must include city, all filters, sort, page, and page size.

The initial home request uses a Server Component `QueryClient` to prefetch cities and the first product search, then passes `dehydrate(queryClient)` through `HydrationBoundary`. Client Components consume the hydrated queries and refetch through the BFF.

Server prefetch query functions must call the server transport with an absolute backend URL. Browser query functions must call the same-origin BFF. Both use identical query keys.

## 6. Product API contract

### Cities

`GET /cities?page=1&pageSize=20&q=...`

Use the paginated response:

```ts
type Page<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
};
```

The current home page requests an explicit first city and passes its ID into product queries.

### Category filters

`GET /categories/:categoryId/filters?cityId=...`

Returns category-scoped brands and attribute definitions. There is no supported `/brands` endpoint. The API layer accepts an optional category ID, but the first home page remains category-agnostic and does not invent a default category.

### Product search

`GET /products` supports:

```text
q
category
brand (repeatable; OR semantics)
minPriceRial
maxPriceRial
cityId
inStock
updatedWithinMinutes
shopId
minTrustScore
attribute.<key>
sort=balanced|price|trust|freshness
page
pageSize (maximum 40; default 20)
```

The response is a `Page<ProductSummary>`, not a raw array. Prices remain integer Rials in wire types. UI mappers may format derived Toman strings for `ProductCard`.

### Details, offers, compare, and saved city

- `GET /products/:productId` returns product, brand, category, and offer summary.
- `GET /products/:productId/offers?cityId=...&includeStale=false` returns offers grouped by shop.
- `POST /products/compare` is a mutation; it requires a city and accepts at most 20 distinct products.
- `PUT /me/city` is a protected mutation and invalidates city-dependent product queries after success.

Product, detail, offer, and compare DTOs stay separate from display models. Dates remain ISO strings at the transport boundary.

## 7. Client hooks and component changes

Provide hooks for:

- `useAuthSession`
- `useRequestOtp`
- `useVerifyOtp`
- `useLogout`
- `useLogoutAll`
- `useSaveCity`
- `useCities`
- `useCategoryFilters`
- `useProducts`
- `useProduct`
- `useProductOffers`
- `useCompareProducts`

Migrate `ProductList` and `FilterSidebar` from manual `useEffect` state to `useQuery`/`useMutation`. Keep `CityProvider` for the selected city, but source its city list from the cities query. The home page always sends an explicit `cityId` so server-hydrated nationwide data cannot be confused with a later saved-city result.

## 8. Validation

Add focused Vitest coverage for:

- Query-string encoding and canonical query keys.
- Product envelope and backend error parsing.
- Cookie flags, token stripping, refresh rotation, and cookie clearing.
- One refresh for concurrent `401` requests.
- Exactly one retry after refresh.
- Logout idempotency and query invalidation.
- Product, city, filters, offers, compare, and save-city request shapes.

Run `pnpm lint`, `npx tsc --noEmit`, and `pnpm build`. Smoke-test the backend mock OTP flow without printing tokens.

## 9. Environment and limits

Add a server-only environment variable:

```env
BACKEND_API_URL=http://localhost:<backend-port>
```

The frontend does not use `NEXT_PUBLIC_API_BASE_URL` for authenticated calls. Multi-tab refresh coordination and a user identity endpoint remain follow-up work; the initial refresh lock is single-flight within one browser tab.
