import { apiFetch, serverFetch } from "@/lib/providers/http-client";
import type { Category } from "../../types";

export async function getCategories(
  transport: typeof apiFetch | typeof serverFetch = apiFetch,
): Promise<Category[]> {
  return transport<Category[]>(
    transport === serverFetch ? "/categories" : "/api/categories",
  );
}
