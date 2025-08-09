"use client";

import { Card } from "@/components/ui/card";

export function SkeletonCard() {
  return (
    <Card className="bg-black/80 backdrop-blur-md border border-gray-800/50 rounded-lg shadow-lg overflow-hidden">
      <div className="w-full h-48 bg-gray-900 animate-pulse" />
      <div className="p-4">
        <div className="h-4 w-2/3 bg-gray-900 animate-pulse rounded" />
        <div className="mt-3 h-4 w-1/3 bg-gray-900 animate-pulse rounded" />
      </div>
    </Card>
  );
}

export default SkeletonCard;
