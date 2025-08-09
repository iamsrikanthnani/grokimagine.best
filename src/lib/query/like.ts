"use client";

import { useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import { apiPostJson } from "./fetcher";
import type { Imagine } from "@/types";
import { toast } from "sonner";

export function useLikeImagine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => apiPostJson<Imagine>("/api/like", { id }),
    onMutate: async (id: string) => {
      // no loading toast per requirement
      const t = undefined as unknown as string | undefined;
      const prevAll = qc.getQueriesData({
        queryKey: ["imagines", "all"] as QueryKey,
      }) as Array<
        [
          QueryKey,
          (
            | { pages?: Array<{ items: Imagine[] }>; pageParams?: unknown }
            | undefined
          )
        ]
      >;
      const prevOne = qc.getQueryData(["imagine", id]) as Imagine | undefined;
      // optimistic updates for lists
      prevAll.forEach(([key, data]) => {
        if (!data) return;
        const pages = data?.pages;
        if (!pages) return;
        const nextPages = pages.map((p) => ({
          ...p,
          items: p.items.map((it) =>
            it._id === id ? { ...it, likes: (it.likes ?? 0) + 1 } : it
          ),
        }));
        const newData: {
          pages?: Array<{ items: Imagine[] }>;
          pageParams?: unknown;
        } = {
          ...(data ?? {}),
          pages: nextPages,
        };
        qc.setQueryData<{
          pages?: Array<{ items: Imagine[] }>;
          pageParams?: unknown;
        }>(key as QueryKey, newData);
      });
      if (prevOne)
        qc.setQueryData(["imagine", id], {
          ...prevOne,
          likes: (prevOne.likes ?? 0) + 1,
        });
      return { t, prevAll, prevOne };
    },
    onError: (_err, id, ctx) => {
      // revert
      ctx?.prevAll?.forEach(([key, data]) =>
        qc.setQueryData(key, data as unknown as void | undefined)
      );
      if (ctx?.prevOne) qc.setQueryData(["imagine", id], ctx.prevOne);
      if (ctx?.t) toast.dismiss(ctx.t as string);
      // no error toast
    },
    onSuccess: (data, _id, ctx) => {
      if (ctx?.t) toast.dismiss(ctx.t as string);
      // ensure server state
      qc.setQueryData(["imagine", data._id], data);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["imagines", "all"] });
    },
  });
}
