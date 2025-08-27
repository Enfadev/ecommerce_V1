import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to validate numeric inputs
function parseNumericId(id: string | null, fieldName: string) {
  if (!id) return null;
  const numericId = parseInt(id);
  if (isNaN(numericId)) {
    throw new Error(`Invalid ${fieldName}: must be a number`);
  }
  return numericId;
}

// Helper function to validate and parse float
function parseFloat_safe(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = parseFloat(String(value));
  if (isNaN(parsed)) return null;
  return parsed;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

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

    const products = await prisma.product.findMany({
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
    });

    const totalCount = await prisma.product.count({ where });

    const formattedProducts = products.map((product) => {
      const totalSold = product.orderItems.reduce((sum, item) => {
        if (item.order.status === "DELIVERED") {
          return sum + item.quantity;
        }
        return sum;
      }, 0);

      const totalRevenue = product.orderItems.reduce((sum, item) => {
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
    });

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, discountPrice, categoryId, stock, imageUrl, images, status = "active", sku, brand, slug, metaTitle, metaDescription, promoExpired } = body;

    if (!name || !description || !price || stock === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const parsedPrice = parseFloat_safe(price);
    const parsedDiscountPrice = parseFloat_safe(discountPrice);
    const parsedCategoryId = categoryId ? parseNumericId(String(categoryId), "categoryId") : null;
    const parsedStock = parseInt(String(stock));

    if (parsedPrice === null || parsedPrice <= 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    if (isNaN(parsedStock) || parsedStock < 0) {
      return NextResponse.json({ error: "Invalid stock value" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parsedPrice,
        discountPrice: parsedDiscountPrice,
        categoryId: parsedCategoryId,
        stock: parsedStock,
        imageUrl: imageUrl || "",
        status,
        sku,
        brand,
        slug,
        metaTitle,
        metaDescription,
        promoExpired: promoExpired ? new Date(promoExpired) : null,
      },
    });

    // Create associated images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((url: string) => ({
          productId: product.id,
          url,
        })),
      });
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, price, discountPrice, categoryId, stock, imageUrl, images, status, sku, brand, slug, metaTitle, metaDescription, promoExpired } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const productId = parseNumericId(String(id), "product ID");
    if (!productId) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) {
      const parsedPrice = parseFloat_safe(price);
      if (parsedPrice !== null && parsedPrice > 0) {
        updateData.price = parsedPrice;
      } else if (price !== null && price !== "") {
        return NextResponse.json({ error: "Invalid price value" }, { status: 400 });
      }
    }
    if (discountPrice !== undefined) {
      updateData.discountPrice = parseFloat_safe(discountPrice);
    }
    if (categoryId !== undefined) {
      updateData.categoryId = categoryId ? parseNumericId(String(categoryId), "categoryId") : null;
    }
    if (stock !== undefined) {
      const parsedStock = parseInt(String(stock));
      if (!isNaN(parsedStock) && parsedStock >= 0) {
        updateData.stock = parsedStock;
      } else {
        return NextResponse.json({ error: "Invalid stock value" }, { status: 400 });
      }
    }
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (status !== undefined) updateData.status = status;
    if (sku !== undefined) updateData.sku = sku;
    if (brand !== undefined) updateData.brand = brand;
    if (slug !== undefined) updateData.slug = slug;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    if (promoExpired !== undefined) {
      updateData.promoExpired = promoExpired ? new Date(promoExpired) : null;
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    // Handle images update if provided
    if (images && Array.isArray(images)) {
      // Delete existing images
      await prisma.productImage.deleteMany({
        where: { productId: productId },
      });

      // Create new images
      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images.map((url: string) => ({
            productId: productId,
            url,
          })),
        });
      }
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const productId = parseNumericId(id, "product ID");
    if (!productId) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const orderCount = await prisma.orderItem.count({
      where: { productId: productId },
    });

    if (orderCount > 0) {
      const product = await prisma.product.update({
        where: { id: productId },
        data: { status: "inactive" },
      });
      return NextResponse.json({
        message: "Product deactivated (has existing orders)",
        product,
      });
    }

    // Delete associated images first
    await prisma.productImage.deleteMany({
      where: { productId: productId },
    });

    // Then delete the product
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
