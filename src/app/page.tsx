import Header from "@/components/header";
import { dehydrate, HydrationBoundary, noop } from "@tanstack/react-query";
import { CityProvider } from "@/features/location/contexts/city-context";
import LocationSelect from "@/features/location/components/location-select";
import ProductCatalog from "@/features/product/components/product-catalog";
import { getQueryClient } from "@/lib/providers/query-client";
import { productSearch } from "@/features/product/infra/queries";
import { citiesQuery } from "@/features/location/infra/queries";
import CategoriesLink from "@/features/product/components/categories-link";

// Catalog data is uncached and user/city dependent, so this route renders
// dynamically per request instead of being statically prerendered at build.
export const instant = false;

export default async function Home() {
  const queryClient = getQueryClient();
  const citiesPage = await queryClient.query(citiesQuery());
  const cities = citiesPage.items;
  const initialCity = cities[0];
  const initialQuery = { cityId: initialCity?.id };
  void queryClient.query(productSearch(initialQuery)).catch(noop);

  return (
    <CityProvider initialCity={initialCity}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex min-h-screen flex-col">
          {/* Composition: Header only receives children, no city props drilled through it. */}
          <Header CategoriesLink={<CategoriesLink />}>
            <LocationSelect />
          </Header>

          <main className="relative flex-1">
            <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
              <ProductCatalog />
            </div>
          </main>

          <footer className="mt-auto w-full border-t border-slate-800 bg-slate-900 py-6">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
                محصولات را جستجو کنید؟
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="cursor-pointer hover:text-cyan-400">
                  قوانین
                </span>
                <span className="cursor-pointer hover:text-cyan-400">
                  درباره ما
                </span>
              </div>
            </div>
          </footer>
        </div>
      </HydrationBoundary>
    </CityProvider>
  );
}
