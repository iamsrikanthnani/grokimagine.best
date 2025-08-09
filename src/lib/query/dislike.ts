"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPostJson } from "./fetcher";
import type { Imagine } from "@/types";
import { toast } from "sonner";

export function useDislikeImagine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      apiPostJson<Imagine>("/api/dislike", { id }),
    onMutate: async (id: string) => {
      const t = toast.loading("Disliking...");
      const prevAll = qc.getQueriesData({ queryKey: ["imagines", "all"] });
      const prevOne = qc.getQueryData(["imagine", id]) as Imagine | undefined;
      prevAll.forEach(([key, data]) => {
        if (!data) return;
        const pages = (data as any).pages as
          | Array<{ items: Imagine[] }>
          | undefined;
        if (!pages) return;
        const nextPages = pages.map((p) => ({
          ...p,
          items: p.items.map((it) =>
            it._id === id ? { ...it, dislikes: (it.dislikes ?? 0) + 1 } : it
          ),
        }));
        qc.setQueryData(key, { ...(data as any), pages: nextPages });
      });
      if (prevOne)
        qc.setQueryData(["imagine", id], {
          ...prevOne,
          dislikes: (prevOne.dislikes ?? 0) + 1,
        });
      return { t, prevAll, prevOne };
    },
    onError: (_err, id, ctx) => {
      ctx?.prevAll?.forEach(([key, data]) => qc.setQueryData(key, data as any));
      if (ctx?.prevOne) qc.setQueryData(["imagine", id], ctx.prevOne);
      if (ctx?.t) toast.dismiss(ctx.t);
      toast.error("Failed to dislike");
    },
    onSuccess: (data, _id, ctx) => {
      if (ctx?.t) toast.dismiss(ctx.t);
      toast.success("Disliked");
      qc.setQueryData(["imagine", data._id], data);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["imagines", "all"] });
    },
  });
}
