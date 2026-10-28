"use client";

import React, { useState } from "react";
import {
  ArrowDownWideNarrow,
  ChevronDown,
  Building2,
  DollarSign,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Sort } from "@/features/product/components/product-list";
import { useCategoryFilters } from "../hooks/category-hooks";

interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function FilterSection({ title, icon, children }: FilterSectionProps) {
  return (
    <Card className="mb-4 border border-slate-800 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-300">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">{children}</CardContent>
    </Card>
  );
}

const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: "default", label: "پیش‌فرض" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "updated-desc", label: "آخرین به‌روزرسانی" },
];

interface FilterSidebarProps {
  sort: Sort;
  onSortChange: (sort: Sort) => void;
  onBrandsSubmit: (brandIds: string[]) => void;
}

export default function FilterSidebar({
  sort,
  onSortChange,
  onBrandsSubmit,
}: FilterSidebarProps) {
  const current = SORT_OPTIONS.find((option) => option.value === sort);
  const currentLabel = current ? current.label : "مرتب‌سازی";

  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
  const { data, isFetching, isError } = useCategoryFilters();
  const brands = data?.brands ?? [];

  const isSelected = (id: string) => selectedBrandIds.includes(id);

  const toggleBrand = (id: string) => {
    setSelectedBrandIds((prev) =>
      prev.includes(id)
        ? prev.filter((brandId) => brandId !== id)
        : [...prev, id],
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onBrandsSubmit(selectedBrandIds);
  };

  const handleClear = () => {
    setSelectedBrandIds([]);
    onBrandsSubmit([]);
  };

  return (
    <aside className="sticky top-6 hidden max-h-[calc(100vh-4rem)] w-80 flex-col overflow-y-auto border-l border-slate-800 bg-slate-950 p-4 text-right lg:flex">
      {/* Price Range Filter */}
      <FilterSection
        title="قیمت"
        icon={<DollarSign className="h-4 w-4 text-cyan-500" />}
      >
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-sm text-slate-400">از</span>
          <Input
            type="text"
            placeholder="0"
            className="h-9 w-24 border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 focus-visible:ring-2 focus-visible:ring-cyan-500"
          />
          <span className="text-sm text-slate-400">تا</span>
          <Input
            type="text"
            placeholder="۰۰۰,۰۰۰"
            className="h-9 w-28 border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 focus-visible:ring-2 focus-visible:ring-cyan-500"
          />
        </div>
        <Button className="h-9 w-full rounded-lg bg-cyan-600 text-sm font-medium text-white transition-colors hover:bg-cyan-500">
          اعمال فیلتر
        </Button>
        <Button
          variant="outline"
          className="mt-2 h-9 w-full rounded-lg text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-300"
        >
          حذف فیلتر
        </Button>
      </FilterSection>

      {/* Brands List */}
      <FilterSection
        title="برندهای محبوب"
        icon={<Building2 className="h-4 w-4 text-cyan-500" />}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Scroll overflow once there are more than 6 items */}
          <div className="max-h-[14rem] space-y-2 overflow-y-auto rounded-lg border border-slate-800 bg-slate-900/50 p-2 pr-1">
            {isFetching ? (
              <p className="text-xs text-slate-500 italic">
                در حال دریافت برندها...
              </p>
            ) : isError ? (
              <p className="text-xs text-red-400">
                دریافت لیست برندها ممکن نیست.
              </p>
            ) : (
              brands.map((brand) => (
                <label
                  key={brand.id}
                  className="flex cursor-pointer items-center gap-2 text-sm text-slate-300 select-none"
                >
                  <Checkbox
                    checked={isSelected(brand.id)}
                    onCheckedChange={() => toggleBrand(brand.id)}
                  />
                  {brand.name}
                </label>
              ))
            )}
          </div>
          <Button
            type="submit"
            className="h-9 w-full rounded-lg bg-cyan-600 text-sm font-medium text-white transition-colors hover:bg-cyan-500"
          >
            اعمال فیلتر
          </Button>
          <Button
            type="button"
            onClick={handleClear}
            variant="outline"
            className="mt-2 h-9 w-full rounded-lg text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-300"
          >
            حذف فیلتر
          </Button>
        </form>
      </FilterSection>

      {/* Condition Filter */}
      <FilterSection
        title="وضعیت محصول"
        icon={<Package className="h-4 w-4 text-cyan-500" />}
      >
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" className="accent-cyan-600" />
            جدید
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" className="accent-cyan-600" />
            دست دوم
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" className="accent-cyan-600" />
            Like New
          </label>
        </div>
      </FilterSection>

      {/* Sort */}
      <div className="mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full text-right">
              <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
              مرتب‌سازی: {currentLabel}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={cn(
                  sort === option.value
                    ? "bg-slate-800 text-cyan-400"
                    : "text-slate-200",
                )}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Availability Filter */}
      <div className="mt-6 border-t border-slate-800 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">
            فقط محصولات موجود
          </span>
          <input type="checkbox" className="accent-cyan-600" />
        </div>
      </div>
    </aside>
  );
}
