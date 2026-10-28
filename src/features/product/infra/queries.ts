import { queryOptions } from "@tanstack/react-query";
import { getAllProducts, getCategories } from "./api";
import { ProductQuery } from "../types";
import { apiFetch, serverFetch } from "@/lib/providers/http-client";

export const productSearch = (query: ProductQuery) => {
  return queryOptions({
    queryKey: ["products", query] as const,
    queryFn: () => getAllProducts(query),
  });
};

export const categoryList = (transport: typeof apiFetch | typeof serverFetch) =>
  queryOptions({
    queryKey: ["categories"] as const,
    queryFn: () => getCategories(transport),
    staleTime: 600_000,
    gcTime: 3_600_000,
  });
