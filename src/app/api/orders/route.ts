import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/jwt";

type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") as OrderStatus | null;

    const skip = (page - 1) * limit;

    const where = {
      userId: parseInt(decoded.id),
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
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    console.log('Order creation request body:', JSON.stringify(body, null, 2));
    
    const { customerName, customerEmail, customerPhone, shippingAddress, postalCode, notes, paymentMethod, items, subtotal, shippingFee, tax, discount, totalAmount } = body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || items.length === 0) {
      console.error('Missing required fields:', {
        customerName: !!customerName,
        customerEmail: !!customerEmail,
        customerPhone: !!customerPhone,
        shippingAddress: !!shippingAddress,
        items: !!items && items.length > 0
      });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
          userId: parseInt(decoded.id),
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          postalCode,
          notes,
          paymentMethod: paymentMethod || "Bank Transfer",
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
        where: { userId: parseInt(decoded.id) },
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
