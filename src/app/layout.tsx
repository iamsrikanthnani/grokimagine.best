import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query/provider";
import { ThemeProvider } from "@/components/theme-provider";
import { APP_URL } from "@/lib/config";
import Dev from "@/components/dev";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Grok Imagine Best",
    template: "%s · Grok Imagine Best",
  },
  description:
    "Best of Grok Imagine is a community-driven project that allows you to upload your Grok generated images and videos and vote on others' creations.",
  keywords: [
    "grok",
    "imagine",
    "grok imagine",
    "grok imagine best",
    "grok imagine best images",
    "grok imagine best videos",
    "ai",
    "grok imagine images and videos",
    "nextjs",
    "cloudflare r2",
    "tanstack query",
    "srikanth nani",
    "srikanthnani.com",
  ],
  openGraph: {
    type: "website",
    url: APP_URL,
    title: "Grok Imagine Best",
    description:
      "Best of Grok Imagine is a community-driven project that allows you to upload your Grok generated images and videos and vote on others' creations.",
    siteName: "Grok Imagine Best",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grok Imagine Best",
    description:
      "Best of Grok Imagine is a community-driven project that allows you to upload your Grok generated images and videos and vote on others' creations.",
  },
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Dev />
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
