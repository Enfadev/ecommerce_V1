import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Layout } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ProductFiltersProps {
  searchQuery: string;
  selectedCategory: string;
  discountFilter: "all" | "on-sale" | "no-discount";
  categories: string[];
  visibleColumns: string[];
  allColumns: Array<{ key: string; label: string }>;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDiscountFilterChange: (value: "all" | "on-sale" | "no-discount") => void;
  onToggleColumn: (key: string) => void;
}

export function ProductFilters({ searchQuery, selectedCategory, discountFilter, categories, visibleColumns, allColumns, onSearchChange, onCategoryChange, onDiscountFilterChange, onToggleColumn }: ProductFiltersProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-10" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Columns: {visibleColumns.length}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto">
              <DropdownMenuLabel>Show/Hide Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allColumns.map((col) => (
                <DropdownMenuItem key={col.key} asChild>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={visibleColumns.includes(col.key)} onChange={() => onToggleColumn(col.key)} />
                    {col.label}
                  </label>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Category: {selectedCategory === "all" ? "All" : selectedCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuItem key={category} onClick={() => onCategoryChange(category || "all")}>
                  {category === "all" ? "All Categories" : category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                🏷️
                {discountFilter === "all" ? "All Products" : discountFilter === "on-sale" ? "On Sale" : "No Discount"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Discount Filter</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDiscountFilterChange("all")}>All Products</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDiscountFilterChange("on-sale")}>🔥 Products On Sale</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDiscountFilterChange("no-discount")}>Regular Priced</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
