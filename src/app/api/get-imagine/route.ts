import { NextRequest, NextResponse } from "next/server";
import { getImagine } from "@/lib";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const imagine = await getImagine(id);
    if (!imagine) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(imagine, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch imagine" },
      { status: 500 }
    );
  }
}
