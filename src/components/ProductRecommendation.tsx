import React from "react";
import { products } from "../data/products";
import { Card } from "./ui/card";
import { Carousel } from "./ui/carousel";
import { Badge } from "./ui/badge";
import Image from "next/image";

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
    <section className="w-full py-6">
      <h2 className="text-xl font-bold mb-4 text-white">Rekomendasi Untuk Anda</h2>
      <Carousel className="dark">
        {recommended.map((product) => (
          <Card key={product.id} className="bg-zinc-900 text-white shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center">
              <Image src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-lg mb-2" width={128} height={128} />
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              {/* Deskripsi tidak tersedia di Product, bisa tambahkan jika ada */}
              <span className="font-bold text-green-400">Rp{product.price.toLocaleString()}</span>
            </div>
          </Card>
        ))}
      </Carousel>
    </section>
  );
};

export default ProductRecommendation;
