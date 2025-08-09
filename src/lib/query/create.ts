"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPostForm } from "./fetcher";
import type { Imagine } from "@/types";
import { toast } from "sonner";

type CreatePayload = {
  xHandle: string;
  prompt: string;
  file: File;
};

export function useCreateImagine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ xHandle, prompt, file }: CreatePayload) => {
      const form = new FormData();
      form.set("xHandle", xHandle);
      form.set("prompt", prompt);
      form.set("file", file);
      return apiPostForm<Imagine>("/api/create", form);
    },
    onMutate: async (_payload) => {
      const t = toast.loading("Creating...");
      // No optimistic insert into the list to avoid duplicates and ordering glitches
      return { t };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.t) toast.dismiss(ctx.t);
      toast.error(err.message || "Failed to create");
    },
    onSuccess: (data, _vars, ctx) => {
      if (ctx?.t) toast.dismiss(ctx.t);
      toast.success("Created");
      qc.setQueryData(["imagine", data._id], data);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["imagines", "all"] });
    },
  });
}
