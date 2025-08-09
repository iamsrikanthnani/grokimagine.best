"use client";

import { Button } from "@/components/ui/button";
import { GithubIcon, Link2, SettingsIcon } from "lucide-react";
import Link from "next/link";

export default function Dev() {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-row gap-2">
      <Button variant="outline" size="icon" className="cursor-pointer" asChild>
        <Link
          href="https://x.com/truly_sn"
          target="_blank"
          className="cursor-pointer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 300 300.251"
            fill="currentColor"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66"
              className="text-white"
            />
          </svg>
        </Link>
      </Button>

      <Button variant="outline" size="icon" className="cursor-pointer" asChild>
        <Link
          href="https://github.com/iamsrikanthnani/grokimagine.best"
          target="_blank"
          className="cursor-pointer"
        >
          <GithubIcon className="w-4 h-4" />
        </Link>
      </Button>
      <Button variant="outline" size="icon" className="cursor-pointer" asChild>
        <Link
          href="https://srikanthnani.com"
          target="_blank"
          className="cursor-pointer"
        >
          <Link2 className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}
