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
    default: "Grok Imagine Art Contest",
    template: "%s · Grok Imagine Art Contest",
  },
  description:
    "AI art feed with uploads, voting, and a buttery-smooth infinite scroll. Grok Imagine Art Contest is a community-driven project that allows you to upload your AI-generated art and vote on others' creations.",
  keywords: [
    "grok",
    "imagine",
    "grok imagine",
    "grok imagine art contest",
    "grok imagine art",
    "grok imagine art competition",
    "ai",
    "grok imagine art",
    "nextjs",
    "cloudflare r2",
    "tanstack query",
    "srikanth nani",
    "srikanthnani.com",
  ],
  openGraph: {
    type: "website",
    url: APP_URL,
    title: "Grok Imagine Art Contest",
    description:
      "AI art feed with uploads, voting, and a buttery-smooth infinite scroll. Grok Imagine Art Contest is a community-driven project that allows you to upload your AI-generated art and vote on others' creations.",
    siteName: "Grok Imagine",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grok Imagine Art Contest",
    description:
      "AI art feed with uploads, voting, and a buttery-smooth infinite scroll.",
  },
  alternates: { canonical: "/" },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
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
