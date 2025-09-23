import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "../components/auth/NextAuthProvider";
import { AuthProvider } from "@/components/contexts/auth-context";
import { DynamicFavicon } from "@/components/ui/DynamicFavicon";
import { getSystemSettingsWithFallback } from "@/lib/system-settings";

function generateSVGFavicon(initial: string): string {
  const svg = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" fill="#334155" rx="6"/>
      <text x="16" y="22" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="bold">
        ${initial}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSystemSettingsWithFallback();

  const faviconUrl = settings.logoUrl || generateSVGFavicon(settings.storeName.charAt(0).toUpperCase());

  const title = settings.defaultMetaTitle || `${settings.storeName} - Trusted Online Shopping Platform`;
  const description = settings.defaultMetaDescription || `Find quality products at the best prices at ${settings.storeName}. ${settings.storeDescription}. Free shipping, secure payment, and 24/7 customer service.`;

  return {
    title,
    description,
    icons: {
      icon: faviconUrl,
      apple: faviconUrl,
    },
    robots: settings.enableIndexing === false ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      images: settings.defaultOgImageUrl ? [{ url: settings.defaultOgImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: settings.defaultOgImageUrl ? [settings.defaultOgImageUrl] : undefined,
      creator: settings.twitterHandle || undefined,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`} suppressHydrationWarning>
        <NextAuthProvider>
          <AuthProvider>
            <DynamicFavicon />
            <div className="flex-1 flex flex-col">{children}</div>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
