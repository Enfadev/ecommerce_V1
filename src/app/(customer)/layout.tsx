"use client";

import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/contexts/cart-context";
import { WishlistProvider } from "@/components/contexts/wishlist-context";

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
