import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/customer/product/ProductDetailClient";

interface ProductDetail {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
  discountPrice?: number;
  promoExpired?: Date | string;
}

async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/product?slug=${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      price: data.price,
      image: data.imageUrl || data.image || "/placeholder-image.svg",
      category: data.category || "General",
      description: data.description,
      discountPrice: data.discountPrice,
      promoExpired: data.promoExpired,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Product Detail`,
    description: product.description || `Buy ${product.name} for $${product.price}`,
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} for $${product.price}`,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
