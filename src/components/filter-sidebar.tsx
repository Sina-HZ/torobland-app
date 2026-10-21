"use client";

import React from "react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Sort } from "@/components/product-list";

interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function FilterSection({ title, icon, children }: FilterSectionProps) {
  return (
    <Card className="border border-slate-800 mb-4 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-2">
        <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
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
}

export default function FilterSidebar({
  sort,
  onSortChange,
}: FilterSidebarProps) {
  const current = SORT_OPTIONS.find((option) => option.value === sort);
  const currentLabel = current ? current.label : "مرتب‌سازی";

  return (
    <aside className="hidden lg:flex flex-col w-80 sticky top-6 max-h-[calc(100vh-4rem)] overflow-y-auto border-l border-slate-800 bg-slate-950 p-4 text-right">
      {/* Price Range Filter */}
      <FilterSection
        title="قیمت"
        icon={<DollarSign className="w-4 h-4 text-cyan-500" />}
      >
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-sm text-slate-400">از</span>
          <Input
            type="text"
            placeholder="0"
            className="w-24 h-9 bg-slate-900 border border-slate-700 px-3 text-sm text-slate-200 focus-visible:ring-2 focus-visible:ring-cyan-500"
          />
          <span className="text-sm text-slate-400">تا</span>
          <Input
            type="text"
            placeholder="۰۰۰,۰۰۰"
            className="w-28 h-9 bg-slate-900 border border-slate-700 px-3 text-sm text-slate-200 focus-visible:ring-2 focus-visible:ring-cyan-500"
          />
        </div>
        <Button
          className="w-full h-9 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors"
        >
          اعمال فیلتر
        </Button>
        <Button
          variant="outline"
          className="w-full mt-2 h-9 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-slate-300 transition-colors"
        >
          حذف فیلتر
        </Button>
      </FilterSection>

      {/* Brands List */}
      <FilterSection
        title="برندهای محبوب"
        icon={<Building2 className="w-4 h-4 text-cyan-500" />}
      >
        <div className="flex flex-wrap gap-2">
          {["Nintendo", "Sony", "Microsoft", "Apple", "Samsung", "Xiaomi"].map(
            (brand) => (
              <Button
                key={brand}
                variant="outline"
                size="sm"
                className="text-xs text-slate-300 hover:bg-cyan-600 hover:text-white transition-colors"
              >
                {brand}
              </Button>
            ),
          )}
        </div>
      </FilterSection>

      {/* Condition Filter */}
      <FilterSection
        title="وضعیت محصول"
        icon={<Package className="w-4 h-4 text-cyan-500" />}
      >
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
            <input type="checkbox" className="accent-cyan-600" />
            جدید
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
            <input type="checkbox" className="accent-cyan-600" />
            دست دوم
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
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
      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">
            فقط محصولات موجود
          </span>
          <input type="checkbox" className="accent-cyan-600" />
        </div>
      </div>
    </aside>
  );
}
