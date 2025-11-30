import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth-utils";
import { isAdminRequest } from "@/lib/admin-utils";

type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";

export async function GET(request: NextRequest) {
  try {
    if (await isAdminRequest(request)) {
      return NextResponse.json({ error: "Admin access to customer orders is not allowed. Use admin panel instead." }, { status: 403 });
    }

    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") as OrderStatus | null;

    const skip = (page - 1) * limit;

    const where = {
      userId: userId,
      ...(status && { status }),
    };

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                stock: true,
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

    const total = await prisma.order.count({ where });

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (await isAdminRequest(request)) {
      return NextResponse.json({ error: "Admin cannot create customer orders. This is for customer checkout only." }, { status: 403 });
    }

    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    const { customerName, customerEmail, customerPhone, shippingAddress, postalCode, notes, paymentMethod, paymentStatus, items, subtotal, shippingFee, tax, discount, totalAmount } = body;

    const missingFields = [];
    
    if (!customerName || customerName.trim() === '') missingFields.push('customerName');
    if (!customerEmail || customerEmail.trim() === '') missingFields.push('customerEmail');
    if (!customerPhone || customerPhone.trim() === '') missingFields.push('customerPhone');
    if (!shippingAddress || shippingAddress.trim() === '') missingFields.push('shippingAddress');
    if (!paymentMethod || paymentMethod.trim() === '') missingFields.push('paymentMethod');
    if (!items || !Array.isArray(items) || items.length === 0) missingFields.push('items');
    if (subtotal === undefined || subtotal === null || isNaN(subtotal)) missingFields.push('subtotal');
    if (totalAmount === undefined || totalAmount === null || isNaN(totalAmount)) missingFields.push('totalAmount');

    if (missingFields.length > 0) {
      console.error('Missing or invalid required fields:', {
        missingFields,
        receivedData: {
          customerName: customerName ? '✓' : '✗',
          customerEmail: customerEmail ? '✓' : '✗',
          customerPhone: customerPhone ? '✓' : '✗',
          shippingAddress: shippingAddress ? '✓' : '✗',
          paymentMethod: paymentMethod ? '✓' : '✗',
          items: items && Array.isArray(items) && items.length > 0 ? `✓ (${items.length} items)` : '✗',
          subtotal: !isNaN(subtotal) ? `✓ ($${subtotal})` : '✗',
          totalAmount: !isNaN(totalAmount) ? `✓ ($${totalAmount})` : '✗',
        }
      });
      return NextResponse.json({ 
        error: "Missing required fields", 
        missingFields,
        details: "Please ensure all required fields are provided: customerName, customerEmail, customerPhone, shippingAddress, paymentMethod, items, subtotal, totalAmount"
      }, { status: 400 });
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const order = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { id: true, stock: true, name: true, price: true, imageUrl: true },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
        }
      }

      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: userId,
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          postalCode,
          notes,
          paymentMethod: paymentMethod || "Bank Transfer",
          paymentStatus: paymentStatus || "PENDING",
          subtotal,
          shippingFee: shippingFee || 0,
          tax: tax || 0,
          discount: discount || 0,
          totalAmount,
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (product) {
          await tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              productName: product.name,
              productPrice: product.discountPrice || product.price,
              productImage: product.imageUrl,
              quantity: item.quantity,
            },
          });

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      const userCart = await tx.cart.findUnique({
        where: { userId: userId },
      });

      if (userCart) {
        await tx.cartItem.deleteMany({
          where: { cartId: userCart.id },
        });
      }

      return newOrder;
    });

    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      message: "Order created successfully",
      order: completeOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
