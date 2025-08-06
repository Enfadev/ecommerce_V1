import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

const categories = ["All", "Fashion", "Electronics"];
const priceRanges = [
  { label: "All", value: "all" },
  { label: "< Rp200,000", value: "lt200" },
  { label: "Rp200,000 - Rp500,000", value: "200-500" },
  { label: "> Rp500,000", value: "gt500" },
];

export function ProductFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const selectedCategory = searchParams.get("category") || "All";
  const selectedPrice = searchParams.get("price") || "all";

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
          {categories.map((cat) => (
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
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-3">
        <span className="text-sm font-medium text-muted-foreground">Price Range:</span>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((range) => (
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
          ))}
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
