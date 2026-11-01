"use client";

import FilterSidebar from "@/features/product/components/filter-sidebar";
import type { Sort } from "@/features/product/components/product-list";
import ProductList from "@/features/product/components/product-list";
import { useCallback, useState } from "react";

export default function ProductCatalog({
  categoryId,
}: {
  categoryId?: string;
}) {
  const [sort, setSort] = useState<Sort>("default");
  const [brands, setBrands] = useState<string[]>([]);

  const handleBrandsSubmit = useCallback((brandIds: string[]) => {
    setBrands(brandIds);
  }, []);

  return (
    <div className="flex w-full gap-6">
      <FilterSidebar
        sort={sort}
        categoryId={categoryId}
        onSortChange={setSort}
        onBrandsSubmit={handleBrandsSubmit}
      />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-4 pt-4 pb-6">
          <ProductList sort={sort} brands={brands} categoryId={categoryId} />
        </div>
      </div>
    </div>
  );
}
