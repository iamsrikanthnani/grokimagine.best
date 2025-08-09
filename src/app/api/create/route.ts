import { NextRequest, NextResponse } from "next/server";
import {
  connectToDatabase,
  createImagine,
  generateObjectKey,
  getImagines,
  uploadToR2,
} from "@/lib";
import { cookies } from "next/headers";

const GLOBAL_COOLDOWN = process.env.IMAGINE_GLOBAL_COOLDOWN === "true";

export async function POST(req: NextRequest) {
  try {
    // cookie-based cooldown: block if present
    const cookieStore = await cookies();
    const cooldown = cookieStore.get?.("imagine_cooldown");
    if (cooldown) {
      return NextResponse.json(
        { message: "Rate limit: only one submission per hour." },
        { status: 429 }
      );
    }
    // multipart/form-data: xHandle, prompt, file
    const form = await req.formData();
    const xHandle = form.get("xHandle") as string | null;
    const prompt = form.get("prompt") as string | null;
    const file = form.get("file") as unknown as File | null;

    if (!xHandle || !prompt || !file) {
      return NextResponse.json(
        { error: "xHandle, prompt and file are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // rate limit: 1 per hour (per handle by default, or global if IMAGINE_GLOBAL_COOLDOWN=true)
    const since = new Date(Date.now() - 60 * 60 * 1000);
    const { items } = await getImagines({
      ...(GLOBAL_COOLDOWN ? {} : { xHandle }),
      since,
      limit: 1,
      skip: 0,
    });
    if (items && items.length > 0) {
      return NextResponse.json(
        { error: "Rate limit: only one submission per hour." },
        { status: 429 }
      );
    }

    const arrayBuffer = await (file as File).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Infer mediaType from MIME or filename
    const mime = (file as File).type || "";
    let mediaType: "image" | "video" | null = null;
    if (mime.startsWith("image/")) mediaType = "image";
    else if (mime.startsWith("video/")) mediaType = "video";
    if (!mediaType) {
      const name = (file as File).name?.toLowerCase() || "";
      const ext = name.split(".").pop() || "";
      const imageExts = new Set([
        "png",
        "jpg",
        "jpeg",
        "gif",
        "webp",
        "bmp",
        "svg",
        "tiff",
        "avif",
      ]);
      const videoExts = new Set([
        "mp4",
        "mov",
        "webm",
        "mkv",
        "avi",
        "flv",
        "m4v",
      ]);
      if (imageExts.has(ext)) mediaType = "image";
      else if (videoExts.has(ext)) mediaType = "video";
    }
    if (!mediaType) {
      return NextResponse.json(
        { error: "Unsupported media type" },
        { status: 400 }
      );
    }
    const key = generateObjectKey({
      xHandle,
      originalName: (file as File).name ?? "upload",
      mediaType,
    });
    const { url } = await uploadToR2({
      key,
      body: buffer,
      contentType:
        (file as File).type ||
        (mediaType === "video" ? "video/mp4" : "image/png"),
    });

    const imagine = await createImagine({
      xHandle,
      prompt,
      mediaUrl: url,
      mediaType,
    });
    const res = NextResponse.json(imagine, { status: 201 });
    res.cookies.set("imagine_cooldown", xHandle, {
      httpOnly: true,
      maxAge: 60 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return res;
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to create imagine",
      },
      { status: 500 }
    );
  }
}
