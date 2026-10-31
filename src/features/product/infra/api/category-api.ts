import { apiFetch } from "@/lib/providers/http-client";
import type { Category } from "../../types";

export async function getCategories(
  transport = apiFetch(),
): Promise<Category[]> {
  return transport<Category[]>("/categories");
}
