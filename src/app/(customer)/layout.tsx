"use client";

import Footer from "@/components/Footer";
import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/cart-context";
import { WishlistProvider } from "@/components/wishlist-context";

interface CustomerLayoutProps {
  children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <WishlistProvider>
      <CartProvider>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
          </main>
          <Toaster />
          <Footer />
        </div>
      </CartProvider>
    </WishlistProvider>
  );
}
