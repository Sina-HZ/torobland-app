import { queryOptions } from "@tanstack/react-query";
import { getAllProducts, getCategories } from "./api";
import { ProductQuery } from "../types";
import { canonicalProductQuery, toProductSearchParams } from "./search-params";

export const productSearch = (query: ProductQuery) => {
  const queryString = toProductSearchParams(query);
  return queryOptions({
    queryKey: ["products", canonicalProductQuery(query)] as const,
    queryFn: () => getAllProducts(queryString),
  });
};

export const categoryList = () =>
  queryOptions({
    queryKey: ["categories"] as const,
    queryFn: () => getCategories(),
    staleTime: 600_000,
    gcTime: 3_600_000,
  });
