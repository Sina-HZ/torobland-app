import qs from "qs";
import type { ProductQuery } from "../types";

export function canonicalProductQuery(input: ProductQuery = {}) {
  const brand = [...new Set(input.brand?.filter(Boolean) ?? [])].sort();
  const attributes = Object.fromEntries(
    Object.entries(input.attributes ?? {})
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => a.localeCompare(b)),
  );
  return {
    ...input,
    brand,
    attributes,
    page: input.page ?? 1,
    pageSize: Math.min(input.pageSize ?? 20, 40),
    sort: input.sort ?? "balanced",
  };
}

export function toProductSearchParams(input: ProductQuery = {}) {
  const q = canonicalProductQuery(input);
  return qs.stringify(q, { arrayFormat: "repeat", skipNulls: true });
}
