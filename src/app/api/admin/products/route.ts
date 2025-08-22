import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        { category: { contains: search, mode: "insensitive" } }
      ];
    }

    if (category && category !== "all") {
      where.category = category;
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
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    const totalCount = await prisma.product.count({ where });

    const formattedProducts = products.map(product => {
      const totalSold = product.orderItems.reduce((sum, item) => {
        if (item.order.status === 'COMPLETED' || item.order.status === 'DELIVERED') {
          return sum + item.quantity;
        }
        return sum;
      }, 0);

      const totalRevenue = product.orderItems.reduce((sum, item) => {
        if (item.order.status === 'COMPLETED' || item.order.status === 'DELIVERED') {
          return sum + (item.quantity * product.price);
        }
        return sum;
      }, 0);

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice,
        category: product.category,
        stock: product.stock,
        isActive: product.isActive,
        imageUrl: product.imageUrl,
        imageGallery: product.imageGallery,
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      stock,
      imageUrl,
      imageGallery,
      isActive = true,
    } = body;

    if (!name || !description || !price || !category || stock === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        category,
        stock: parseInt(stock),
        imageUrl: imageUrl || "",
        imageGallery: imageGallery || [],
        isActive,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      description,
      price,
      discountPrice,
      category,
      stock,
      imageUrl,
      imageGallery,
      isActive,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        category,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        imageUrl,
        imageGallery,
        isActive,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const orderCount = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderCount > 0) {
      const product = await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        message: "Product deactivated (has existing orders)",
        product,
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
