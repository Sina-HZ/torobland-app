import { apiFetch } from "@/lib/providers/http-client";
import { Page } from "@/lib/types/api-types";
import type { Offer, Product, ProductSummary } from "../../types";

export async function getAllProducts(
  queryString: string = "",
  transport = apiFetch(),
): Promise<Page<ProductSummary>> {
  let endPoint = "products";
  if (queryString && queryString.length > 0) {
    endPoint += `?${queryString}`;
  }
  const response = await transport<Page<ProductSummary>>(endPoint);
  return response;
}

export async function getProductDetail(
  id: string,
  transport = apiFetch(),
): Promise<Product> {
  return transport<Product>(`products/${encodeURIComponent(id)}`);
}

export async function getProductOffers(
  id: string,
  cityId?: string,
  transport = apiFetch(),
): Promise<Offer[]> {
  const p = new URLSearchParams({ includeStale: "false" });
  if (cityId) p.set("cityId", cityId);
  return transport<Offer[]>(`products/${encodeURIComponent(id)}/offers?${p}`);
}
