import { cache } from "react";
import { prisma } from "@/lib/database";

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock?: number;
  status?: string;
  sku?: string;
  brand?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  structuredData?: string;
  discountPrice?: number | null;
  promoExpired?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  gallery?: string[];
}

export interface ProductStats {
  total: number;
  active: number;
  lowStock: number;
  outOfStock: number;
  onSale: number;
}

export interface InitialProductsData {
  products: Product[];
  stats: ProductStats;
}

export const getInitialProductsData = cache(async (): Promise<InitialProductsData> => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedProducts = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description || undefined,
      price: product.price,
      imageUrl: product.imageUrl || undefined,
      stock: product.stock,
      status: product.status,
      sku: product.sku || undefined,
      brand: product.brand || undefined,
      slug: product.slug || undefined,
      metaTitle: product.metaTitle || undefined,
      metaDescription: product.metaDescription || undefined,
      metaKeywords: product.metaKeywords || undefined,
      ogTitle: product.ogTitle || undefined,
      ogDescription: product.ogDescription || undefined,
      ogImageUrl: product.ogImageUrl || undefined,
      canonicalUrl: product.canonicalUrl || undefined,
      noindex: product.noindex || false,
      structuredData: product.structuredData || undefined,
      discountPrice: product.discountPrice,
      promoExpired: product.promoExpired ? product.promoExpired.toISOString() : undefined,
      category: product.category || undefined,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      gallery: product.gallery || [],
    })) as Product[];

    const stats: ProductStats = {
      total: products.length,
      active: products.filter((p) => p.status === "active").length,
      lowStock: products.filter((p) => p.stock !== null && p.stock > 0 && p.stock <= 10).length,
      outOfStock: products.filter((p) => p.stock !== null && p.stock === 0).length,
      onSale: products.filter((p) => p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price && (!p.promoExpired || new Date(p.promoExpired) > new Date())).length,
    };

    return {
      products: formattedProducts,
      stats,
    };
  } catch (error) {
    console.error("Products Server Action Error:", error);
    throw new Error("Failed to fetch products data");
  } finally {
    await prisma.$disconnect();
  }
});
