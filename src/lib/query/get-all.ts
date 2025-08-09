"use client";

import {
  useInfiniteQuery,
  QueryKey,
  InfiniteData,
} from "@tanstack/react-query";
import { apiGet } from "./fetcher";
import type { GetAllParams, GetAllResponse } from "@/types";

function toQuery(params: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.set(k, String(v));
  });
  return sp.toString();
}

export function useGetAllImagines(
  params: GetAllParams = {},
  options?: { enabled?: boolean }
) {
  const pageSize = params.limit ?? 12;
  return useInfiniteQuery<
    GetAllResponse,
    Error,
    InfiniteData<GetAllResponse>,
    QueryKey,
    number
  >({
    queryKey: ["imagines", "all", params] as QueryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const query = toQuery({ ...params, limit: pageSize, skip: pageParam });
      return apiGet<GetAllResponse>(`/api/get-all?${query}`);
    },
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.items.length;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    initialPageParam: 0,
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}
