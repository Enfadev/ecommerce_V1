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
        // Kategori
        setCategories(["All", ...data.categories.filter((c: string) => !!c)]);
        // Rentang harga
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
        // fallback jika error
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
    <div className="space-y-4 p-6 bg-card rounded-lg border shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Product Filter</h3>

      {/* Category Filter */}
      <div className="space-y-3">
        <span className="text-sm font-medium text-muted-foreground">Category:</span>
        <div className="flex flex-wrap gap-2">
          {loading ? (
            <span className="text-muted-foreground">Loading...</span>
          ) : (
            categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm border-2 transition-all hover:scale-105 ${
                  selectedCategory === cat ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-background text-foreground border-muted-foreground/20 hover:border-primary/50"
                }`}
                onClick={() => setParam("category", cat)}
                type="button"
              >
                {cat}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-3">
        <span className="text-sm font-medium text-muted-foreground">Price Range:</span>
        <div className="flex flex-wrap gap-2">
          {loading ? (
            <span className="text-muted-foreground">Loading...</span>
          ) : (
            priceRanges.map((range) => (
              <button
                key={range.value}
                className={`px-4 py-2 rounded-full text-sm border-2 transition-all hover:scale-105 ${
                  selectedPrice === range.value ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-background text-foreground border-muted-foreground/20 hover:border-primary/50"
                }`}
                onClick={() => setParam("price", range.value)}
                type="button"
              >
                {range.label}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategory !== "All" || selectedPrice !== "all") && (
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-muted-foreground">Active Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Category: {selectedCategory}
                <button onClick={() => setParam("category", "All")} className="ml-1 hover:bg-primary/20 rounded-full p-0.5">
                  ×
                </button>
              </span>
            )}
            {selectedPrice !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Price: {priceRanges.find((p) => p.value === selectedPrice)?.label}
                <button onClick={() => setParam("price", "all")} className="ml-1 hover:bg-primary/20 rounded-full p-0.5">
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
