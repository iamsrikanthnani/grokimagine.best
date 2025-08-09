import { NextRequest, NextResponse } from "next/server";
import { getImagines } from "@/lib";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") ?? 10);
    const skip = Number(searchParams.get("skip") ?? 0);
    const xHandle = searchParams.get("xHandle") ?? undefined;
    const prompt = searchParams.get("prompt") ?? undefined;
    const mediaType =
      (searchParams.get("mediaType") as "image" | "video" | null) ?? undefined;
    const sinceStr = searchParams.get("since");
    const untilStr = searchParams.get("until");
    const since = sinceStr ? new Date(sinceStr) : undefined;
    const until = untilStr ? new Date(untilStr) : undefined;
    const sort =
      (searchParams.get("sort") as "likes" | "new" | "old" | null) ?? undefined;

    const { items, total } = await getImagines({
      limit,
      skip,
      xHandle,
      prompt,
      mediaType: mediaType ?? undefined,
      since,
      until,
      sort,
    });

    return NextResponse.json(
      {
        items,
        total,
        limit,
        skip,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch imagines" },
      { status: 500 }
    );
  }
}
