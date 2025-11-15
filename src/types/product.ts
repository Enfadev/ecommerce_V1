export interface ProductFormData {
  id?: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock?: number;
  status?: "active" | "inactive" | "draft";
  sku?: string;
  brand?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  structuredData?: string;
  discountPrice?: number | null;
  promoExpired?: string;
  imageFile?: File;
  imageFiles?: File[];
  gallery?: string[];
  weight?: number;
  dimensions?: string;
  tags?: string[];
  featured?: boolean;
  allowBackorder?: boolean;
  trackQuantity?: boolean;
  requiresShipping?: boolean;
  taxable?: boolean;
  compareAtPrice?: number | null;
  costPerItem?: number | null;
  barcode?: string;
  warranty?: string;
  minimumOrderQuantity?: number;
  maximumOrderQuantity?: number;
}

export const PRODUCT_TABLE_COLUMNS = [
  { key: "imageUrl", label: "Image" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "stock", label: "Stock" },
  { key: "status", label: "Status" },
  { key: "sku", label: "SKU" },
  { key: "brand", label: "Brand" },
  { key: "slug", label: "Slug" },
  { key: "metaTitle", label: "Meta Title" },
  { key: "metaDescription", label: "Meta Description" },
  { key: "discountPrice", label: "Discount Price" },
  { key: "promoExpired", label: "Promo Expired" },
  { key: "gallery", label: "Gallery" },
  { key: "createdAt", label: "Created At" },
  { key: "updatedAt", label: "Updated At" },
];

export const DEFAULT_VISIBLE_COLUMNS = ["imageUrl", "name", "category", "price", "discountPrice", "stock", "status", "sku", "brand"];
