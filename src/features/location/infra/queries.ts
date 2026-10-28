import { queryOptions } from "@tanstack/react-query";
import { getCities } from "./api/location-api";
import { serverFetch } from "@/lib/providers/http-client";

export const citiesQuery = (q: string = "") =>
  queryOptions({
    queryKey: ["cities", q],
    queryFn: () => getCities(q, serverFetch),
  });
