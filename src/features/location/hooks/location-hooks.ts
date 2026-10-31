"use client";

import { browserFetch } from "@/lib/providers/http-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import qs from "qs";
import { citiesQuery } from "../infra/queries";

export const useCities = (q = "") => useQuery(citiesQuery(q));

export const useSaveCity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cityId: string) =>
      browserFetch("/api/me/city", {
        method: "PUT",
        body: qs.stringify({ cityId }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};
