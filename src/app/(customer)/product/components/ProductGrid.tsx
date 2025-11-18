"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import type { Product, ViewMode } from "../constants";

interface ProductGridProps {
  products: Product[];
  searchTerm?: string;
}

export default function ProductGrid({ products, searchTerm }: ProductGridProps) {
  const [viewMode] = useState<ViewMode>("grid");

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-32 h-32 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
          <Search className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Product not found</h2>
        <p className="text-muted-foreground mb-6">Try changing your search keyword or filter</p>
        <Button variant="outline" onClick={() => (window.location.href = "/product")}>
          Reset Search
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">{searchTerm ? `Search results "${searchTerm}"` : "All Products"}</h2>
          <Badge variant="secondary" className="text-sm">
            {products.length} products
          </Badge>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} viewMode={viewMode} />
        ))}
      </div>

      {/* Load More Placeholder */}
      {products.length > 12 && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More
          </Button>
        </div>
      )}
    </>
  );
}
