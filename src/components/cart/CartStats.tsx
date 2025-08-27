"use client";

import { useCart } from "../contexts/cart-context";
import { Badge } from "@/components/ui/badge";

export function CartStats() {
  const { getTotalItems, getTotalPrice } = useCart();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (totalItems === 0) return null;

  return (
    <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
      <Badge variant="secondary" className="animate-pulse">
        {totalItems} item{totalItems > 1 ? "s" : ""}
      </Badge>
      <span>•</span>
      <span className="font-medium">Rp {totalPrice.toLocaleString()}</span>
    </div>
  );
}
