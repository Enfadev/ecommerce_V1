"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Package, 
  ShoppingCart, 
  Star,
  Loader2
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  imageUrl?: string;
  stock: number;
  brand?: string;
  sku?: string;
  category?: {
    id: number;
    name: string;
  };
}

interface ProductSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export function ProductSearchDialog({ isOpen, onClose, onSelectProduct }: ProductSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchProducts(searchQuery, 1);
    } else {
      setProducts([]);
      setHasMore(false);
    }
  }, [searchQuery]);

  const searchProducts = async (query: string, page: number = 1) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/chat/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=10`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (page === 1) {
          setProducts(data.products);
        } else {
          setProducts(prev => [...prev, ...data.products]);
        }
        
        setHasMore(data.hasMore);
        setCurrentPage(data.currentPage);
      }
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !isLoading) {
      searchProducts(searchQuery, currentPage + 1);
    }
  };

  const handleSelectProduct = (product: Product) => {
    onSelectProduct(product);
    onClose();
    setSearchQuery("");
    setProducts([]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getDiscountPercentage = (originalPrice: number, discountPrice: number) => {
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Search Products
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products by name, brand, or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Loading */}
          {isLoading && currentPage === 1 && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Searching products...</span>
            </div>
          )}

          {/* Products List */}
          {products.length > 0 && (
            <div className="max-h-96 overflow-y-auto space-y-3">
              {products.map((product) => (
                <Card 
                  key={product.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSelectProduct(product)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {/* Product Image */}
                      <Avatar className="h-16 w-16 rounded-md">
                        <AvatarImage 
                          src={product.imageUrl || "/placeholder-product.svg"} 
                          alt={product.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-md">
                          <Package className="h-8 w-8 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {product.name}
                        </h3>
                        
                        {product.brand && (
                          <p className="text-sm text-gray-600 mb-1">
                            by {product.brand}
                          </p>
                        )}

                        {product.description && (
                          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                            {product.description}
                          </p>
                        )}

                        {/* Price */}
                        <div className="flex items-center space-x-2 mb-2">
                          {product.discountPrice ? (
                            <>
                              <span className="text-lg font-bold text-red-600">
                                {formatPrice(product.discountPrice)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.price)}
                              </span>
                              <Badge variant="secondary" className="bg-red-100 text-red-800">
                                -{getDiscountPercentage(product.price, product.discountPrice)}%
                              </Badge>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>

                        {/* Stock & Category */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            {product.category && (
                              <Badge variant="outline" className="text-xs">
                                {product.category.name}
                              </Badge>
                            )}
                            
                            <span className={`text-xs ${
                              product.stock > 0 ? "text-green-600" : "text-red-600"
                            }`}>
                              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                            </span>
                          </div>

                          {product.sku && (
                            <span className="text-xs text-gray-500">
                              SKU: {product.sku}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Select Button */}
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProduct(product);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* No Results */}
          {searchQuery.trim() && !isLoading && products.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                Try searching with different keywords
              </p>
            </div>
          )}

          {/* Empty State */}
          {!searchQuery.trim() && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Search for products
              </h3>
              <p className="text-gray-600">
                Start typing to find products to share in your conversation
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
