"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
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
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  
  useEffect(() => {
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
  }, []);

  
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  function addToWishlist(product: Product) {
    setWishlist((prev) => {
      if (prev.find((p) => p.id === product.id)) {
        toast.info(`${product.name} sudah ada di wishlist!`);
        return prev;
      } else {
        toast.success(`${product.name} ditambahkan ke wishlist! ❤️`);
        return [...prev, product];
      }
    });
  }

  function removeFromWishlist(id: number) {
    setWishlist((prev) => {
      const product = prev.find((p) => p.id === id);
      if (product) {
        toast.success(`${product.name} dihapus dari wishlist!`);
      }
      return prev.filter((p) => p.id !== id);
    });
  }

  function isInWishlist(id: number) {
    return wishlist.some((p) => p.id === id);
  }

  function clearWishlist() {
    setWishlist([]);
    toast.success("Wishlist dikosongkan!");
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
