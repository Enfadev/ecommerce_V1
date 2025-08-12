import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/jwt";

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { action, itemIds } = await request.json();

    const cart = await prisma.cart.findUnique({
      where: { userId: Number(payload.id) }
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
    const token = request.cookies.get("auth-token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: Number(payload.id) }
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
