"use client";

import { useCart } from "@/components/contexts/CartContext";
import type { ProductDetail } from "../constants";
import { getEffectivePrice } from "../constants";

interface AddToCartSectionProps {
  product: ProductDetail;
}

export default function AddToCartSection({ product }: AddToCartSectionProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: getEffectivePrice(product),
      image: product.image,
    });
  };

  return (
    <button className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-2xl px-8 py-4 font-medium text-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0" onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}
