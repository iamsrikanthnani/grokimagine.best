"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "./fetcher";
import type { Imagine } from "@/types";

export function useGetImagine(
  id: string | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery<Imagine, Error>({
    queryKey: ["imagine", id],
    queryFn: async () =>
      apiGet<Imagine>(`/api/get-imagine?id=${encodeURIComponent(id!)}`),
    enabled: Boolean(id) && (options?.enabled ?? true),
    staleTime: 30_000,
  });
}
