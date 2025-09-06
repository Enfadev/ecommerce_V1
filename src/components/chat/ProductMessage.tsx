"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Package, 
  ShoppingCart, 
  Heart,
  ExternalLink
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

interface ProductMessageProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  onAddToWishlist?: (productId: number) => void;
  onViewProduct?: (productId: number) => void;
  showActions?: boolean;
}

export function ProductMessage({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  onViewProduct,
  showActions = true 
}: ProductMessageProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getDiscountPercentage = (originalPrice: number, discountPrice: number) => {
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product.id);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWishlist?.(product.id);
  };

  const handleViewProduct = () => {
    onViewProduct?.(product.id);
  };

  return (
    <Card className="max-w-xs bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Product Header */}
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12 rounded-md">
              <AvatarImage 
                src={product.imageUrl || "/placeholder-product.svg"} 
                alt={product.name}
                className="object-cover"
              />
              <AvatarFallback className="rounded-md bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
                {product.name}
              </h4>
              
              {product.brand && (
                <p className="text-xs text-gray-600 mt-1">
                  by {product.brand}
                </p>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="space-y-1">
            {product.discountPrice ? (
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-red-600">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}

            <div className="flex items-center space-x-2">
              {product.discountPrice && (
                <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                  -{getDiscountPercentage(product.price, product.discountPrice)}% OFF
                </Badge>
              )}
              
              {product.category && (
                <Badge variant="outline" className="text-xs">
                  {product.category.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between text-xs">
            <span className={`font-medium ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
            
            {product.sku && (
              <span className="text-gray-500">
                SKU: {product.sku}
              </span>
            )}
          </div>

          {/* Description (if available) */}
          {product.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Action Buttons */}
          {showActions && (
            <div className="space-y-2 pt-2 border-t border-blue-200">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Add to Cart
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddToWishlist}
                  className="border-blue-200 hover:bg-blue-50"
                >
                  <Heart className="h-3 w-3" />
                </Button>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="w-full text-blue-600 hover:bg-blue-50"
                onClick={handleViewProduct}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Details
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
