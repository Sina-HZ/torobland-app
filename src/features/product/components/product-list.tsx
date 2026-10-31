"use client";

import { useCity } from "@/features/location/contexts/city-context";
import ProductCard from "@/features/product/components/product-card";
import { useProducts } from "@/features/product/hooks/product-hooks";
import type { Product } from "@/features/product/types";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

export type Sort = "default" | "price-asc" | "price-desc" | "updated-desc";

const SORT_TO_API: Record<Sort, string> = {
  default: "popular",
  "price-asc": "cheapest",
  "price-desc": "expensive",
  "updated-desc": "newest",
};

export default function ProductList({
  sort = "default",
  brands = [],
}: {
  sort?: Sort;
  brands?: string[];
}) {
  const { selectedCity } = useCity();
  const query = useMemo(() => {
    const sortKey = SORT_TO_API[sort];
    return {
      cityId: selectedCity?.id,
      sort:
        sortKey === "popular"
          ? "balanced"
          : sortKey === "cheapest" || sortKey === "expensive"
            ? "price"
            : "freshness",
      brand: brands,
    } as const;
  }, [selectedCity?.id, sort, brands]);
  const { data, isPending, isError } = useProducts(query);
  const products: Product[] = (data?.items ?? []).map(
    ({ product, brand, minimumPriceRial, matchingShopCount, freshness }) => ({
      id: product.id,
      title: product.title,
      image: product.imageUrls[0],
      subtitle: brand.name,
      price: minimumPriceRial.toLocaleString("fa-IR"),
      views: matchingShopCount.toLocaleString("fa-IR"),
      createdAt: freshness,
    }),
  );

  if (isPending) {
    return (
      <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        در حال دریافت محصولات...
      </div>
    );
  }

  if (isError) {
    return (
      <p className="rounded-lg border border-red-900/60 bg-red-950/30 p-4 text-sm text-red-300">
        دریافت محصولات ممکن نیست.
      </p>
    );
  }

  if (products.length === 0) {
    return (
      <p className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
        محصولی برای این موقعیت پیدا نشد.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
