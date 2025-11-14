"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import ProductReviewSection from "@/components/product/ProductReviewSection";
import ProductRecommendation from "@/components/product/ProductRecommendation";
import { useCart } from "@/components/contexts/cart-context";
import { useWishlist } from "@/components/contexts/wishlist-context";
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

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [product, setProduct] = React.useState<ProductDetail | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [wishlistLoading, setWishlistLoading] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      const _params = await params;
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/product?slug=${_params.slug}`);
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

  const handleAddToWishlist = async () => {
    if (!product || wishlistLoading) return;

    setWishlistLoading(true);
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product as any);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    } finally {
      setWishlistLoading(false);
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (error || !product) return notFound();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
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

          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 bg-foreground/5 text-foreground text-sm font-medium rounded-full border border-border/30">{product.category}</span>
                {product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price && (!product.promoExpired || new Date(product.promoExpired) > new Date()) && (
                  <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">-{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF</span>
                )}
              </div>

              <h1 className="text-4xl lg:text-5xl font-light text-foreground leading-tight">{product.name}</h1>

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
            </div>
          </div>
        </div>

        {product.description && (
          <div className="bg-card rounded-2xl shadow-sm border p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Description</h2>
            <RichTextDisplay content={product.description} className="text-muted-foreground leading-relaxed" />
          </div>
        )}

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
