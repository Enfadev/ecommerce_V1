"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/constants/products";

interface APIProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  description: string | null;
  category?: string;
  stock?: number;
  discountPrice?: number;
  promoExpired?: string | Date;
}

interface DiscountedProductsProps {
  maxItems?: number;
  title?: string;
}

export function DiscountedProducts({ maxItems = 8, title = "🔥 Special Offers" }: DiscountedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mappedProducts: Product[] = data
            .map((product: APIProduct) => ({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.imageUrl || "/placeholder-image.svg",
              category: product.category || "General",
              stock: product.stock ?? Math.floor(Math.random() * 50) + 1,
              discountPrice: product.discountPrice,
              promoExpired: product.promoExpired,
            }))
            .filter((product) => {
              return product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price && (!product.promoExpired || new Date(product.promoExpired) > new Date());
            })
            .slice(0, maxItems);

          setProducts(mappedProducts);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [maxItems]);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Limited time offers on our best products. Don&apos;t miss out on these amazing deals!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="transform hover:scale-105 transition-transform duration-200">
              <ProductCard product={product} viewMode="grid" />
            </div>
          ))}
        </div>

        {products.length >= maxItems && (
          <div className="text-center mt-8">
            <Link href="/product" className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors duration-200">
              View All Deals
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
