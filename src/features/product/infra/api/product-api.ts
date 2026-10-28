import { apiFetch, serverFetch } from "@/lib/providers/http-client";
import type { Offer, Product, ProductQuery, ProductSummary } from "../../types";
import { toProductSearchParams } from "../search-params";
import { Page } from "@/lib/types/api-types";

export async function getAllProducts(
  query: ProductQuery = {},
  transport: typeof apiFetch | typeof serverFetch = apiFetch,
): Promise<Page<ProductSummary>> {
  let endPoint = transport === serverFetch ? "/products" : "/api/products";
  if (Object.keys(query).length > 0) {
    endPoint += `?${toProductSearchParams(query)}`;
  }
  const response = await transport<Page<ProductSummary>>(endPoint);
  return response;
}

export async function getProductDetail(
  id: string,
  transport = apiFetch,
): Promise<Product> {
  return transport<Product>(
    `${transport === serverFetch ? "/products" : "/api/products"}/${encodeURIComponent(id)}`,
  );
}

export async function getProductOffers(
  id: string,
  cityId?: string,
  transport = apiFetch,
): Promise<Offer[]> {
  const p = new URLSearchParams({ includeStale: "false" });
  if (cityId) p.set("cityId", cityId);
  return transport<Offer[]>(
    `${transport === serverFetch ? "/products" : "/api/products"}/${encodeURIComponent(id)}/offers?${p}`,
  );
}
