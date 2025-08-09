"use client";

import { Card } from "@/components/ui/card";

export function SkeletonCard() {
  return (
    <Card className="p-0 bg-card/80 backdrop-blur-md border border-border rounded-lg shadow-lg overflow-hidden">
      <div className="relative w-full h-[36vh] md:h-[56vh]">
        <div className="absolute inset-0 bg-muted animate-pulse" />
        <div className="absolute bottom-2 right-2 flex gap-2">
          <div className="rounded-full p-2 bg-background/60 backdrop-blur-md border border-border shadow-md w-8 h-8" />
          <div className="rounded-full p-2 bg-background/60 backdrop-blur-md border border-border shadow-md w-8 h-8" />
        </div>
      </div>
    </Card>
  );
}

export default SkeletonCard;
