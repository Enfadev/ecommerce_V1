"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "./wishlist-context";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";

export function WishlistBadge() {
  const { getWishlistCount } = useWishlist();
  const count = getWishlistCount();

  return (
    <Link href="/wishlist">
      <Button variant="ghost" size="sm" className="relative p-2 hover:bg-accent">
        <Heart className="h-5 w-5" />
        {count > 0 && (
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-pink-500 hover:bg-pink-600">
            {count > 99 ? "99+" : count}
          </Badge>
        )}
        <span className="sr-only">Wishlist ({count} items)</span>
      </Button>
    </Link>
  );
}
