import { NextRequest, NextResponse } from "next/server";
import { createImagine } from "@/lib/db/actions/imagine.actions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { xHandle, prompt, mediaUrl, mediaType } = body ?? {};

    if (!xHandle || !prompt || !mediaUrl || !mediaType) {
      return NextResponse.json(
        { error: "xHandle, prompt, mediaUrl and mediaType are required" },
        { status: 400 }
      );
    }

    const imagine = await createImagine({
      xHandle,
      prompt,
      mediaUrl,
      mediaType,
    });
    return NextResponse.json(imagine, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create imagine" },
      { status: 500 }
    );
  }
}
