"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import ProductReviewSection from "@/components/product/ProductReviewSection";
import ProductRecommendation from "@/components/product/ProductRecommendation";
import { useCart } from "@/components/contexts/cart-context";
import RichTextDisplay from "@/components/ui/RichTextDisplay";
import { Heart, Share2 } from "lucide-react";
import { toast } from "sonner";
import * as React from "react";

interface ProductDetail {
  id: number;
  name: string;
  price: number;
  image: string;
  imageUrl?: string;
  category?: string;
  description?: string;
  discountPrice?: number;
  promoExpired?: Date | string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { addToCart } = useCart();
  const [product, setProduct] = React.useState<ProductDetail | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [isInWishlist, setIsInWishlist] = React.useState(false);
  const [wishlistLoading, setWishlistLoading] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      const _params = await params;
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/product?id=${_params.id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        const mappedProduct: ProductDetail = {
          id: data.id,
          name: data.name,
          price: data.price,
          image: data.imageUrl || data.image || "/placeholder-image.svg",
          category: data.category || "General",
          description: data.description,
        };
        if (isMounted) setProduct(mappedProduct);

        // Check if product is in wishlist
        try {
          const wishlistRes = await fetch("/api/wishlist");
          if (wishlistRes.ok) {
            const wishlistData = await wishlistRes.json();
            if (wishlistData.success && wishlistData.data) {
              const isInList = wishlistData.data.some((item: { id: number }) => item.id === data.id);
              if (isMounted) setIsInWishlist(isInList);
            }
          }
        } catch (err) {
          console.error("Failed to check wishlist:", err);
        }
      } catch (err: unknown) {
        if (isMounted) setError(err instanceof Error ? err.message : "Failed to fetch product");
      }
      if (isMounted) setLoading(false);
    })();
    return () => {
      isMounted = false;
    };
  }, [params]);

  const handleAddToWishlist = async () => {
    if (!product || wishlistLoading) return;

    if (isInWishlist) {
      // Remove from wishlist
      setWishlistLoading(true);
      try {
        const response = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });

        const data = await response.json();

        if (data.success) {
          setIsInWishlist(false);
          toast.success(data.message || "Removed from wishlist!");
        } else {
          toast.error(data.message || "Failed to remove from wishlist");
        }
      } catch (err) {
        console.error("Wishlist error:", err);
        toast.error("Failed to remove from wishlist");
      } finally {
        setWishlistLoading(false);
      }
    } else {
      // Add to wishlist
      setWishlistLoading(true);
      try {
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });

        const data = await response.json();

        if (data.success) {
          setIsInWishlist(true);
          toast.success(data.message || "Added to wishlist!");
        } else {
          toast.error(data.message || "Failed to add to wishlist");
        }
      } catch (err) {
        console.error("Wishlist error:", err);
        toast.error("Failed to add to wishlist");
      } finally {
        setWishlistLoading(false);
      }
    }
  };

  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: product.name,
      text: `Check out ${product.name} - $${product.price}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Share error:", err);
        toast.error("Failed to share");
      }
    }
  };

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      const _params = await params;
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/product?id=${_params.id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        const mappedProduct: ProductDetail = {
          id: data.id,
          name: data.name,
          price: data.price,
          image: data.imageUrl || data.image || "/placeholder-image.svg",
          category: data.category || "General",
          description: data.description,
        };
        if (isMounted) setProduct(mappedProduct);
      } catch (err: unknown) {
        if (isMounted) setError(err instanceof Error ? err.message : "Failed to fetch product");
      }
      if (isMounted) setLoading(false);
    })();
    return () => {
      isMounted = false;
    };
  }, [params]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (error || !product) return notFound();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="group">
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
                {product.image && product.image.trim() !== "" && product.image !== "/placeholder-image.svg" ? (
                  <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                    <Image src="/placeholder-product.svg" alt="No image available" fill className="object-contain p-8" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 bg-foreground/5 text-foreground text-sm font-medium rounded-full border border-border/30">{product.category}</span>
                {/* Sale Badge */}
                {product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price && (!product.promoExpired || new Date(product.promoExpired) > new Date()) && (
                  <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">-{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF</span>
                )}
              </div>

              <h1 className="text-4xl lg:text-5xl font-light text-foreground leading-tight">{product.name}</h1>

              {/* Price Display with Discount Logic */}
              <div className="space-y-2">
                {product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price && (!product.promoExpired || new Date(product.promoExpired) > new Date()) ? (
                  <>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-semibold text-red-600">${product.discountPrice.toLocaleString()}</span>
                      <span className="text-muted-foreground text-lg">USD</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl text-muted-foreground line-through">${product.price.toLocaleString()}</span>
                      <span className="text-sm text-red-600 font-medium">Save ${(product.price - product.discountPrice).toLocaleString()}</span>
                    </div>
                    {product.promoExpired && <p className="text-sm text-orange-600 font-medium">🔥 Sale ends: {new Date(product.promoExpired).toLocaleDateString()}</p>}
                  </>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold text-foreground">${product.price.toLocaleString()}</span>
                    <span className="text-muted-foreground text-lg">USD</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <button
                className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-2xl px-8 py-4 font-medium text-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                onClick={() =>
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price && (!product.promoExpired || new Date(product.promoExpired) > new Date()) ? product.discountPrice : product.price,
                    image: product.image,
                  })
                }
              >
                Add to Cart
              </button>

              <div className="flex gap-3">
                <button onClick={handleAddToWishlist} className="flex-1 border border-border rounded-2xl p-3 flex items-center justify-center text-foreground hover:bg-muted/50 transition-colors group" title="Add to Wishlist">
                  <Heart className={`w-6 h-6 transition-all ${isInWishlist ? "fill-red-500 text-red-500" : "group-hover:fill-red-500 group-hover:text-red-500"}`} />
                </button>
                <button onClick={handleShare} className="flex-1 border border-border rounded-2xl p-3 flex items-center justify-center text-foreground hover:bg-muted/50 transition-colors" title="Share">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        {product.description && (
          <div className="bg-card rounded-2xl shadow-sm border p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Description</h2>
            <RichTextDisplay content={product.description} className="text-muted-foreground leading-relaxed" />
          </div>
        )}

        {/* Reviews and Recommendations */}
        <div className="space-y-8">
          <React.Suspense
            fallback={
              <div className="bg-card rounded-2xl shadow-sm border p-8 text-center">
                <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
                  Loading reviews...
                </div>
              </div>
            }
          >
            <div className="bg-card rounded-2xl shadow-sm border overflow-hidden">
              <ProductReviewSection productId={product.id} />
            </div>

            <div className="bg-card rounded-2xl shadow-sm border overflow-hidden">
              <ProductRecommendation currentProductId={product.id.toString()} maxItems={6} />
            </div>
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
