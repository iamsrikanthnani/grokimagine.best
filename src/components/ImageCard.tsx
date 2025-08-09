"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Twitter } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Imagine } from "@/types";
import { useLikeImagine } from "@/lib/query/like";
import { useState } from "react";

type Props = {
  imagine: Imagine;
};

export function ImageCard({ imagine }: Props) {
  const like = useLikeImagine();
  const [liked, setLiked] = useState(false);
  const isVideo = imagine.mediaType === "video";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 150, damping: 25, mass: 0.5 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="p-0 bg-black/80 backdrop-blur-md border border-gray-800/50 rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-[36vh] md:h-[56vh] w-full">
          <Link
            href={`/${imagine._id}`}
            aria-label={`View ${imagine.prompt}`}
            className="block h-full"
          >
            {isVideo ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src={imagine.mediaUrl}
                muted
                loop
                playsInline
                preload="metadata"
                onMouseEnter={(e) => {
                  try {
                    (e.currentTarget as HTMLVideoElement).play();
                  } catch {}
                }}
                onMouseLeave={(e) => {
                  const v = e.currentTarget as HTMLVideoElement;
                  try {
                    v.pause();
                    v.currentTime = 0;
                  } catch {}
                }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagine.mediaUrl}
                alt={imagine.prompt}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </Link>

          {/* Overlay icons bottom-right with individual glass buttons */}
          <div className="absolute bottom-2 right-2 z-10 flex items-center gap-2">
            <motion.button
              onClick={() => {
                if (liked) return;
                setLiked(true);
                like.mutate(imagine._id);
              }}
              className="rounded-full flex flex-row items-center gap-1 p-2 bg-black/60 backdrop-blur-md border border-gray-800/50 text-orange-400 hover:text-orange-300 shadow-md"
              aria-label="Like entry"
              whileTap={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {imagine.likes} <Heart className="w-5 h-5" />
            </motion.button>
            <Link
              href={`https://x.com/${encodeURIComponent(imagine.xHandle)}`}
              target="_blank"
              className="rounded-full p-2 bg-black/60 backdrop-blur-md border border-gray-800/50 text-primary-foreground shadow-md"
              aria-label={`Open X profile ${imagine.xHandle}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 300 300.251"
                fill="currentColor"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66" />
              </svg>
            </Link>
          </div>
        </div>
        {/* No prompt footer as per request: image-only with overlay icons */}
      </Card>
    </motion.div>
  );
}

export default ImageCard;
