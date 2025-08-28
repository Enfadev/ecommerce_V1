"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "./auth-context";
import type { Product } from "@/data/products";

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  
  useEffect(() => {
    // Clear wishlist for admin users
    if (user?.role === "ADMIN") {
      setWishlist([]);
      return;
    }
    
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        setWishlist(parsedWishlist);
      } catch (error) {
        console.error("Error parsing wishlist from localStorage:", error);
      }
    }
    setIsLoaded(true);
  }, [user?.role]);

  
  useEffect(() => {
    // Don't save wishlist for admin users
    if (isLoaded && user?.role !== "ADMIN") {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded, user?.role]);

  function addToWishlist(product: Product) {
    // Block admin from using wishlist
    if (user?.role === "ADMIN") {
      toast.error("Wishlist feature is not available for admin users");
      return;
    }

    setWishlist((prev) => {
      if (prev.find((p) => p.id === product.id)) {
        toast.info(`${product.name} is already in your wishlist!`);
        return prev;
      } else {
        toast.success(`${product.name} added to wishlist! ❤️`);
        return [...prev, product];
      }
    });
  }

  function removeFromWishlist(id: number) {
    // Block admin from using wishlist
    if (user?.role === "ADMIN") {
      toast.error("Wishlist feature is not available for admin users");
      return;
    }

    setWishlist((prev) => {
      const product = prev.find((p) => p.id === id);
      if (product) {
        toast.success(`${product.name} removed from wishlist!`);
      }
      return prev.filter((p) => p.id !== id);
    });
  }

  function isInWishlist(id: number) {
    return wishlist.some((p) => p.id === id);
  }

  function clearWishlist() {
    // Block admin from using wishlist
    if (user?.role === "ADMIN") {
      toast.error("Wishlist feature is not available for admin users");
      return;
    }
    
    setWishlist([]);
  toast.success("Wishlist cleared!");
  }

  function getWishlistCount() {
    return wishlist.length;
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
