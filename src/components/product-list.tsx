"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { getProducts, type Product } from "@/lib/api/products";
import { useCity } from "@/components/city-context";
import ProductCard from "@/components/product-card";

export type Sort = "default" | "price-asc" | "price-desc" | "updated-desc";

// Maps the internal sort values used by the UI to the API query keys.
const SORT_TO_API: Record<Sort, string> = {
  default: "popular",
  "price-asc": "cheapest",
  "price-desc": "expensive",
  "updated-desc": "newest",
};

export default function ProductList({
  initialProducts,
  sort = "default",
}: {
  initialProducts: Product[];
  sort?: Sort;
}) {
  const { selectedCity } = useCity();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  // The server already rendered the initial products, so skip the first
  // effect run and only re-fetch when the selected city or sort changes.
  const initialized = useRef(initialProducts.length > 0);

  useEffect(() => {
    if (initialized.current) {
      initialized.current = false;
      return;
    }

    let active = true;
    const query = selectedCity?.query;
    const sortKey = SORT_TO_API[sort];

    setLoading(true);
    setError(undefined);

    getProducts(query, sortKey)
      .then((result) => {
        if (active) {
          setProducts(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError("دریافت محصولات ممکن نیست.");
          setProducts([]);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedCity?.query, sort]);

  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        در حال دریافت محصولات...
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-lg border border-red-900/60 bg-red-950/30 p-4 text-sm text-red-300">
        {error}
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
