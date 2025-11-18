/**
 * Product Detail Page - Constants & Utilities
 * Shared constants, styles, and helper functions
 */

export interface ProductDetail {
  id: number;
  name: string;
  price: number;
  image: string;
  imageUrl?: string;
  category?: string;
  description?: string;
  discountPrice?: number | null;
  promoExpired?: Date | string | null;
  gallery?: string[];
  stock?: number;
  sku?: string;
  brand?: string;
}

/**
 * Check if product has active discount
 */
export function hasActiveDiscount(product: ProductDetail): boolean {
  if (!product.discountPrice || product.discountPrice <= 0) return false;
  if (product.discountPrice >= product.price) return false;
  if (!product.promoExpired) return true;
  return new Date(product.promoExpired) > new Date();
}

/**
 * Get effective price (discount or regular)
 */
export function getEffectivePrice(product: ProductDetail): number {
  return hasActiveDiscount(product) ? product.discountPrice! : product.price;
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercentage(product: ProductDetail): number {
  if (!hasActiveDiscount(product)) return 0;
  return Math.round(((product.price - product.discountPrice!) / product.price) * 100);
}

/**
 * Get savings amount
 */
export function getSavingsAmount(product: ProductDetail): number {
  if (!hasActiveDiscount(product)) return 0;
  return product.price - product.discountPrice!;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

/**
 * Format date
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString();
}
