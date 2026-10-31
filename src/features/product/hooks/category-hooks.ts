"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryList } from "../infra/queries";
import { apiFetch } from "@/lib/providers/http-client";
import { CategoryFilters } from "../types";

export const useCategories = () => useQuery(categoryList());

export const useCategoryFilters = (categoryId?: string, cityId?: string) => {
  const apiClient = apiFetch();
  return useQuery({
    queryKey: ["filters", categoryId, cityId],
    queryFn: () =>
      apiClient<CategoryFilters>(
        `/categories/${categoryId}/filters?cityId=${cityId ?? ""}`,
      ),
    enabled: Boolean(categoryId),
    staleTime: 600_000,
    gcTime: 3_600_000,
  });
};
