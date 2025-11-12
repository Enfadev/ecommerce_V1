"use client";

import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/data/products";
import { useSearchParams } from "next/navigation";
import { ProductFilter } from "@/components/product/ProductFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useEffect, Suspense } from "react";
import { Search, Grid, List, Filter, SortAsc, SortDesc } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "newest";
type ViewMode = "grid" | "list";

interface APIProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  description: string | null;
  category?: string;
  stock?: number;
  discountPrice?: number;
  promoExpired?: string | Date;
}

function ProductPageContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("q") || "";
  const category = searchParams.get("category") || "All";
  const price = searchParams.get("price") || "all";


  const [inputSearch, setInputSearch] = useState(search);
  const [localSearch, setLocalSearch] = useState(search);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setLocalSearch(inputSearch);
    }, 400);
    return () => clearTimeout(handler);
  }, [inputSearch]);

  useEffect(() => {
    setLoading(true);
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mappedProducts: Product[] = data.map((product: APIProduct) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.imageUrl || "/placeholder-image.svg",
            category: product.category || "General",
            stock: product.stock ?? Math.floor(Math.random() * 50) + 1,
            discountPrice: product.discountPrice,
            promoExpired: product.promoExpired,
          }));
          setProducts(mappedProducts);
          setError("");
        } else {
          setError(data.error || "Failed to fetch products");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch products");
        setLoading(false);
      });
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((p) => p.name.toLowerCase().includes(localSearch.toLowerCase()));

    if (category !== "All") {
      filtered = filtered.filter((p) => p.category && p.category.toLowerCase() === category.toLowerCase());
    }

    if (price !== "all") {
      filtered = filtered.filter((p) => {
        if (price.startsWith("lt")) {
          const max = Number(price.replace("lt", ""));
          return p.price < max;
        }
        if (price.startsWith("gt")) {
          const min = Number(price.replace("gt", ""));
          return p.price > min;
        }
        if (price.includes("-")) {
          const [min, max] = price.split("-").map(Number);
          return p.price >= min && p.price <= max;
        }
        return true;
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
        default:
          return b.id - a.id;
      }
    });

    return filtered;
  }, [products, localSearch, category, price, sortBy]);

  const getSortIcon = () => {
    if (sortBy.includes("asc")) return <SortAsc className="w-4 h-4" />;
    if (sortBy.includes("desc")) return <SortDesc className="w-4 h-4" />;
    return <Filter className="w-4 h-4" />;
  };

  return (
    <div>
      <div>
        {/* Hero Section */}
        <div className="text-center py-12 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">Complete Product Collection</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Discover the best selected products with premium quality and competitive prices</p>
        </div>

        {/* Search & Filter Section */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 w-5 h-5 group-focus-within:text-primary transition-colors duration-200 z-10 pointer-events-none" />
              <Input
                placeholder="Search for products you want..."
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                className="pl-12 pr-4 h-14 text-base bg-background/50 backdrop-blur-sm border-0 rounded-2xl shadow-sm focus:shadow-lg focus:bg-background transition-all duration-300 placeholder:text-muted-foreground/50 relative"
              />
            </div>
          </div>

          <div className="flex gap-3">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="h-14 px-6 gap-3 bg-background/50 backdrop-blur-sm border-0 rounded-2xl shadow-sm hover:shadow-lg hover:bg-background transition-all duration-300">
                  {getSortIcon()}
                  <span className="font-medium">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl border-0 shadow-xl backdrop-blur-sm bg-background/95 p-2">
                <DropdownMenuItem onClick={() => setSortBy("newest")} className="rounded-lg px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name-asc")} className="rounded-lg px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  Name A-Z
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name-desc")} className="rounded-lg px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  Name Z-A
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-asc")} className="rounded-lg px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  Lowest Price
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-desc")} className="rounded-lg px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  Highest Price
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="flex bg-background/50 backdrop-blur-sm rounded-2xl shadow-sm p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`h-12 w-12 rounded-xl transition-all duration-200 ${viewMode === "grid" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted/50 text-muted-foreground"}`}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`h-12 w-12 rounded-xl transition-all duration-200 ${viewMode === "list" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted/50 text-muted-foreground"}`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Component */}
        <div className="mb-8">
          <ProductFilter />
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">{localSearch ? `Search results "${localSearch}"` : "All Products"}</h2>
            <Badge variant="secondary" className="text-sm">
              {filteredAndSortedProducts.length} products
            </Badge>
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center animate-pulse">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Loading products...</h2>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{error}</h2>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Product not found</h2>
            <p className="text-muted-foreground mb-6">Try changing your search keyword or filter</p>
            <Button
              variant="outline"
              onClick={() => {
                setInputSearch("");
                setLocalSearch("");
                setSortBy("newest");
              }}
            >
              Reset Search
            </Button>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        )}

        {/* Load More Button (for future pagination) */}
        {filteredAndSortedProducts.length > 12 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductPageContent />
    </Suspense>
  );
}
