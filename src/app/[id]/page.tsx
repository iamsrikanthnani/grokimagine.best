"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Download, Share2 } from "lucide-react";
import { useGetImagine } from "@/lib/query/get-imagine";
import { useLikeImagine } from "@/lib/query/like";
import Feed from "../page";

export default function ImagineDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { data } = useGetImagine(id);
  const like = useLikeImagine();

  if (!data) return null;
  const isVideo = data.mediaType === "video";

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <Link
        href="/"
        className="fixed top-4 left-4 bg-gray-900 rounded-full p-2 shadow-md border border-gray-800/50"
      >
        <ArrowLeft />
      </Link>

      <div className="max-w-2xl flex flex-col items-center justify-center mx-auto mt-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 25,
            mass: 0.5,
          }}
          className="border lg:h-full lg:w-[24vw] h-full w-[50vw] border-gray-800/50 rounded-lg overflow-hidden bg-black/80 backdrop-blur-sm shadow-xl"
        >
          {isVideo ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video className="w-full rounded-lg" src={data.mediaUrl} controls />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="w-full rounded-lg"
              src={data.mediaUrl}
              alt={data.prompt}
            />
          )}
        </motion.div>

        <div className="lg:h-full lg:w-[24vw] h-full w-[50vw] w-full mt-4 flex items-center justify-between">
          <motion.button
            onClick={() => like.mutate(data._id)}
            className="text-orange-500 inline-flex items-center gap-2"
            aria-label="Like entry"
            whileTap={{ scale: 1.15 }}
          >
            <Heart className="w-5 h-5" />
            {data.likes}
          </motion.button>
          <div className="flex items-center gap-3 text-gray-400"></div>
          <Link
            href={`https://x.com/${data.xHandle}`}
            className="text-blue-400 hover:text-blue-300"
          >
            @{data.xHandle}
          </Link>
        </div>
        <div className="mt-4 text-base text-gray-300 bg-gray-900/50 p-4 rounded-lg border border-gray-800/50">
          {data.prompt}
        </div>
      </div>
      <Feed random />
    </div>
  );
}
