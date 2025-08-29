"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../ui/command";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

interface Category {
  id: number;
  name: string;
  _count?: {
    products: number;
  };
}

interface ApiCategoryResponse {
  id: number;
  name: string;
  productCount: number;
}

interface CategoryInputProps {
  value?: number;
  onValueChange: (categoryId: number) => void;
  placeholder?: string;
}

export default function CategoryInput({ value, onValueChange, placeholder = "Select category..." }: CategoryInputProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    // Default categories for fallback
    const defaultCategories = [
      "Electronics", "Clothing", "Home & Garden", "Books", 
      "Sports", "Beauty", "Toys", "Food & Beverages", "Automotive", "Health"
    ];

    try {
      setLoading(true);
      const response = await fetch("/api/admin/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      
      // Check if response has the expected structure
      if (data.success && Array.isArray(data.categories)) {
        console.log('CategoryInput: API response successful', data.categories);
        // Map the response to match our interface
        const mappedCategories: Category[] = data.categories.map((cat: ApiCategoryResponse) => ({
          id: cat.id,
          name: cat.name,
          _count: {
            products: cat.productCount || 0
          }
        }));
        console.log('CategoryInput: Mapped categories', mappedCategories);
        setCategories(mappedCategories);
      } else {
        console.warn('CategoryInput: Invalid response structure', data);
        // If API doesn't return expected structure, use fallback
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Create default categories from array
      const fallbackCategories: Category[] = defaultCategories.map((name, index) => ({
        id: index + 1,
        name,
        _count: { products: 0 }
      }));
      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new category
  const createCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      setCreateLoading(true);
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      const newCategory = await response.json();
      setCategories(prev => [...prev, newCategory]);
      onValueChange(newCategory.id);
      setNewCategoryName("");
      setIsCreating(false);
      setOpen(false);
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setCreateLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open, fetchCategories]);

  const selectedCategory = Array.isArray(categories) && categories.length > 0 
    ? categories.find(cat => cat?.id === value) 
    : undefined;

  // Filter categories based on search
  const filteredCategories = Array.isArray(categories) 
    ? categories.filter(category =>
        category?.name && (
          !searchValue || 
          category.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      )
    : [];

  const showCreateOption = searchValue && 
    !filteredCategories.some(cat => 
      cat?.name && cat.name.toLowerCase() === searchValue.toLowerCase()
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCategory?.name ? (
            <div className="flex items-center gap-2">
              <span>{selectedCategory.name}</span>
              {selectedCategory._count && (
                <Badge variant="secondary" className="text-xs">
                  {selectedCategory._count.products}
                </Badge>
              )}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Search categories..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading categories...</CommandEmpty>
            ) : (
              <>
                {filteredCategories.length === 0 && !showCreateOption ? (
                  <CommandEmpty>No categories found.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {filteredCategories.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.name || ''}
                        onSelect={() => {
                          onValueChange(category.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === category.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex items-center justify-between w-full">
                          <span>{category.name || 'Unnamed Category'}</span>
                          {category._count && (
                            <Badge variant="outline" className="text-xs">
                              {category._count.products}
                            </Badge>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {showCreateOption && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          setIsCreating(true);
                          setNewCategoryName(searchValue);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create &quot;{searchValue}&quot;
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </>
            )}
          </CommandList>
        </Command>

        {isCreating && (
          <div className="border-t p-3 space-y-2">
            <Label htmlFor="new-category">Create New Category</Label>
            <Input
              id="new-category"
              placeholder="Enter category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  createCategory();
                } else if (e.key === "Escape") {
                  setIsCreating(false);
                  setNewCategoryName("");
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={createCategory}
                disabled={createLoading || !newCategoryName.trim()}
              >
                {createLoading ? "Creating..." : "Create"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setNewCategoryName("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
