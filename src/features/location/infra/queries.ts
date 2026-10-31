import { serverFetch } from "@/lib/providers/http-client";
import { queryOptions } from "@tanstack/react-query";
import { getCities } from "./api/location-api";

export const citiesQuery = (q: string = "") =>
  queryOptions({
    queryKey: ["cities", q],
    queryFn: () => getCities(q, serverFetch),
  });
