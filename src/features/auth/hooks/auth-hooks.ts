import { browserFetch } from "@/lib/providers/http-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAuthSession = () =>
  useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => browserFetch<{ authenticated: boolean }>("/auth/session"),
    staleTime: 300_000,
    gcTime: 1_800_000,
  });
export const useRequestOtp = () =>
  useMutation({
    mutationFn: (body: { mobile: string }) =>
      browserFetch("/auth/otp/request", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  });
export const useVerifyOtp = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { mobile: string; otp: string }) =>
      browserFetch("/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["auth", "session"] }),
  });
};
export const useLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => browserFetch("/auth/logout", { method: "POST" }),
    onSuccess: () => qc.clear(),
  });
};
export const useLogoutAll = useLogout;
