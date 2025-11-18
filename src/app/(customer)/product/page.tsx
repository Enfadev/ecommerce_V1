import { Suspense } from "react";
import { prisma } from "@/lib/database";
import SearchBar from "./components/SearchBar";
import SortControl from "./components/SortControl";
import ViewModeToggle from "./components/ViewModeToggle";
import ProductFilters from "./components/ProductFilters";
import ProductGrid from "./components/ProductGrid";
import { sortProducts, filterBySearch, filterByCategory, filterByPrice } from "./constants";
import type { Product, SortOption, FilterOptions } from "./constants";

/**
 * Product Listing Page - Server Component
 * Fetches products and filter options server-side for SEO and performance
 * Handles filtering, sorting, and search with Next.js 16 async searchParams
 */

async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "active",
      },
      include: {
        category: true,
        images: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl || "/placeholder-product.svg",
      category: product.category?.name || "General",
      stock: product.stock,
      slug: product.slug || undefined,
      discountPrice: product.discountPrice || undefined,
      promoExpired: product.promoExpired || undefined,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getFilterOptions(): Promise<FilterOptions> {
  try {
    // Get unique categories
    const categories = await prisma.category.findMany({
      select: { name: true },
      orderBy: { name: "asc" },
    });

    // Get price ranges based on actual product prices
    const priceStats = await prisma.product.aggregate({
      _min: { price: true },
      _max: { price: true },
    });

    const maxPrice = priceStats._max.price || 1000;

    const priceRanges = [
      { label: "All", value: "all", min: null, max: null },
      { label: `Under $${Math.floor(maxPrice * 0.25)}`, value: `lt${Math.floor(maxPrice * 0.25)}`, min: null, max: Math.floor(maxPrice * 0.25) },
      { label: `$${Math.floor(maxPrice * 0.25)} - $${Math.floor(maxPrice * 0.5)}`, value: `${Math.floor(maxPrice * 0.25)}-${Math.floor(maxPrice * 0.5)}`, min: Math.floor(maxPrice * 0.25), max: Math.floor(maxPrice * 0.5) },
      { label: `$${Math.floor(maxPrice * 0.5)} - $${Math.floor(maxPrice * 0.75)}`, value: `${Math.floor(maxPrice * 0.5)}-${Math.floor(maxPrice * 0.75)}`, min: Math.floor(maxPrice * 0.5), max: Math.floor(maxPrice * 0.75) },
      { label: `Over $${Math.floor(maxPrice * 0.75)}`, value: `gt${Math.floor(maxPrice * 0.75)}`, min: Math.floor(maxPrice * 0.75), max: null },
    ];

    return {
      categories: ["All", ...categories.map((c) => c.name)],
      priceRanges,
    };
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return {
      categories: ["All"],
      priceRanges: [{ label: "All", value: "all", min: null, max: null }],
    };
  }
}

export default async function ProductPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // Next.js 16: searchParams must be awaited
  const params = await searchParams;

  const search = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "All";
  const price = typeof params.price === "string" ? params.price : "all";
  const sort = (typeof params.sort === "string" ? params.sort : "newest") as SortOption;

  // Fetch data server-side
  const [allProducts, filterOptions] = await Promise.all([getProducts(), getFilterOptions()]);

  // Apply filters and sorting
  let filteredProducts = allProducts;
  filteredProducts = filterBySearch(filteredProducts, search);
  filteredProducts = filterByCategory(filteredProducts, category);
  filteredProducts = filterByPrice(filteredProducts, price);
  filteredProducts = sortProducts(filteredProducts, sort);

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center py-12 mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">Complete Product Collection</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Discover the best selected products with premium quality and competitive prices</p>
      </div>

      {/* Search & Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Suspense fallback={<div className="h-14 bg-muted animate-pulse rounded-2xl"></div>}>
            <SearchBar initialSearch={search} />
          </Suspense>
        </div>

        <div className="flex gap-3">
          <Suspense fallback={<div className="h-14 w-32 bg-muted animate-pulse rounded-2xl"></div>}>
            <SortControl currentSort={sort} />
          </Suspense>
          <Suspense fallback={<div className="h-14 w-28 bg-muted animate-pulse rounded-2xl"></div>}>
            <ViewModeToggle />
          </Suspense>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-3xl"></div>}>
          <ProductFilters filterOptions={filterOptions} selectedCategory={category} selectedPrice={price} />
        </Suspense>
      </div>

      {/* Product Grid */}
      <Suspense
        fallback={
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center animate-pulse"></div>
            <h2 className="text-xl font-semibold mb-2">Loading products...</h2>
          </div>
        }
      >
        <ProductGrid products={filteredProducts} searchTerm={search} />
      </Suspense>
    </div>
  );
}
