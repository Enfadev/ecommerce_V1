/**
 * Product validation utilities
 */

export interface CreateProductInput {
  name: string;
  description: string;
  price: number | string;
  discountPrice?: number | string | null;
  categoryId?: number | string | null;
  stock: number | string;
  imageUrl?: string;
  images?: string[];
  status?: string;
  sku?: string;
  brand?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  promoExpired?: string | Date | null;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: number | string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: Record<string, unknown>;
}

/**
 * Parse numeric ID safely
 */
export function parseNumericId(id: string | number | null, fieldName: string): number | null {
  if (!id) return null;
  const numericId = typeof id === "number" ? id : parseInt(id);
  if (isNaN(numericId)) {
    throw new Error(`Invalid ${fieldName}: must be a number`);
  }
  return numericId;
}

/**
 * Parse float value safely
 */
export function parseFloatSafe(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = parseFloat(String(value));
  if (isNaN(parsed)) return null;
  return parsed;
}

/**
 * Validate create product input
 */
export function validateCreateProduct(input: CreateProductInput): ValidationResult {
  const { name, description, price, discountPrice, categoryId, stock } = input;

  // Required fields
  if (!name || !description || !price || stock === undefined) {
    return {
      isValid: false,
      error: "Missing required fields: name, description, price, and stock are required",
    };
  }

  // Validate price
  const parsedPrice = parseFloatSafe(price);
  if (parsedPrice === null || parsedPrice <= 0) {
    return {
      isValid: false,
      error: "Invalid price: must be a positive number",
    };
  }

  // Validate discount price
  const parsedDiscountPrice = parseFloatSafe(discountPrice);
  if (parsedDiscountPrice !== null && parsedDiscountPrice < 0) {
    return {
      isValid: false,
      error: "Invalid discount price: must be a positive number or null",
    };
  }

  // Validate stock
  const parsedStock = parseInt(String(stock));
  if (isNaN(parsedStock) || parsedStock < 0) {
    return {
      isValid: false,
      error: "Invalid stock: must be a non-negative integer",
    };
  }

  // Validate category ID
  let parsedCategoryId: number | null = null;
  if (categoryId) {
    try {
      parsedCategoryId = parseNumericId(categoryId, "categoryId");
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : "Invalid category ID",
      };
    }
  }

  return {
    isValid: true,
    data: {
      name,
      description,
      price: parsedPrice,
      discountPrice: parsedDiscountPrice,
      categoryId: parsedCategoryId,
      stock: parsedStock,
      imageUrl: input.imageUrl || "",
      status: input.status || "active",
      sku: input.sku,
      brand: input.brand,
      slug: input.slug,
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
      promoExpired: input.promoExpired ? new Date(input.promoExpired) : null,
    },
  };
}

/**
 * Validate update product input
 */
export function validateUpdateProduct(input: UpdateProductInput): ValidationResult {
  const { id, price, discountPrice, categoryId, stock } = input;

  // Validate product ID
  let productId: number | null;
  try {
    productId = parseNumericId(id, "product ID");
    if (!productId) {
      return {
        isValid: false,
        error: "Product ID is required",
      };
    }
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid product ID",
    };
  }

  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  // Validate price if provided
  if (price !== undefined) {
    const parsedPrice = parseFloatSafe(price);
    if (parsedPrice !== null && parsedPrice > 0) {
      updateData.price = parsedPrice;
    } else if (price !== null && price !== "") {
      return {
        isValid: false,
        error: "Invalid price: must be a positive number",
      };
    }
  }

  // Validate discount price if provided
  if (discountPrice !== undefined) {
    updateData.discountPrice = parseFloatSafe(discountPrice);
  }

  // Validate category ID if provided
  if (categoryId !== undefined) {
    try {
      updateData.categoryId = categoryId ? parseNumericId(categoryId, "categoryId") : null;
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : "Invalid category ID",
      };
    }
  }

  // Validate stock if provided
  if (stock !== undefined) {
    const parsedStock = parseInt(String(stock));
    if (!isNaN(parsedStock) && parsedStock >= 0) {
      updateData.stock = parsedStock;
    } else {
      return {
        isValid: false,
        error: "Invalid stock: must be a non-negative integer",
      };
    }
  }

  // Add optional fields
  if (input.name !== undefined) updateData.name = input.name;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.imageUrl !== undefined) updateData.imageUrl = input.imageUrl;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.sku !== undefined) updateData.sku = input.sku;
  if (input.brand !== undefined) updateData.brand = input.brand;
  if (input.slug !== undefined) updateData.slug = input.slug;
  if (input.metaTitle !== undefined) updateData.metaTitle = input.metaTitle;
  if (input.metaDescription !== undefined) updateData.metaDescription = input.metaDescription;
  if (input.promoExpired !== undefined) {
    updateData.promoExpired = input.promoExpired ? new Date(input.promoExpired) : null;
  }

  return {
    isValid: true,
    data: {
      productId,
      updateData,
    },
  };
}

/**
 * Validate delete product input
 */
export function validateDeleteProduct(id: string | null): ValidationResult {
  if (!id) {
    return {
      isValid: false,
      error: "Product ID is required",
    };
  }

  try {
    const productId = parseNumericId(id, "product ID");
    if (!productId) {
      return {
        isValid: false,
        error: "Invalid product ID",
      };
    }

    return {
      isValid: true,
      data: { productId },
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid product ID",
    };
  }
}
