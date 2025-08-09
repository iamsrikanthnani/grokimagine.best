"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ImageCard from "@/components/ImageCard";
import SkeletonCard from "@/components/SkeletonCard";
import { useGetAllImagines } from "@/lib/query/get-all";
import type { Imagine } from "@/types";
import { UploadIcon } from "lucide-react";

export default function FeedView({ random = false }: { random?: boolean }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useGetAllImagines({ limit: 12 });
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "0px 0px 400px 0px", threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const items = useMemo(
    () =>
      (data?.pages.flatMap((p) => p.items) ?? [])
        .slice()
        .sort(() => (random ? Math.random() - 0.5 : 0)),
    [data, random]
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-12 w-full z-10 bg-background/90 backdrop-blur-sm text-center border-b border-border/50 mt-6 md:mt-0">
        <h1 className="text-2xl md:text-4xl font-bold">
          Grok Imagine Art Contest
        </h1>
        <p className="text-sm md:text-lg mt-2 text-muted-foreground">
          Share your AI-generated art and vote on favorites!
        </p>
        <Link href="/upload" className="inline-block mt-4">
          <Button className="cursor-pointer w-48 px-6 py-2 shadow-md">
            Upload <UploadIcon className="w-4 h-4" />
          </Button>
        </Link>
      </header>

      {/* Grid */}
      <main className="mt-4 p-4 lg:px-16">
        <motion.ul
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {items.map((it: Imagine) => (
            <li key={it._id}>
              <ImageCard imagine={it} />
            </li>
          ))}
          {(status === "pending" || isFetchingNextPage) &&
            Array.from({ length: 8 }).map((_, i) => (
              <li key={`sk-${i}`}>
                <SkeletonCard />
              </li>
            ))}
        </motion.ul>
        <div ref={loaderRef} className="h-10" />
      </main>
    </div>
  );
}
