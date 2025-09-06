"use client";

import Footer from "@/components/layout/Footer";
import { ReactNode, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/contexts/cart-context";
import { WishlistProvider } from "@/components/contexts/wishlist-context";
import { useAuth } from "@/components/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { ChatWidget } from "@/components/chat/ChatWidget";

interface CustomerLayoutProps {
  children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const adminRestrictedRoutes = ['/checkout', '/wishlist', '/order-history'];
    
    if (isLoading) return;

    if (isAuthenticated && user?.role === "ADMIN") {
      const isRestrictedRoute = adminRestrictedRoutes.some(route => pathname.startsWith(route));
      
      if (isRestrictedRoute) {
        router.push('/admin');
        return;
      }
    }
  }, [user, isAuthenticated, isLoading, pathname, router]);

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
          <ChatWidget />
        </div>
      </CartProvider>
    </WishlistProvider>
  );
}
