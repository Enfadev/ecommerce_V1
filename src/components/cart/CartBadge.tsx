"use client";

import { useCart } from "../contexts/cart-context";
import { Badge } from "@/components/ui/badge";

export function CartBadge() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  if (totalItems === 0) return null;

  return <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary hover:bg-primary/80 animate-pulse">{totalItems > 99 ? "99+" : totalItems}</Badge>;
}
