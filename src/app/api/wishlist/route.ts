import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth-utils";
import { isAdminRequest } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await isAdminRequest(request);
    if (isAdmin) {
      return NextResponse.json(
        { success: false, message: "Wishlist feature is not available for admin users" },
        { status: 403 }
      );
    }

    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                  images: true,
                },
              },
            },
          },
        },
      });
    }

    const products = wishlist.items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      description: item.product.description,
      price: item.product.price,
      imageUrl: item.product.imageUrl,
      images: item.product.images,
      stock: item.product.stock,
      status: item.product.status,
      sku: item.product.sku,
      brand: item.product.brand,
      slug: item.product.slug,
      discountPrice: item.product.discountPrice,
      promoExpired: item.product.promoExpired,
      category: item.product.category?.name || "Uncategorized",
      createdAt: item.product.createdAt,
      updatedAt: item.product.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isAdminRequest(request);
    if (isAdmin) {
      return NextResponse.json(
        { success: false, message: "Wishlist feature is not available for admin users" },
        { status: 403 }
      );
    }

    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
      });
    }

    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: parseInt(productId),
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { success: false, message: "Product is already in your wishlist" },
        { status: 400 }
      );
    }

    await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId: parseInt(productId),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product added to wishlist",
    });
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add product to wishlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await isAdminRequest(request);
    if (isAdmin) {
      return NextResponse.json(
        { success: false, message: "Wishlist feature is not available for admin users" },
        { status: 403 }
      );
    }

    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      return NextResponse.json(
        { success: false, message: "Wishlist not found" },
        { status: 404 }
      );
    }

    const deletedItem = await prisma.wishlistItem.deleteMany({
      where: {
        wishlistId: wishlist.id,
        productId: parseInt(productId),
      },
    });

    if (deletedItem.count === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found in wishlist" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.error("Wishlist DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove product from wishlist" },
      { status: 500 }
    );
  }
}
