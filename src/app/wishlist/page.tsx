"use client";
import { useState } from "react";
import { useWishlist } from "@/components/wishlist-context";
import { useCart } from "@/components/cart-context";
import { Header } from "@/components/Header";
import { WishlistProductCard } from "@/components/WishlistProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, ShoppingCart, Trash2, Star, Filter, SortAsc, Grid3X3, List, Share2, Download } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { Product } from "@/data/products";

type SortOption = "name" | "price-low" | "price-high" | "category";
type ViewMode = "grid" | "list";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, getWishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Get unique categories
  const categories = Array.from(new Set(wishlist.map((product) => product.category)));

  // Filter and sort products
  const filteredProducts = wishlist.filter((product) => filterCategory === "all" || product.category === filterCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "category":
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const addAllToCart = () => {
    let addedCount = 0;
    filteredProducts.forEach((product) => {
      if (product.stock > 0) {
        addToCart({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
        });
        addedCount++;
      }
    });
    if (addedCount > 0) {
      toast.success(`${addedCount} produk ditambahkan ke keranjang!`);
    } else {
      toast.info("Tidak ada produk tersedia untuk ditambahkan ke keranjang");
    }
  };

  const shareWishlist = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Wishlist Saya",
          text: `Lihat ${getWishlistCount()} produk favorit saya!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Sharing cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link wishlist disalin ke clipboard!");
    }
  };

  const WishlistStats = () => (
    <Card className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-200/20">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-500">{getWishlistCount()}</div>
            <div className="text-sm text-muted-foreground">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Kategori</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">Rp {filteredProducts.reduce((sum, product) => sum + product.price, 0).toLocaleString("id-ID")}</div>
            <div className="text-sm text-muted-foreground">Total Nilai</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{filteredProducts.filter((p) => p.stock > 0).length}</div>
            <div className="text-sm text-muted-foreground">Tersedia</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-6xl mx-auto px-4 py-10">
          <div className="text-center py-20">
            <div className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-pink-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Wishlist Kosong</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Belum ada produk favorit yang ditambahkan. Mulai jelajahi produk dan tambahkan yang Anda sukai!</p>
            <Link href="/product">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Jelajahi Produk
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Wishlist Saya</h1>
            <p className="text-muted-foreground mt-2">
              {getWishlistCount()} produk favorit • {filteredProducts.filter((p) => p.stock > 0).length} tersedia
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={shareWishlist}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            {filteredProducts.length > 0 && (
              <Button size="sm" onClick={addAllToCart} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Tambah Semua ke Keranjang
              </Button>
            )}
            {wishlist.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm("Yakin ingin mengosongkan wishlist?")) {
                    clearWishlist();
                  }
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Kosongkan
              </Button>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <WishlistStats />

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between my-8">
          <div className="flex flex-wrap gap-2">
            {/* Category Filter */}
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 rounded-lg border bg-background text-sm">
              <option value="all">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Sort Options */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="px-3 py-2 rounded-lg border bg-background text-sm">
              <option value="name">Nama A-Z</option>
              <option value="price-low">Harga Terendah</option>
              <option value="price-high">Harga Tertinggi</option>
              <option value="category">Kategori</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-1 p-1 rounded-lg border bg-muted">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filter Results Info */}
        {filterCategory !== "all" && (
          <div className="mb-6">
            <Badge variant="secondary" className="text-sm">
              <Filter className="w-3 h-3 mr-1" />
              {filteredProducts.length} produk dalam kategori "{filterCategory}"
            </Badge>
          </div>
        )}

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada produk yang sesuai dengan filter yang dipilih</p>
            </div>
          </Card>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
            {sortedProducts.map((product) => (
              <WishlistProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        )}

        {/* Quick Actions for filled wishlist */}
        {wishlist.length > 0 && (
          <Card className="mt-12 bg-gradient-to-r from-pink-500/5 to-purple-500/5 border-pink-200/20">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Siap untuk berbelanja?</h3>
                <p className="text-muted-foreground mb-4">Tambahkan semua produk favorit Anda ke keranjang dengan satu klik</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" onClick={addAllToCart} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Tambah Semua ke Keranjang
                  </Button>
                  <Link href="/product">
                    <Button variant="outline" size="lg">
                      Lanjut Belanja
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
