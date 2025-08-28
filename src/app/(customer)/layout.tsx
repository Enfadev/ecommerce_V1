"use client";

import Footer from "@/components/layout/Footer";
import { ReactNode, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/contexts/cart-context";
import { WishlistProvider } from "@/components/contexts/wishlist-context";
import { useAuth } from "@/components/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";

interface CustomerLayoutProps {
  children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Routes yang tidak boleh diakses admin
    const adminRestrictedRoutes = ['/checkout', '/wishlist', '/order-history'];
    
    // Wait for auth to load
    if (isLoading) return;

    // If user is authenticated and is admin, check if they're trying to access restricted routes
    if (isAuthenticated && user?.role === "ADMIN") {
      const isRestrictedRoute = adminRestrictedRoutes.some(route => pathname.startsWith(route));
      
      if (isRestrictedRoute) {
        // Redirect admin to admin dashboard
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
        </div>
      </CartProvider>
    </WishlistProvider>
  );
}
