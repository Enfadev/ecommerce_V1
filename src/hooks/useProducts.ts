import { useState, useEffect, useCallback } from "react";

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

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/product");
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const deleteProduct = async (id: number) => {
    try {
      const res = await fetch("/api/product", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };

  const updateProductStatus = async (id: number, status: string) => {
    try {
      const res = await fetch("/api/product", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update product status");
      }

      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
      return { success: true };
    } catch (error) {
      console.error("Status update error:", error);
      throw error;
    }
  };

  const stats: ProductStats = {
    total: products.length,
    active: products.filter((p) => (p.stock ?? 0) > 0).length,
    lowStock: products.filter((p) => (p.stock ?? 0) < 10 && (p.stock ?? 0) > 0).length,
    outOfStock: products.filter((p) => (p.stock ?? 0) === 0).length,
    onSale: products.filter((p) => p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price && (!p.promoExpired || new Date(p.promoExpired) > new Date())).length,
  };

  return {
    products,
    stats,
    loading,
    error,
    fetchProducts,
    deleteProduct,
    updateProductStatus,
    setProducts,
  };
}
