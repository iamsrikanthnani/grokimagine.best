"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPostForm } from "./fetcher";
import type { Imagine } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type CreatePayload = {
  xHandle: string;
  prompt: string;
  file: File;
};

export function useCreateImagine() {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async ({ xHandle, prompt, file }: CreatePayload) => {
      const form = new FormData();
      form.set("xHandle", xHandle);
      form.set("prompt", prompt);
      form.set("file", file);
      return apiPostForm<Imagine>("/api/create", form);
    },
    onMutate: async (_payload) => {
      // remove loading toast per requirement
      return {};
    },
    onError: (err, _vars, ctx) => {
      // surface API message (e.g., cookie rate limit)
      const msg = err?.message || "Failed to create";
      // use a subtle toast
      import("sonner").then(({ toast }) => toast.error(msg));
    },
    onSuccess: (data, _vars, ctx) => {
      qc.setQueryData(["imagine", data._id], data);
      router.push("/");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["imagines", "all"] });
    },
  });
}
