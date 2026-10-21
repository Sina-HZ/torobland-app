"use client";

import { useState } from "react";
import type { Product } from "@/lib/api/products";
import type { Sort } from "@/components/product-list";
import FilterSidebar from "@/components/filter-sidebar";
import ProductList from "@/components/product-list";

export default function ProductCatalog({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [sort, setSort] = useState<Sort>("default");

  return (
    <div className="flex gap-6">
      <FilterSidebar sort={sort} onSortChange={setSort} />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-4">
          <ProductList initialProducts={initialProducts} sort={sort} />
        </div>
      </div>
    </div>
  );
}
