"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollFix } from "@/hooks/use-scroll-fix";

interface Category {
  id: number;
  name: string;
  productCount?: number;
}

interface CategoryInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const defaultCategories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Books",
  "Sports",
  "Beauty",
  "Toys",
  "Food & Beverages",
  "Automotive",
  "Health",
  "Technology",
  "Fashion",
  "Furniture",
  "Kitchen",
  "Music",
  "Gaming",
  "Jewelry",
  "Art & Crafts",
  "Pet Supplies",
  "Office",
];

export function CategoryInput({ value = "", onChange, placeholder = "Select or create category...", className = "", disabled = false }: CategoryInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useScrollFix();

  // Load existing categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/categories");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCategories(data.categories);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Combine default categories with existing ones from DB
  const allCategoryNames = Array.from(new Set([...defaultCategories, ...categories.map((cat) => cat.name)])).sort();

  const filteredCategories = allCategoryNames.filter((categoryName) => categoryName.toLowerCase().includes(inputValue.toLowerCase()));

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSelect = (selectedValue: string) => {
    setInputValue(selectedValue);
    onChange(selectedValue);
    setOpen(false);
  };

  const createNewCategory = async (categoryName: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Refresh categories list
          const refreshResponse = await fetch("/api/admin/categories");
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            if (refreshData.success) {
              setCategories(refreshData.categories);
            }
          }

          handleSelect(categoryName.trim());
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Failed to create category:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);

    // If the input matches an existing category exactly, select it
    const exactMatch = allCategoryNames.find((cat) => cat.toLowerCase() === newValue.toLowerCase());

    if (exactMatch) {
      onChange(exactMatch);
    } else {
      // Allow custom category input
      onChange(newValue);
    }
  };

  const clearValue = () => {
    setInputValue("");
    onChange("");
  };

  const isNewCategory = (categoryName: string) => {
    return !allCategoryNames.some((cat) => cat.toLowerCase() === categoryName.toLowerCase());
  };

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} disabled={disabled || loading} className="w-full justify-between h-auto min-h-[40px] px-3 py-2">
            <div className="flex-1 text-left">
              {inputValue ? (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={cn("hover:bg-blue-200", isNewCategory(inputValue) ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800")}>
                    {inputValue}
                    {isNewCategory(inputValue) && <span className="ml-1 text-xs">(New)</span>}
                  </Badge>
                  <span
                    className="h-4 w-4 p-0 hover:bg-gray-100 rounded cursor-pointer inline-flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearValue();
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && clearValue()}
                  >
                    <X className="h-3 w-3" />
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput ref={inputRef} placeholder="Search categories or type new one..." value={inputValue} onValueChange={handleInputChange} />
            <CommandList
              ref={scrollRef}
              className="max-h-[200px] overflow-y-auto scrollbar-thin category-dropdown-list"
              onWheel={(e) => {
                // Ensure wheel events are properly handled
                e.stopPropagation();
              }}
            >
              <CommandEmpty>
                <div className="flex flex-col items-center gap-2 p-4">
                  <p className="text-sm text-muted-foreground">No categories found</p>
                  {inputValue.trim() && (
                    <Button size="sm" onClick={() => createNewCategory(inputValue.trim())} className="gap-2" disabled={loading}>
                      <Plus className="h-3 w-3" />
                      Create &quot;{inputValue.trim()}&quot;
                    </Button>
                  )}
                </div>
              </CommandEmpty>

              <CommandGroup heading="Available Categories">
                {filteredCategories.map((categoryName) => {
                  const categoryData = categories.find((c) => c.name === categoryName);
                  const isDefault = defaultCategories.includes(categoryName);

                  return (
                    <CommandItem key={categoryName} value={categoryName} onSelect={() => handleSelect(categoryName)} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{categoryName}</span>
                        <div className="flex gap-1">
                          {isDefault && (
                            <Badge variant="outline" className="text-xs">
                              Default
                            </Badge>
                          )}
                          {categoryData && typeof categoryData.productCount === "number" && categoryData.productCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {categoryData.productCount} products
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Check className={cn("ml-auto h-4 w-4", value === categoryName ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              {inputValue.trim() && isNewCategory(inputValue) && (
                <CommandGroup heading="Create New">
                  <CommandItem onSelect={() => createNewCategory(inputValue.trim())} className="flex items-center gap-2" disabled={loading}>
                    <Plus className="h-3 w-3" />
                    <span>Create &quot;{inputValue.trim()}&quot;</span>
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
