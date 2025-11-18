"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "../contexts/CartContext";
import type { Product } from "@/lib/constants/products";
import Link from "next/link";
import { useWishlist } from "../contexts/WishlistContext";
import { Heart, ShoppingCart, Star } from "lucide-react";

export function ProductCard({ product, admin, onEdit, onDelete, viewMode = "grid" }: { product: Product; admin?: boolean; onEdit?: () => void; onDelete?: () => void; viewMode?: "grid" | "list" }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const fav = isInWishlist(product.id);

  const hasValidDiscount = () => {
    return product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price && (!product.promoExpired || new Date(product.promoExpired) > new Date());
  };

  const getDiscountPercentage = () => {
    if (!hasValidDiscount()) return 0;
    return Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100);
  };

  const getFinalPrice = () => {
    return hasValidDiscount() ? product.discountPrice || product.price : product.price;
  };

  const renderPriceSection = () => {
    if (hasValidDiscount()) {
      return (
        <div className="h-14 flex flex-col justify-center">
          <div className="text-sm text-gray-900 dark:text-gray-200 line-through mb-1">{product.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold text-red-600 dark:text-red-400">{(product.discountPrice || 0).toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full whitespace-nowrap">-{getDiscountPercentage()}%</span>
          </div>
        </div>
      );
    }
    return (
      <div className="h-14 flex items-center">
        <p className="text-xl font-semibold text-gray-900 dark:text-white">{product.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
      </div>
    );
  };

  const renderPriceSectionList = () => {
    if (hasValidDiscount()) {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-red-600 dark:text-red-400">{(product.discountPrice || 0).toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">-{getDiscountPercentage()}%</span>
          </div>
          <span className="text-sm text-gray-900 dark:text-gray-200 line-through">{product.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
        </div>
      );
    }
    return <p className="text-lg font-semibold text-gray-900 dark:text-white">{product.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>;
  };

  if (viewMode === "list") {
    return (
      <div className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800">
        <div className="p-6">
          <div className="flex gap-6">
            <Link href={`/product/${product.slug || product.id}`} className="flex-shrink-0">
              <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden relative">
                {/* Sale Badge for List View */}
                {hasValidDiscount() && (
                  <div className="absolute -top-1 -right-1 z-10">
                    <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold border border-white">-{getDiscountPercentage()}%</div>
                  </div>
                )}
                {product.image && product.image.trim() !== "" && product.image !== "/placeholder-image.svg" ? (
                  <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="80px" />
                ) : (
                  <Image src="/placeholder-product.svg" alt="No image available" fill className="object-contain p-0" sizes="96px" />
                )}
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-3">
                <Link href={`/product/${product.slug || product.id}`}>
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white hover:text-primary transition-colors">{product.name}</h3>
                </Link>
                {!admin && (
                  <button
                    aria-label={fav ? "Remove from Wishlist" : "Add to Wishlist"}
                    className={`p-2 rounded-full transition-all duration-200 ${fav ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (fav) {
                        removeFromWishlist(product.id);
                      } else {
                        addToWishlist(product);
                      }
                    }}
                  >
                    <Heart className={`w-4 h-4 ${fav ? "fill-current" : ""}`} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-full">{product.category}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-900 dark:text-gray-200">4.5</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  {renderPriceSectionList()}
                  <p className="text-sm text-gray-900 dark:text-gray-200">Stock: {product.stock}</p>
                </div>

                {admin ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={onEdit} className="rounded-lg">
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={onDelete} className="rounded-lg">
                      Delete
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={async (e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      await addToCart({
                        id: product.id,
                        name: product.name,
                        price: getFinalPrice(),
                        image: product.image && product.image.trim() !== "" ? product.image : "/placeholder-image.svg",
                      });
                    }}
                    disabled={product.stock === 0}
                    className="gap-2 rounded-lg"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.stock === 0 ? "Out of Stock" : "Buy"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800">
      <div className="relative">
        {/* Sale Badge for Grid View */}
        {hasValidDiscount() && (
          <div className="absolute top-3 left-3 z-20">
            <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg border border-white">-{getDiscountPercentage()}% OFF</div>
          </div>
        )}

        {!admin && (
          <button
            aria-label={fav ? "Remove from Wishlist" : "Add to Wishlist"}
            className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-200 ${fav ? "bg-red-500 text-white" : "bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:text-red-500 backdrop-blur-sm"}`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (fav) {
                removeFromWishlist(product.id);
              } else {
                addToWishlist(product);
              }
            }}
          >
            <Heart size={16} fill={fav ? "currentColor" : "none"} />
          </button>
        )}

        <Link href={`/product/${product.slug || product.id}`} className="block">
          <div className="relative overflow-hidden h-64">
            {product.image && product.image.trim() !== "" && product.image !== "/placeholder-image.svg" ? (
              <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            ) : (
              <div className="w-full h-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <Image src="/placeholder-product.svg" alt="No image available" fill className="object-contain p-1" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              </div>
            )}
          </div>
        </Link>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-full">{product.category}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-900 dark:text-gray-200">4.5</span>
          </div>
        </div>

        <Link href={`/product/${product.slug || product.id}`}>
          <h3 className="font-medium text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-2 mb-3">{product.name}</h3>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <div>
            {renderPriceSection()}
            <p className="text-xs text-gray-900 dark:text-gray-200 mt-1">Stock: {product.stock}</p>
          </div>
        </div>

        {admin ? (
          <div className="flex gap-2">
            <Button className="flex-1 rounded-lg" variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
            <Button className="flex-1 rounded-lg" variant="destructive" size="sm" onClick={onDelete}>
              Delete
            </Button>
          </div>
        ) : (
          <Button
            className="w-full rounded-lg"
            size="sm"
            onClick={async (e) => {
              e.preventDefault();
              await addToCart({
                id: product.id,
                name: product.name,
                price: getFinalPrice(),
                image: product.image && product.image.trim() !== "" ? product.image : "/placeholder-image.svg",
              });
            }}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        )}
      </div>
    </div>
  );
}
