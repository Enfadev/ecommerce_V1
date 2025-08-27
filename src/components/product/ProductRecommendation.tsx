import React from "react";
import { products } from "../../data/products";
import { Card } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

interface ProductRecommendationProps {
  userId?: string;
  wishlist?: string[];
  orderHistory?: string[];
  currentProductId?: string;
  maxItems?: number;
}

function getRecommendedProducts({ wishlist, orderHistory, currentProductId, maxItems = 6 }: Omit<ProductRecommendationProps, "userId">) {
  let recommended: typeof products = [];

  if (wishlist && wishlist.length > 0) {
    recommended = products.filter((p) => wishlist.includes(p.id.toString()) && p.id !== Number(currentProductId));
  }
  if (recommended.length === 0 && orderHistory && orderHistory.length > 0) {
    recommended = products.filter((p) => orderHistory.includes(p.id.toString()) && p.id !== Number(currentProductId));
  }
  if (recommended.length === 0 && currentProductId) {
    const current = products.find((p) => p.id === Number(currentProductId));
    if (current) {
      recommended = products.filter((p) => p.category === current.category && p.id !== Number(currentProductId));
    }
  }
  if (recommended.length === 0) {
    recommended = products
      .filter((p) => p.id !== Number(currentProductId))
      .sort((a, b) => b.stock - a.stock)
      .slice(0, maxItems);
  }
  return recommended.slice(0, maxItems);
}

const ProductRecommendation: React.FC<ProductRecommendationProps> = ({ wishlist, orderHistory, currentProductId, maxItems = 6 }) => {
  const recommended = getRecommendedProducts({ wishlist, orderHistory, currentProductId, maxItems });

  if (recommended.length === 0) return null;

  return (
    <section className="w-full p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Recommended for You</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Carefully selected products just for you</p>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {recommended.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-300 ease-out transform hover:-translate-y-1">
                <div className="aspect-square relative overflow-hidden rounded-t-2xl bg-gray-50 dark:bg-gray-800">
                  <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-4 space-y-3">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full px-2 py-1">
                      {product.category}
                    </Badge>

                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight line-clamp-2">{product.name}</h3>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">${product.price.toLocaleString()}</span>
                      {product.stock > 0 ? <span className="text-xs text-green-600 dark:text-green-400 font-medium">In Stock</span> : <span className="text-xs text-red-600 dark:text-red-400 font-medium">Out of Stock</span>}
                    </div>

                    <Button size="sm" className="rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200" asChild>
                      <Link href={`/products/${product.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="hidden md:block ">
          <CarouselPrevious className="rounded-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg -left-4" />
          <CarouselNext className="rounded-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg -right-4" />
        </div>
      </Carousel>
    </section>
  );
};

export default ProductRecommendation;
