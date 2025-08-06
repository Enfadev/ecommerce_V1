"use client";

import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useCart } from "./cart-context";
import { toast } from "sonner";
import type { Product } from "../data/products";
import Link from "next/link";
import { useWishlist } from "./wishlist-context";
import { Heart, ShoppingCart, Star } from "lucide-react";

export function ProductCard({ product, admin, onEdit, onDelete, viewMode = "grid" }: { product: Product; admin?: boolean; onEdit?: () => void; onDelete?: () => void; viewMode?: "grid" | "list" }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const fav = isInWishlist(product.id);

  if (viewMode === "list") {
    return (
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Link href={`/product/${product.id}`} className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format`;
                    }}
                    loading="lazy"
                  />
                ) : (
                  <div className="text-muted-foreground text-xs text-center">
                    Foto
                    <br />
                    Produk
                  </div>
                )}
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-semibold text-lg hover:text-primary transition-colors">{product.name}</h3>
                </Link>
                {!admin && (
                  <button
                    aria-label={fav ? "Remove from Wishlist" : "Add to Wishlist"}
                    className={`p-1.5 rounded-full transition-all duration-300 transform ${fav ? "text-red-500 scale-110 animate-pulse" : "text-gray-400 hover:text-red-500 hover:scale-110"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      fav ? removeFromWishlist(product.id) : addToWishlist(product);
                    }}
                  >
                    <Heart className={`w-4 h-4 transition-all duration-300 ${fav ? "fill-current animate-bounce" : ""}`} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">4.5</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-primary">Rp {product.price.toLocaleString("id-ID")}</p>
                  <p className="text-sm text-muted-foreground">Stok: {product.stock}</p>
                </div>

                {admin ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={onEdit}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={onDelete}>
                      Delete
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      addToCart({
                        id: product.id.toString(),
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      });
                      toast.success(`${product.name} added to cart!`);
                    }}
                    disabled={product.stock === 0}
                    className="gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.stock === 0 ? "Out of Stock" : "Buy"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-0 relative">
        {!admin && (
          <button
            aria-label={fav ? "Remove from Wishlist" : "Add to Wishlist"}
            className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
              fav ? "bg-red-500 text-white shadow-lg animate-pulse" : "bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500 backdrop-blur-sm shadow-lg"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              fav ? removeFromWishlist(product.id) : addToWishlist(product);
            }}
          >
            <Heart size={18} fill={fav ? "currentColor" : "none"} className={`transition-all duration-300 ${fav ? "animate-bounce" : ""}`} />
          </button>
        )}

        <Link href={`/product/${product.id}`} className="block">
          <div className="relative overflow-hidden group/image">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format`;
              }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

            {/* Quick Add Button */}
            {!admin && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="sm"
                  className="bg-primary/90 hover:bg-primary text-white shadow-lg backdrop-blur-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart({
                      id: String(product.id),
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    });
                    toast.success(`${product.name} added to cart!`);
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Quick Add
                </Button>
              </div>
            )}
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">4.5</span>
              </div>
            </div>

            <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">{product.name}</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-lg font-bold text-primary">Rp {product.price.toLocaleString("id-ID")}</p>
                <p className="text-xs text-muted-foreground">Stok: 50</p>
              </div>
            </div>
          </div>
        </Link>

        <div className="px-4 pb-4">
          {admin ? (
            <div className="flex gap-2">
              <Button className="flex-1" variant="outline" size="sm" onClick={onEdit}>
                Edit
              </Button>
              <Button className="flex-1" variant="destructive" size="sm" onClick={onDelete}>
                Delete
              </Button>
            </div>
          ) : (
            <Button
              className="w-full group/btn"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                addToCart({
                  id: String(product.id),
                  name: product.name,
                  price: product.price,
                  image: product.image,
                });
                toast.success(`${product.name} successfully added to cart!`);
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
