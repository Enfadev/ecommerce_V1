"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "../contexts/cart-context";
import { useWishlist } from "../contexts/wishlist-context";
import { toast } from "sonner";
import type { Product } from "../../data/products";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star, Share2, Eye, Package } from "lucide-react";

interface WishlistProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function WishlistProductCard({ product, viewMode = "grid" }: WishlistProductCardProps) {
  const { addToCart } = useCart();
  const { removeFromWishlist } = useWishlist();

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Lihat produk ${product.name} dengan harga Rp ${product.price.toLocaleString("id-ID")}`,
          url: `${window.location.origin}/product/${product.id}`,
        });
      } catch {
        console.log("Sharing cancelled");
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/product/${product.id}`);
      toast.success("Link produk disalin ke clipboard!");
    }
  };

  if (viewMode === "list") {
    return (
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-pink-500/5 to-purple-500/5 border-pink-200/20">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Link href={`/product/${product.id}`} className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center overflow-hidden relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `/placeholder-image.svg`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                </Link>
                <button
                  aria-label="Hapus dari Favorit"
                  className="p-1.5 rounded-full text-red-500 hover:bg-red-50 hover:scale-110 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    removeFromWishlist(product.id);
                  }}
                >
                  <Heart className="w-4 h-4 fill-current animate-pulse" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-200/30">
                  {product.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">4.5 (125 reviews)</span>
                </div>
                {product.stock <= 5 && product.stock > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    Stok Terbatas!
                  </Badge>
                )}
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-primary">Rp {product.price.toLocaleString("id-ID")}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Package className="w-3 h-3" />
                    <span>Stok: {product.stock}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={shareProduct} className="opacity-70 hover:opacity-100">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/product/${product.id}`}>
                      <Eye className="w-4 h-4 mr-1" />
                      Lihat
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      });
                      toast.success(`${product.name} ditambahkan ke keranjang!`);
                    }}
                    disabled={product.stock === 0}
                    className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.stock === 0 ? "Habis" : "Tambah"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-pink-500/5 to-purple-500/5 border-pink-200/20">
      <CardContent className="p-0 relative">
        <button
          aria-label="Hapus dari Favorit"
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-red-500 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 animate-pulse"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            removeFromWishlist(product.id);
          }}
        >
          <Heart size={18} fill="currentColor" className="animate-bounce" />
        </button>

        {product.stock <= 5 && product.stock > 0 && <Badge className="absolute top-3 left-3 z-20 bg-red-500 text-white animate-pulse">Stok Terbatas!</Badge>}

        <Link href={`/product/${product.id}`} className="block">
          <div className="relative overflow-hidden group/image">
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={192}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `/placeholder-image.svg`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white text-black shadow-lg backdrop-blur-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    shareProduct();
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  className="bg-primary/90 hover:bg-primary text-white shadow-lg backdrop-blur-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    });
                    toast.success(`${product.name} ditambahkan ke keranjang!`);
                  }}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock === 0 ? "Habis" : "Tambah"}
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-200/30">
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
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Package className="w-3 h-3" />
                  <span>Stok: {product.stock}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <div className="px-4 pb-4">
          <Button
            className="w-full group/btn bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              });
              toast.success(`${product.name} berhasil ditambahkan ke keranjang!`);
            }}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            {product.stock === 0 ? "Stok Habis" : "Tambah ke Keranjang"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
