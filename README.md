# Torobland (توروبلند)

Torobland is a Persian, right-to-left product discovery and shopping frontend. It helps users browse products by category, filter by brand, sort results, and view products for a selected city.

This repository contains the Next.js application and its backend-for-frontend API routes. Product data, cities, categories, and authentication depend on a separate backend service; that service is not included here. The app also includes API routes and hooks for OTP authentication, product details, offers, and comparison. Some header controls, including search, cart, and notifications, are currently UI placeholders.

## Stack

- Next.js 16.4.2 with App Router and React 19.3.0
- TypeScript with strict checking
- TanStack React Query v5 for server state, prefetching, and hydration
- Tailwind CSS v4 through the Turbopack loader, shadcn/ui, and Lucide icons
- Persian (`lang="fa"`), RTL layout, Vazirmatn font, and a dark slate theme
- pnpm for dependency management

## Run locally

Requirements: Node.js 20.9 or newer, pnpm, and a running compatible backend.

Run all commands from the application directory containing `package.json` (the `torobland-app/` directory if you cloned its parent repository).

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
```

Set the backend base URL in `.env.local`:

```dotenv
BACKEND_API_URL=http://localhost:8000
```

The URL above is an example; use the address of your backend, including any API base path it requires. The app appends paths such as `/products`, `/categories`, `/cities`, and `/auth/otp/request`. Keep this variable server-only; it does not need a `NEXT_PUBLIC_` prefix. Local environment files are ignored by Git, while `.env.example` documents the required configuration.

```bash
pnpm dev
```

Open [http://localhost:3030](http://localhost:3030). The dev script explicitly sets port **3030**. Restart the server after changing environment variables.

The catalog fetches cities, categories, and products on the server before rendering. An unset `BACKEND_API_URL` or an unreachable backend prevents the catalog from loading; there is no bundled mock backend.

## Commands

| Command                  | Purpose                                             |
| ------------------------ | --------------------------------------------------- |
| `pnpm dev`               | Start the Turbopack development server on port 3030 |
| `pnpm build`             | Create a production build in `.next/`               |
| `pnpm start`             | Serve the production build on port 3000 by default  |
| `pnpm lint`              | Run ESLint                                          |
| `pnpm exec tsc --noEmit` | Check TypeScript types                              |
| `pnpm format`            | Format the repository with Prettier                 |
| `pnpm format:check`      | Check formatting without modifying files            |

There is currently no automated test runner or test script configured.

## Project structure

```text
src/
  app/
    layout.tsx                 # RTL layout, font, and query provider
    page.tsx                   # Home catalog route
    catalog-page.tsx           # Shared catalog and server prefetching
    category/[categoryName]/   # Category catalog routes (resolved by slug)
    api/                       # BFF routes for products, auth, cities, etc.
  components/
    header.tsx                 # Shared site header
    ui/                        # Shared shadcn/ui primitives
  features/
    auth/hooks/                # Session and OTP mutation hooks
    location/                  # City selection, state, queries, and types
    product/                   # Catalog, filters, product queries, and types
  lib/
    api/bff.ts                 # Forward requests to the backend
    providers/                 # HTTP client and React Query setup
    services/                  # Authentication cookie helpers
    types/                     # Shared API types and constants
    utils.ts                   # cn() and environment helpers
public/                        # Static assets
```

## Important conventions

### Feature organization

Keep feature code under `src/features/<feature>/`:

- `components/`: composed feature UI and widgets.
- `hooks/`: query and mutation hooks, reusable business logic, and state hooks.
- `infra/api/`: typed request functions.
- `infra/queries.ts`: query option factories shared by hooks and server prefetching.
- `infra/`: other infrastructure, including search parameter utilities.
- `types/`: feature types.
- `contexts/`: feature state providers and context utilities.

Shared UI belongs in `src/components/`; shared infrastructure belongs in `src/lib/`. Use the `@/` alias for imports from `src/`.

### UI and rendering

- Use the existing shadcn `Button` and `Input` components instead of raw `<button>` and `<input>` elements.
- Pass styling through `className` and use `cn()` from `@/lib/utils` to merge conditional Tailwind classes.
- Preserve RTL behavior, Persian text, and the existing theme. Place client boundaries where hooks or browser interaction require them.
- Keep the existing `cacheComponents`, `partialPrefetching`, and Turbopack CSS configuration in mind when changing rendering or styling.

### Data and authentication

- Components consume feature hooks. Request functions reuse `apiFetch()` or `browserFetch` from `@/lib/providers/http-client` and let errors propagate to React Query.
- Server requests use `BACKEND_API_URL` directly; browser requests use same-origin `/api/*` routes, which forward to the backend through `src/lib/api/bff.ts`.
- Reuse query option factories on the server and client. Query keys must include every input affecting the response, including IDs, city, filters, sort, and pagination.
- For product lists, reuse `canonicalProductQuery` and `toProductSearchParams` so requests and cache keys use the same normalized inputs.
- Guard ID-dependent queries with `enabled: Boolean(id)`. Keep resource-specific cache timing in the query definition.
- Use `useMutation` for writes and invalidate affected query keys on success. Invalidate the auth session after OTP verification and clear cached data on logout.
- Reuse `QueryProvider` and `getQueryClient`; do not create query clients inside feature hooks or components.
- Authentication tokens are managed through HTTP-only cookies. Keep token handling in the existing server routes and cookie helpers.

See [AGENTS.md](./AGENTS.md) for the full contributor and agent instructions. Preserve its generated Next.js rules and consult the bundled Next.js docs before framework changes.

## Build and deploy

Deploy this app to a host that runs a Next.js Node.js server. It requires server rendering, API routes, and cookies, so static-only hosting is not suitable for the current implementation.

### Node.js server

1. Provision Node.js 20.9 or newer and pnpm on the deployment host.
2. Set `BACKEND_API_URL` in the deployment environment, pointing to the production backend reachable from the app server. Configure it for both build and runtime. Do not rely on `.env.development`, which is not loaded in production.
3. Install dependencies, check the application, and build from the app directory:

   ```bash
   pnpm install --frozen-lockfile
   pnpm lint
   pnpm exec tsc --noEmit
   pnpm build
   ```

4. Start the production server:

   ```bash
   pnpm start
   ```

   This listens on port **3000** by default. To use a different port:

   ```bash
   pnpm start --port 3030
   ```

5. Keep the process running with your hosting platform or process supervisor, and serve the public site over HTTPS through a reverse proxy or load balancer. Production authentication cookies are marked `Secure` and require HTTPS.
6. Verify the home page, category navigation, city selection, and backend API access after deployment. Verify OTP authentication against the configured backend when enabling that flow.

The build uses `next/font/google` for Vazirmatn, so the build environment needs network access to fetch the font. Keep `.next/`, `public/`, package files, configuration, and installed runtime dependencies available to the production server. No Dockerfile or deployment pipeline is currently included.
