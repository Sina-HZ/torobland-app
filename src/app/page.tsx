import Header from "@/components/header";
import { CityProvider } from "@/components/city-context";
import LocationSelect from "@/components/location-select";
import ProductCatalog from "@/components/product-catalog";
import { getCities } from "@/lib/api/cities";
import { getProducts } from "@/lib/api/products";

// Catalog data is uncached and user/city dependent, so this route renders
// dynamically per request instead of being statically prerendered at build.
export const instant = false;

export default async function Home() {
  const cities = await getCities();
  const initialCity = cities[0];
  // Fetch products server-side for the initial city so the first paint
  // already contains product markup instead of an empty client fetch.
  const initialProducts = await getProducts(initialCity?.query);

  return (
    <CityProvider cities={cities} initialCity={initialCity}>
      <div className="flex min-h-screen flex-col">
        {/* Composition: Header only receives children, no city props drilled through it. */}
        <Header>
          <LocationSelect />
        </Header>

        <main className="relative flex-1">
          <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
            <ProductCatalog initialProducts={initialProducts} />
          </div>
        </main>

        <footer className="mt-auto w-full border-t border-slate-800 bg-slate-900 py-6">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
              محصولات را جستجو کنید؟
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="cursor-pointer hover:text-cyan-400">قوانین</span>
              <span className="cursor-pointer hover:text-cyan-400">
                درباره ما
              </span>
            </div>
          </div>
        </footer>
      </div>
    </CityProvider>
  );
}
