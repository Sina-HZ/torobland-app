"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryList } from "../infra/queries";
import { browserFetch } from "@/lib/providers/http-client";
import { CategoryFilters } from "../types";

export const useCategories = () => useQuery(categoryList(browserFetch));

export const useCategoryFilters = (categoryId?: string, cityId?: string) =>
  useQuery({
    queryKey: ["filters", categoryId, cityId],
    queryFn: () =>
      browserFetch<CategoryFilters>(
        `/api/categories/${categoryId}/filters?cityId=${cityId ?? ""}`,
      ),
    enabled: Boolean(categoryId),
    staleTime: 600_000,
    gcTime: 3_600_000,
  });
