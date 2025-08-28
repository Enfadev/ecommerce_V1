import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth-utils";
import { isAdminRequest } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    // Block admin access
    if (await isAdminRequest(request)) {
      return NextResponse.json({ error: "Admin access to cart is not allowed" }, { status: 403 });
    }

    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            }
          }
        }
      }
    });

    if (!cart) {
      const newCart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: true
                }
              }
            }
          }
        }
      });
      return NextResponse.json(newCart);
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Block admin access
    if (await isAdminRequest(request)) {
      return NextResponse.json({ error: "Admin access to cart is not allowed" }, { status: 403 });
    }

    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId
        }
      }
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            include: {
              images: true
            }
          }
        }
      });

      return NextResponse.json({ 
        message: "Item quantity updated", 
        item: updatedItem 
      });
    } else {
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity
        },
        include: {
          product: {
            include: {
              images: true
            }
          }
        }
      });

      return NextResponse.json({ 
        message: "Item added to cart", 
        item: newItem 
      });
    }

  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Block admin access
    if (await isAdminRequest(request)) {
      return NextResponse.json({ error: "Admin access to cart is not allowed" }, { status: 403 });
    }

    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      return NextResponse.json({ message: "Cart is already empty" });
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return NextResponse.json({ message: "Cart cleared successfully" });

  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
