"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  initialSearch?: string;
}

export default function SearchBar({ initialSearch = "" }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [inputSearch, setInputSearch] = useState(initialSearch);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (inputSearch) {
        params.set("q", inputSearch);
      } else {
        params.delete("q");
      }

      router.push(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(handler);
  }, [inputSearch, router, pathname, searchParams]);

  return (
    <div className="relative group">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 w-5 h-5 group-focus-within:text-primary transition-colors duration-200 z-10 pointer-events-none" />
      <Input
        placeholder="Search for products you want..."
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
        className="pl-12 pr-4 h-14 text-base bg-background/50 backdrop-blur-sm border-0 rounded-2xl shadow-sm focus:shadow-lg focus:bg-background transition-all duration-300 placeholder:text-muted-foreground/50 relative"
      />
    </div>
  );
}
