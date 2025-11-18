import type { Metadata } from "next";
import { ProductListClient } from "@/components/customer/product/ProductListClient";
import type { Product } from "@/lib/constants/products";

export const metadata: Metadata = {
  title: "Products | Shop Our Collection",
  description: "Browse our complete product collection with premium quality and competitive prices",
  openGraph: {
    title: "Products | Shop Our Collection",
    description: "Discover the best selected products",
  },
};

interface APIProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  description: string | null;
  category?: string;
  stock?: number;
  slug?: string;
  discountPrice?: number;
  promoExpired?: string | Date;
}

async function getProducts(): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/product`, {
      cache: "no-store", // Always fetch fresh data
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();

    if (Array.isArray(data)) {
      return data.map((product: APIProduct) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl || "/placeholder-image.svg",
        category: product.category || "General",
        stock: product.stock ?? Math.floor(Math.random() * 50) + 1,
        slug: product.slug,
        discountPrice: product.discountPrice,
        promoExpired: product.promoExpired,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; price?: string }> }) {
  const params = await searchParams;
  const products = await getProducts();

  return <ProductListClient initialProducts={products} searchQuery={params.q} categoryFilter={params.category} priceFilter={params.price} />;
}
