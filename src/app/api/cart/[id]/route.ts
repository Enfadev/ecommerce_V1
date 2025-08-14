import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quantity, selected } = await request.json();
    const itemId = parseInt(params.id);

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId
        }
      },
      include: {
        product: true
      }
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    if (quantity !== undefined) {
      if (quantity < 1) {
        return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });
      }

      if (cartItem.product.stock < quantity) {
        return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
      }
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: {
        ...(quantity !== undefined && { quantity }),
        ...(selected !== undefined && { selected })
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
      message: "Cart item updated", 
      item: updatedItem 
    });

  } catch (error) {
    console.error("Cart item PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itemId = parseInt(params.id);

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId
        }
      }
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    return NextResponse.json({ message: "Item removed from cart" });

  } catch (error) {
    console.error("Cart item DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
