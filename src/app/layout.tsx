import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "../components/auth/NextAuthProvider";
import { AuthProvider } from "@/components/contexts/auth-context";
import { getSystemSettingsWithFallback } from "@/lib/system-settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Generate metadata dynamically based on system settings
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSystemSettingsWithFallback();
  
  return {
    title: `${settings.storeName} - Trusted Online Shopping Platform`,
    description: `Find quality products at the best prices at ${settings.storeName}. ${settings.storeDescription}. Free shipping, secure payment, and 24/7 customer service.`,
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
            <div className="flex-1 flex flex-col">{children}</div>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
