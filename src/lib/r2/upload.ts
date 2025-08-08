import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const BUCKET = process.env.CLOUDFLARE_R2_BUCKET as string;
const ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID as string;
const SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY as string;
const ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID as string | undefined;
const PUBLIC_BASE_URL = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL as
  | string
  | undefined;

function assertEnv() {
  if (!BUCKET) throw new Error("Missing CLOUDFLARE_R2_BUCKET");
  if (!ACCESS_KEY_ID) throw new Error("Missing CLOUDFLARE_R2_ACCESS_KEY_ID");
  if (!SECRET_ACCESS_KEY)
    throw new Error("Missing CLOUDFLARE_R2_SECRET_ACCESS_KEY");
}

function getEndpoint(): string {
  if (ACCOUNT_ID) {
    return `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`;
  }
  throw new Error("Missing CLOUDFLARE_R2_ACCOUNT_ID");
}

export function getS3Client(): S3Client {
  assertEnv();
  const endpoint = getEndpoint();
  return new S3Client({
    region: "auto",
    endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  });
}

export async function uploadToR2(params: {
  key: string;
  contentType: string;
  body: Buffer | Uint8Array | string;
  cacheControl?: string;
}): Promise<{ key: string; url: string }> {
  assertEnv();
  const s3 = getS3Client();
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
      CacheControl:
        params.cacheControl ?? "public, max-age=31536000, immutable",
    })
  );
  return { key: params.key, url: getPublicUrl(params.key) };
}

export function getPublicUrl(key: string): string {
  if (PUBLIC_BASE_URL) {
    return `${PUBLIC_BASE_URL.replace(/\/$/, "")}/${encodeURI(key)}`;
  }
  if (ACCOUNT_ID) {
    // Public access must be enabled on the bucket or served via a CDN/Worker
    return `https://${ACCOUNT_ID}.r2.cloudflarestorage.com/${encodeURIComponent(
      BUCKET
    )}/${encodeURI(key)}`;
  }
  // Fallback to a non-public S3 path (may not be directly accessible). Consumers can swap to signed URLs if needed.
  return `/${encodeURIComponent(BUCKET)}/${encodeURI(key)}`;
}

export function generateObjectKey(options: {
  xHandle: string;
  originalName: string;
  mediaType: "image" | "video";
}): string {
  const timestamp = Date.now();
  const safeHandle = options.xHandle.replace(/[^a-zA-Z0-9_-]/g, "_");
  const ext =
    options.originalName.split(".").pop() ||
    (options.mediaType === "video" ? "mp4" : "png");
  return `${safeHandle}/${timestamp}-${Math.random()
    .toString(36)
    .slice(2, 10)}.${ext}`;
}
