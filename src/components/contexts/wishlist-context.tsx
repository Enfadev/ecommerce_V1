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
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated || user?.role === "ADMIN") {
        setWishlist([]);
        return;
      }

      setIsLoading(true);
      try {
        const savedWishlist = localStorage.getItem("wishlist");
        if (savedWishlist) {
          try {
            const parsedWishlist = JSON.parse(savedWishlist);
            if (parsedWishlist.length > 0) {
              for (const product of parsedWishlist) {
                await fetch("/api/wishlist", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({ productId: product.id }),
                });
              }
              localStorage.removeItem("wishlist");
            }
          } catch (error) {
            console.error("Error migrating wishlist from localStorage:", error);
          }
        }

        const response = await fetch("/api/wishlist", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setWishlist(data.data || []);
          }
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated, user?.role]);

  async function addToWishlist(product: Product) {
    if (user?.role === "ADMIN") {
      toast.error("Wishlist feature is not available for admin users");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please sign in to add items to wishlist");
      return;
    }

    if (isInWishlist(product.id)) {
      toast.info(`${product.name} is already in your wishlist!`);
      return;
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ productId: product.id }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setWishlist((prev) => [...prev, product]);
        toast.success(`${product.name} added to wishlist! ❤️`);
      } else {
        toast.error(data.message || "Failed to add item to wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add item to wishlist");
    }
  }

  async function removeFromWishlist(id: number) {
    if (user?.role === "ADMIN") {
      toast.error("Wishlist feature is not available for admin users");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please sign in to manage wishlist");
      return;
    }

    const product = wishlist.find((p) => p.id === id);
    
    try {
      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ productId: id }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setWishlist((prev) => prev.filter((p) => p.id !== id));
        if (product) {
          toast.success(`${product.name} removed from wishlist!`);
        }
      } else {
        toast.error(data.message || "Failed to remove item from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove item from wishlist");
    }
  }

  function isInWishlist(id: number) {
    return wishlist.some((p) => p.id === id);
  }

  async function clearWishlist() {
    if (user?.role === "ADMIN") {
      toast.error("Wishlist feature is not available for admin users");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please sign in to manage wishlist");
      return;
    }

    try {
      const response = await fetch("/api/wishlist/clear", {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setWishlist([]);
        toast.success("Wishlist cleared!");
      } else {
        toast.error(data.message || "Failed to clear wishlist");
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Failed to clear wishlist");
    }
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
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
