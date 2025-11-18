"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Filter, SortAsc, SortDesc } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { SortOption } from "../constants";

interface SortControlProps {
  currentSort?: SortOption;
}

export default function SortControl({ currentSort = "newest" }: SortControlProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (sortBy: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());

    if (sortBy === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", sortBy);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const getSortIcon = () => {
    if (currentSort.includes("asc")) return <SortAsc className="w-4 h-4" />;
    if (currentSort.includes("desc")) return <SortDesc className="w-4 h-4" />;
    return <Filter className="w-4 h-4" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg" className="h-14 px-6 gap-3 bg-background/50 backdrop-blur-sm border-0 rounded-2xl shadow-sm hover:shadow-lg hover:bg-background transition-all duration-300">
          {getSortIcon()}
          <span className="font-medium">Sort</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-xl border-0 shadow-xl backdrop-blur-sm bg-background/95 p-2">
        <DropdownMenuItem onClick={() => handleSortChange("newest")} className="rounded-lg px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors">
          Newest First
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSortChange("name-asc")} className="rounded-lg px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors">
          Name A-Z
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSortChange("name-desc")} className="rounded-lg px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors">
          Name Z-A
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSortChange("price-asc")} className="rounded-lg px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors">
          Lowest Price
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSortChange("price-desc")} className="rounded-lg px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors">
          Highest Price
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
