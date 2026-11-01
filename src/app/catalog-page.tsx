import Header from "@/components/header";
import LocationSelect from "@/features/location/components/location-select";
import { CityProvider } from "@/features/location/contexts/city-context";
import { citiesQuery } from "@/features/location/infra/queries";
import CategoriesLink from "@/features/product/components/categories-link";
import ProductCatalog from "@/features/product/components/product-catalog";
import { categoryList, productSearch } from "@/features/product/infra/queries";
import { getQueryClient } from "@/lib/providers/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { connection } from "next/server";
import { notFound } from "next/navigation";

export default async function CatalogPage({
  categoryName,
}: {
  categoryName?: string;
}) {
  await connection();
  const queryClient = getQueryClient();
  const [citiesPage, categories] = await Promise.all([
    queryClient.query(citiesQuery()),
    queryClient.query(categoryList()),
  ]);
  const category = categoryName
    ? categories.find(({ slug }) => slug === categoryName)
    : undefined;

  if (categoryName && !category) notFound();

  const initialCity = citiesPage.items[0];
  const categoryId = category?.id;
  await queryClient.query(
    productSearch({ categoryId, cityId: initialCity?.id }),
  );

  return (
    <CityProvider initialCity={initialCity}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex min-h-screen flex-col">
          <Header CategoriesLink={<CategoriesLink categories={categories} />}>
            <LocationSelect />
          </Header>
          <main className="relative flex-1">
            <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
              <ProductCatalog categoryId={categoryId} />
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
