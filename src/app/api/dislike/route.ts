import { NextRequest, NextResponse } from "next/server";
import { dislikeImagine } from "@/lib";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body ?? {};
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const imagine = await dislikeImagine(id);
    if (!imagine) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(imagine, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to dislike" }, { status: 500 });
  }
}
