/**
 * Product Listing Page - Constants & Types
 */

export type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "newest";
export type ViewMode = "grid" | "list";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  slug?: string;
  discountPrice?: number;
  promoExpired?: string | Date;
}

export interface FilterOptions {
  categories: string[];
  priceRanges: Array<{
    label: string;
    value: string;
    min: number | null;
    max: number | null;
  }>;
}

/**
 * Sort products by given option
 */
export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];

  sorted.sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "newest":
      default:
        return b.id - a.id;
    }
  });

  return sorted;
}

/**
 * Filter products by search term
 */
export function filterBySearch(products: Product[], search: string): Product[] {
  if (!search) return products;
  return products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
}

/**
 * Filter products by category
 */
export function filterByCategory(products: Product[], category: string): Product[] {
  if (!category || category === "All") return products;
  return products.filter((p) => p.category && p.category.toLowerCase() === category.toLowerCase());
}

/**
 * Filter products by price range
 */
export function filterByPrice(products: Product[], priceRange: string): Product[] {
  if (!priceRange || priceRange === "all") return products;

  return products.filter((p) => {
    if (priceRange.startsWith("lt")) {
      const max = Number(priceRange.replace("lt", ""));
      return p.price < max;
    }
    if (priceRange.startsWith("gt")) {
      const min = Number(priceRange.replace("gt", ""));
      return p.price > min;
    }
    if (priceRange.includes("-")) {
      const [min, max] = priceRange.split("-").map(Number);
      return p.price >= min && p.price <= max;
    }
    return true;
  });
}
