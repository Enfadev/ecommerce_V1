"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/constants/products";

interface APIProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  category?: string;
  stock?: number;
  discountPrice?: number;
  promoExpired?: string | Date;
}

interface DiscountedProductsProps {
  title?: string;
  maxItems?: number;
}

export function DiscountedProducts({ title = "🔥 Limited Time Offers", maxItems = 6 }: DiscountedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const discountedProducts = data
            .filter((product: APIProduct) => product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price && (!product.promoExpired || new Date(product.promoExpired) > new Date()))
            .map((product: APIProduct) => ({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.imageUrl || "/placeholder-image.svg",
              category: product.category || "General",
              stock: product.stock || 0,
              discountPrice: product.discountPrice,
              promoExpired: product.promoExpired,
            }))
            .slice(0, maxItems);

          setProducts(discountedProducts);
          setError("");
        } else {
          setError("Failed to fetch products");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch products");
        setLoading(false);
      });
  }, [maxItems]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"></div>
                <div className="h-6 bg-gray-100 dark:bg-gray-800 animate-pulse rounded w-3/4"></div>
                <div className="h-8 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
          <p className="text-red-600 dark:text-red-400">Error loading discounted products: {error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">🛍️</div>
          <p className="text-yellow-800 dark:text-yellow-200 font-medium">No discounted products available at the moment</p>
          <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-2">Check back soon for amazing deals!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Don&apos;t miss out on these amazing deals! Limited time offers with incredible savings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="transform hover:scale-[1.02] transition-transform duration-200">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {products.length === maxItems && (
        <div className="text-center">
          <Link
            href="/product"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium rounded-2xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            <span>View All Discounted Products</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
