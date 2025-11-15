"use client";
import { useState } from "react";
import { useWishlist } from "@/components/contexts/wishlist-context";
import { useCart } from "@/components/contexts/cart-context";
import { useAuth } from "@/components/contexts/auth-context";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminBlocker } from "@/components/shared/AdminBlocker";
import { Heart, ShoppingCart, Trash2, Filter, Grid3X3, List, Share2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

type SortOption = "name" | "price-low" | "price-high" | "category";
type ViewMode = "grid" | "list";

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlist, clearWishlist, getWishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const categories = Array.from(new Set(wishlist.map((product) => product.category)));

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
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image && product.image.trim() !== "" ? product.image : "/placeholder-image.svg",
        });
        addedCount++;
      }
    });
    if (addedCount > 0) {
      toast.success(`${addedCount} products added to cart!`);
    } else {
      toast.info("No available products to add to cart");
    }
  };

  const shareWishlist = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Wishlist",
          text: `Check out my ${getWishlistCount()} favorite products!`,
          url: window.location.href,
        });
      } catch {
        console.log("Sharing cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Wishlist link copied to clipboard!");
    }
  };

  const WishlistStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <Card className="rounded-3xl border-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{getWishlistCount()}</div>
            <div className="text-base text-muted-foreground font-medium">Total Items</div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">{categories.length}</div>
            <div className="text-base text-muted-foreground font-medium">Categories</div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">${filteredProducts.reduce((sum, product) => sum + product.price, 0).toLocaleString("en-US")}</div>
            <div className="text-base text-muted-foreground font-medium">Total Value</div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">{filteredProducts.filter((p) => p.stock > 0).length}</div>
            <div className="text-base text-muted-foreground font-medium">Available</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (user?.role === "ADMIN") {
    return (
      <AdminBlocker
        title="Wishlist Access Restricted"
        message="The wishlist feature is designed for customers to save their favorite products. As an admin, you can focus on managing products, orders, and settings through the admin panel."
      />
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-24">
            <div className="mx-auto mb-8 w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center">
              <Heart className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-12 max-w-md mx-auto text-lg leading-relaxed">Discover amazing products and save your favorites for later.</p>
            <Link href="/product">
              <Button size="lg" className="rounded-2xl px-8 py-6 text-base font-medium bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">My Wishlist</h1>
            <p className="text-muted-foreground text-lg">
              {getWishlistCount()} favorite products • {filteredProducts.filter((p) => p.stock > 0).length} available
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="default" onClick={shareWishlist} className="rounded-2xl px-6">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            {filteredProducts.length > 0 && (
              <Button size="default" onClick={addAllToCart} className="rounded-2xl px-6 bg-primary hover:bg-primary/90">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add All to Cart
              </Button>
            )}
            {wishlist.length > 0 && (
              <Button
                variant="destructive"
                size="default"
                onClick={() => {
                  if (confirm("Are you sure you want to clear your wishlist?")) {
                    clearWishlist();
                  }
                }}
                className="rounded-2xl px-6"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <div className="mb-12">
          <WishlistStats />
        </div>

        {/* Filters and Controls */}
        <div className="space-y-6 mb-8">
          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant={filterCategory === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterCategory("all")} className="rounded-2xl px-4 py-2 text-sm font-medium">
                All Categories
                {filterCategory === "all" && (
                  <Badge variant="secondary" className="ml-2 px-2 py-0 text-xs rounded-full">
                    {wishlist.length}
                  </Badge>
                )}
              </Button>
              {categories.map((category) => (
                <Button key={category} variant={filterCategory === category ? "default" : "outline"} size="sm" onClick={() => setFilterCategory(category)} className="rounded-2xl px-4 py-2 text-sm font-medium capitalize">
                  {category}
                  {filterCategory === category && (
                    <Badge variant="secondary" className="ml-2 px-2 py-0 text-xs rounded-full">
                      {wishlist.filter((p) => p.category === category).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort Options and View Mode */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Sort by</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant={sortBy === "name" ? "default" : "outline"} size="sm" onClick={() => setSortBy("name")} className="rounded-2xl px-4 py-2 text-sm font-medium">
                  Name A-Z
                </Button>
                <Button variant={sortBy === "price-low" ? "default" : "outline"} size="sm" onClick={() => setSortBy("price-low")} className="rounded-2xl px-4 py-2 text-sm font-medium">
                  Lowest Price
                </Button>
                <Button variant={sortBy === "price-high" ? "default" : "outline"} size="sm" onClick={() => setSortBy("price-high")} className="rounded-2xl px-4 py-2 text-sm font-medium">
                  Highest Price
                </Button>
                <Button variant={sortBy === "category" ? "default" : "outline"} size="sm" onClick={() => setSortBy("category")} className="rounded-2xl px-4 py-2 text-sm font-medium">
                  Category
                </Button>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">View</h3>
              <div className="flex gap-1 p-1 rounded-2xl border border-border bg-muted/50">
                <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="rounded-xl">
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="rounded-xl">
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Results Info */}
        {(filterCategory !== "all" || sortBy !== "name") && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 items-center">
              {filterCategory !== "all" && (
                <Badge variant="secondary" className="text-sm py-2 px-4 rounded-2xl font-medium">
                  <Filter className="w-3 h-3 mr-2" />
                  Category: {filterCategory}
                  <button onClick={() => setFilterCategory("all")} className="ml-2 hover:text-destructive transition-colors" aria-label="Clear category filter">
                    ×
                  </button>
                </Badge>
              )}
              {sortBy !== "name" && (
                <Badge variant="outline" className="text-sm py-2 px-4 rounded-2xl font-medium">
                  Sorted by: {sortBy === "price-low" ? "Lowest Price" : sortBy === "price-high" ? "Highest Price" : sortBy === "category" ? "Category" : "Name A-Z"}
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </div>
        )}

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <Card className="rounded-3xl border-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-sm">
            <CardContent className="p-16 text-center">
              <div className="text-muted-foreground space-y-4">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center">
                  <Filter className="w-10 h-10 opacity-50" />
                </div>
                <p className="text-lg font-medium">No products match the selected filter</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "space-y-6"}>
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        )}

        {/* Quick Actions for filled wishlist */}
        {wishlist.length > 0 && (
          <Card className="mt-16 rounded-3xl border-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-sm">
            <CardContent className="p-12">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Ready to Shop?</h3>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">Add all your favorite products to the cart with one click</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={addAllToCart} className="rounded-2xl px-8 py-6 text-base font-medium bg-primary hover:bg-primary/90">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add All to Cart
                  </Button>
                  <Link href="/product">
                    <Button variant="outline" size="lg" className="rounded-2xl px-8 py-6 text-base font-medium">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
