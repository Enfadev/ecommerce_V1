import Footer from "../components/Footer";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "../components/NextAuthProvider";
import ClientWrapper from "./ClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopZone - Platform Belanja Online Terpercaya",
  description: "Temukan produk berkualitas dengan harga terbaik di ShopZone. Gratis ongkir, pembayaran aman, dan customer service 24/7.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`} suppressHydrationWarning>
        <NextAuthProvider>
          <ClientWrapper>
            {children}
          </ClientWrapper>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
