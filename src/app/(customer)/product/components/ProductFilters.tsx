"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { FilterOptions } from "../constants";

interface ProductFiltersProps {
  filterOptions: FilterOptions;
  selectedCategory?: string;
  selectedPrice?: string;
}

export default function ProductFilters({ filterOptions, selectedCategory = "All", selectedPrice = "all" }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All" || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-muted/30 to-muted/10 border-b border-border/20">
        <h2 className="text-xl font-medium tracking-tight text-foreground">Filters</h2>
      </div>

      <div className="p-8 space-y-8">
        {/* Category Filter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Category</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {filterOptions.categories.map((cat) => (
              <button
                key={cat}
                className={`group relative px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  selectedCategory === cat ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
                onClick={() => setParam("category", cat)}
                type="button"
              >
                <span className="relative z-10">{cat}</span>
                {selectedCategory === cat && <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-sm"></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Price Range</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {filterOptions.priceRanges.map((range) => (
              <button
                key={range.value}
                className={`group relative px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  selectedPrice === range.value ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
                onClick={() => setParam("price", range.value)}
                type="button"
              >
                <span className="relative z-10">{range.label}</span>
                {selectedPrice === range.value && <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-sm"></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategory !== "All" || selectedPrice !== "all") && (
          <div className="pt-6 border-t border-border/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-accent rounded-full"></div>
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Active</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {selectedCategory !== "All" && (
                <div className="group inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-2xl text-sm font-medium border border-primary/20">
                  <span>Category: {selectedCategory}</span>
                  <button onClick={() => setParam("category", "All")} className="flex items-center justify-center w-5 h-5 bg-primary/20 hover:bg-primary/30 rounded-full transition-colors duration-200">
                    <span className="text-xs leading-none">×</span>
                  </button>
                </div>
              )}
              {selectedPrice !== "all" && (
                <div className="group inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-2xl text-sm font-medium border border-primary/20">
                  <span>Price: {filterOptions.priceRanges.find((p) => p.value === selectedPrice)?.label}</span>
                  <button onClick={() => setParam("price", "all")} className="flex items-center justify-center w-5 h-5 bg-primary/20 hover:bg-primary/30 rounded-full transition-colors duration-200">
                    <span className="text-xs leading-none">×</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
