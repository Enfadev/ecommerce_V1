/**
 * Product query builders and database operations
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string | null;
  category?: string | null;
}

export interface ProductWhereClause {
  OR?: Array<Record<string, unknown>>;
  category?: Record<string, unknown>;
}

/**
 * Build where clause for product queries
 */
export function buildProductWhereClause(params: ProductQueryParams): ProductWhereClause {
  const { search, category } = params;
  const where: ProductWhereClause = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
      { category: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (category && category !== "all") {
    where.category = { name: category };
  }

  return where;
}

/**
 * Get products with pagination and filters
 */
export async function getProducts(params: ProductQueryParams) {
  const { page = 1, limit = 50 } = params;
  const skip = (page - 1) * limit;
  const where = buildProductWhereClause(params);

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        orderItems: {
          select: {
            id: true,
            quantity: true,
            order: {
              select: {
                status: true,
                createdAt: true,
              },
            },
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    totalCount,
    page,
    limit,
  };
}

/**
 * Format product with sales data
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatProductWithSales(product: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalSold = product.orderItems.reduce((sum: number, item: any) => {
    if (item.order.status === "DELIVERED") {
      return sum + item.quantity;
    }
    return sum;
  }, 0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalRevenue = product.orderItems.reduce((sum: number, item: any) => {
    if (item.order.status === "DELIVERED") {
      return sum + item.quantity * product.price;
    }
    return sum;
  }, 0);

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    discountPrice: product.discountPrice,
    category: product.category?.name || null,
    categoryId: product.categoryId,
    stock: product.stock,
    status: product.status,
    imageUrl: product.imageUrl,
    images: product.images,
    sku: product.sku,
    brand: product.brand,
    slug: product.slug,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    promoExpired: product.promoExpired,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    totalSold,
    totalRevenue,
    orderCount: product.orderItems.length,
  };
}

/**
 * Create a new product
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createProduct(data: any) {
  return await prisma.product.create({ data });
}

/**
 * Create product images
 */
export async function createProductImages(productId: number, imageUrls: string[]) {
  if (!imageUrls || imageUrls.length === 0) return;

  await prisma.productImage.createMany({
    data: imageUrls.map((url: string) => ({
      productId,
      url,
    })),
  });
}

/**
 * Update a product
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateProduct(productId: number, data: any) {
  return await prisma.product.update({
    where: { id: productId },
    data,
  });
}

/**
 * Update product images (delete old and create new)
 */
export async function updateProductImages(productId: number, imageUrls: string[]) {
  // Delete existing images
  await prisma.productImage.deleteMany({
    where: { productId },
  });

  // Create new images if provided
  if (imageUrls.length > 0) {
    await createProductImages(productId, imageUrls);
  }
}

/**
 * Check if product has existing orders
 */
export async function hasExistingOrders(productId: number): Promise<boolean> {
  const orderCount = await prisma.orderItem.count({
    where: { productId },
  });
  return orderCount > 0;
}

/**
 * Deactivate product (soft delete)
 */
export async function deactivateProduct(productId: number) {
  return await prisma.product.update({
    where: { id: productId },
    data: { status: "inactive" },
  });
}

/**
 * Delete product and its images
 */
export async function deleteProduct(productId: number) {
  // Delete product images first
  await prisma.productImage.deleteMany({
    where: { productId },
  });

  // Delete product
  await prisma.product.delete({
    where: { id: productId },
  });
}

/**
 * Disconnect Prisma client
 */
export async function disconnectPrisma() {
  await prisma.$disconnect();
}
