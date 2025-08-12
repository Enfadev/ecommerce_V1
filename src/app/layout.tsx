import Footer from "../components/Footer";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WishlistProvider } from "../components/wishlist-context";
import ClientRootLayout from "./ClientRootLayout";

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
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <WishlistProvider>
          <div className="flex-1 flex flex-col">
            <ClientRootLayout>{children}</ClientRootLayout>
          </div>
          <Footer />
        </WishlistProvider>
      </body>
    </html>
  );
}
