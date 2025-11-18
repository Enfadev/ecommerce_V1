"use client";

import { useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useWishlist } from "@/components/contexts/WishlistContext";
import type { ProductDetail } from "../constants";

interface ProductActionsProps {
  product: ProductDetail;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleAddToWishlist = async () => {
    if (wishlistLoading) return;

    setWishlistLoading(true);
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category || "General",
          stock: product.stock || 0,
        });
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} - $${product.price}`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Share error:", err);
        toast.error("Failed to share");
      }
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleAddToWishlist}
        disabled={wishlistLoading}
        className="flex-1 border border-border rounded-2xl p-3 flex items-center justify-center text-foreground hover:bg-muted/50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
        title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart className={`w-6 h-6 transition-all ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : "group-hover:fill-red-500 group-hover:text-red-500"}`} />
      </button>
      <button onClick={handleShare} className="flex-1 border border-border rounded-2xl p-3 flex items-center justify-center text-foreground hover:bg-muted/50 transition-colors" title="Share">
        <Share2 className="w-6 h-6" />
      </button>
    </div>
  );
}
