import { apiFetch, serverFetch } from "@/lib/providers/http-client";
import { Page } from "@/lib/types/api-types";
import { City } from "../../types/types";

export async function getCities(
  query = "",
  transport: typeof apiFetch | typeof serverFetch = apiFetch,
): Promise<Page<City>> {
  const p = new URLSearchParams({ page: "1", pageSize: "20" });
  if (query) p.set("q", query);
  return transport<Page<City>>(
    `${transport === serverFetch ? "/cities" : "/api/cities"}?${p}`,
  );
}
