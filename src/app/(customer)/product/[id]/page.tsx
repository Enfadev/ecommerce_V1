"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import ProductReviewSection from "@/components/ProductReviewSection";
import ProductRecommendation from "@/components/ProductRecommendation";
import { useCart } from "@/components/cart-context";
import * as React from "react";

interface ProductDetail {
  id: number;
  name: string;
  price: number;
  image: string;
  imageUrl?: string;
  category?: string;
  description?: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { addToCart } = useCart();
  const [product, setProduct] = React.useState<ProductDetail | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

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
        // Map API response to expected format
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
    <div className="min-h-screen bg-background font-sans">
      {/* Header sudah global di layout */}
      <main className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/2 aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            <Image src={product.image} alt={product.name} width={400} height={400} className="object-cover w-full h-full" />
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="text-lg text-muted-foreground mb-2">Category: {product.category}</div>
            <div className="text-2xl font-semibold text-primary mb-4">${product.price.toLocaleString()}</div>
            <button
              className="bg-primary text-primary-foreground rounded-md px-6 py-3 font-semibold hover:bg-primary/80 transition"
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                })
              }
            >
              Add to Cart
            </button>
          </div>
        </div>
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-2">Product Description</h2>
          <p className="text-muted-foreground">Product description is not available yet.</p>
        </section>
        {/* Review & Rating Section */}
        <React.Suspense fallback={<div>Loading reviews...</div>}>
          <ProductReviewSection productId={product.id} />
          {/* Product recommendations */}
          <ProductRecommendation currentProductId={product.id.toString()} maxItems={6} />
        </React.Suspense>
      </main>
    </div>
  );
}
