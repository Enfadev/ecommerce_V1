import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/database';
import { getUserIdFromRequest } from "@/lib/auth";
import { isAdminRequest } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    if (await isAdminRequest(request)) {
      return NextResponse.json({ error: "Admin access to cart is not allowed" }, { status: 403 });
    }

    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, itemIds } = await request.json();

    const cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    let result;

    switch (action) {
      case "select_all":
        result = await prisma.cartItem.updateMany({
          where: { cartId: cart.id },
          data: { selected: true }
        });
        break;

      case "deselect_all":
        result = await prisma.cartItem.updateMany({
          where: { cartId: cart.id },
          data: { selected: false }
        });
        break;

      case "toggle_selected":
        if (!Array.isArray(itemIds)) {
          return NextResponse.json({ error: "itemIds must be an array" }, { status: 400 });
        }
        
        for (const itemId of itemIds) {
          const currentItem = await prisma.cartItem.findFirst({
            where: { 
              id: itemId, 
              cartId: cart.id 
            }
          });
          
          if (currentItem) {
            await prisma.cartItem.update({
              where: { id: itemId },
              data: { selected: !currentItem.selected }
            });
          }
        }
        result = { count: itemIds.length };
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ 
      message: "Bulk operation completed", 
      affectedCount: result.count 
    });

  } catch (error) {
    console.error("Cart bulk PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const result = await prisma.cartItem.deleteMany({
      where: { 
        cartId: cart.id,
        selected: true
      }
    });

    return NextResponse.json({ 
      message: "Selected items removed from cart", 
      removedCount: result.count 
    });

  } catch (error) {
    console.error("Cart bulk DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
