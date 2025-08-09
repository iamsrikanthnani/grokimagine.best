import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { APP_URL } from "@/lib/config";

// Restrict API routes to requests initiated from our own site (best-effort).
// Checks Origin and Referer to match APP_URL. Allows same-origin navigations and dev localhost.

const allowedHosts = new Set([new URL(APP_URL).host, "localhost:3000"]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Only guard API routes
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const origin = req.headers.get("origin") || "";
  const referer = req.headers.get("referer") || "";
  const secFetchSite = (req.headers.get("sec-fetch-site") || "").toLowerCase();
  const xRequestedWith = (
    req.headers.get("x-requested-with") || ""
  ).toLowerCase();

  const isAllowed = (url: string) => {
    try {
      if (!url) return false;
      const host = new URL(url).host;
      return allowedHosts.has(host);
    } catch {
      return false;
    }
  };

  // Allow when browser signals same-origin/same-site fetches
  if (secFetchSite === "same-origin" || secFetchSite === "same-site") {
    return NextResponse.next();
  }
  // Allow when Origin/Referer match our host
  if (isAllowed(origin) || isAllowed(referer)) {
    return NextResponse.next();
  }
  // Optionally allow XHR hint combined with allowed referer
  if (xRequestedWith === "xmlhttprequest" && isAllowed(referer)) {
    return NextResponse.next();
  }

  return NextResponse.json({ message: "Forbidden" }, { status: 403 });
}

export const config = {
  matcher: ["/api/:path*"],
};
