"use client";

import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { useSearchParams } from "next/navigation";
import { ProductFilter } from "@/components/ProductFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Search, Grid, List, Filter, SortAsc, SortDesc } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "newest";
type ViewMode = "grid" | "list";

export default function ProductPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("q") || "";
  const category = searchParams.get("category") || "All";
  const price = searchParams.get("price") || "all";

  const [localSearch, setLocalSearch] = useState(search);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((p) => p.name.toLowerCase().includes(localSearch.toLowerCase()));

    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (price !== "all") {
      filtered = filtered.filter((p) => {
        if (price === "lt200") return p.price < 200000;
        if (price === "200-500") return p.price >= 200000 && p.price <= 500000;
        if (price === "gt500") return p.price > 500000;
        return true;
      });
    }

    // Sorting
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
  }, [localSearch, category, price, sortBy]);

  const getSortIcon = () => {
    if (sortBy.includes("asc")) return <SortAsc className="w-4 h-4" />;
    if (sortBy.includes("desc")) return <SortDesc className="w-4 h-4" />;
    return <Filter className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center py-12 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">Complete Product Collection</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Discover the best selected products with premium quality and competitive prices</p>
        </div>

        {/* Search & Filter Section */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Cari produk yang Anda inginkan..." value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} className="pl-10 h-12 text-base border-2 focus:border-primary/50" />
            </div>
          </div>

          <div className="flex gap-3">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="gap-2">
                  {getSortIcon()}
                  Urutkan
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("newest")}>Terbaru</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name-asc")}>Nama A-Z</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name-desc")}>Nama Z-A</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-asc")}>Harga Termurah</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-desc")}>Harga Termahal</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="rounded-none">
                <Grid className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="rounded-none">
                <List className="w-4 h-4" />
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
            <h2 className="text-2xl font-semibold">{localSearch ? `Hasil pencarian "${localSearch}"` : "Semua Produk"}</h2>
            <Badge variant="secondary" className="text-sm">
              {filteredAndSortedProducts.length} produk
            </Badge>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Produk tidak ditemukan</h3>
            <p className="text-muted-foreground mb-6">Coba ubah kata kunci pencarian atau filter yang Anda gunakan</p>
            <Button
              variant="outline"
              onClick={() => {
                setLocalSearch("");
                setSortBy("newest");
              }}
            >
              Reset Pencarian
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
              Muat Lebih Banyak
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
