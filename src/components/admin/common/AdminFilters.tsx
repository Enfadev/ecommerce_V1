"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

interface AdminFiltersProps {
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
  showSearch?: boolean;
  filters?: {
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }[];
  customFilters?: React.ReactNode;
}

export function AdminFilters({ searchValue = "", searchPlaceholder = "Search...", onSearchChange, onSearchSubmit, showSearch = true, filters = [], customFilters }: AdminFiltersProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {showSearch && onSearchChange && (
        <div className="flex-1 flex gap-2">
          <Input placeholder={searchPlaceholder} value={searchValue} onChange={(e) => onSearchChange(e.target.value)} onKeyDown={handleKeyDown} className="flex-1" />
          {onSearchSubmit && (
            <Button onClick={onSearchSubmit} size="icon">
              <Search className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {filters.map((filter, index) => (
        <Select key={index} value={filter.value} onValueChange={filter.onChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {customFilters}
    </div>
  );
}
