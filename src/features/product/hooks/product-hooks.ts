import { browserFetch } from "@/lib/providers/http-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProductDetail, getProductOffers } from "../infra/api";
import { productSearch } from "../infra/queries";
import { ProductQuery } from "../types";

export const useProducts = (query: ProductQuery) =>
  useQuery(productSearch(query));

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductDetail(id),
    enabled: Boolean(id),
    staleTime: 60_000,
    gcTime: 1_800_000,
  });

export const useProductOffers = (id: string, cityId?: string) =>
  useQuery({
    queryKey: ["offers", id, cityId],
    queryFn: () => getProductOffers(id, cityId),
    enabled: Boolean(id),
  });

export const useCompareProducts = () =>
  useMutation({
    mutationFn: (body: { cityId: string; productIds: string[] }) =>
      browserFetch("/api/products/compare", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  });
