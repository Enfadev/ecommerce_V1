import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ProductFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const selectedCategory = searchParams.get("category") || "All";
  const selectedPrice = searchParams.get("price") || "all";

  const [categories, setCategories] = useState<string[]>(["All"]);
  const [priceRanges, setPriceRanges] = useState<Array<{ label: string; value: string }>>([{ label: "All", value: "all" }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOptions() {
      setLoading(true);
      try {
        const res = await fetch("/api/product/filter-options");
        const data = await res.json();
        setCategories(["All", ...data.categories.filter((c: string) => !!c)]);
        interface PriceRange {
          label: string;
          min: number | null;
          max: number | null;
        }

        setPriceRanges(
          data.priceRanges.map((r: PriceRange) => ({
            label: r.label,
            value: r.min === null && r.max === null ? "all" : r.min === null ? `lt${r.max}` : r.max === null ? `gt${r.min}` : `${r.min}-${r.max}`,
          }))
        );
      } catch {
        setCategories(["All"]);
        setPriceRanges([{ label: "All", value: "all" }]);
      }
      setLoading(false);
    }
    fetchOptions();
  }, []);

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
        <h3 className="text-xl font-medium tracking-tight text-foreground">Filters</h3>
      </div>

      <div className="p-8 space-y-8">
        {/* Category Filter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Category</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              categories.map((cat) => (
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
              ))
            )}
          </div>
        </div>

        {/* Price Filter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Price Range</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              priceRanges.map((range) => (
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
              ))
            )}
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
                  <span>Price: {priceRanges.find((p) => p.value === selectedPrice)?.label}</span>
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
