import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [{ orderNumber: { contains: search } }, { customerName: { contains: search } }, { customerEmail: { contains: search } }];
    }

    // Get orders with related data
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
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

    // Get total count for pagination
    const totalOrders = await prisma.order.count({ where });

    // Get order statistics
    const stats = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const totalRevenue = await prisma.order.aggregate({
      where: {
        paymentStatus: "PAID",
      },
      _sum: {
        totalAmount: true,
      },
    });

    // Format the response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedOrders = orders.map((order: any) => ({
      id: order.orderNumber,
      customer: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: order.items.map((item: any) => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.productPrice,
        image: item.productImage,
      })),
      total: order.totalAmount,
      status: order.status.toLowerCase(),
      paymentStatus: order.paymentStatus.toLowerCase(),
      createdAt: order.createdAt.toISOString().split("T")[0],
      updatedAt: order.updatedAt.toISOString().split("T")[0],
      shippingAddress: order.shippingAddress,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery?.toISOString().split("T")[0],
      paymentMethod: order.paymentMethod,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      tax: order.tax,
      discount: order.discount,
      notes: order.notes,
    }));

    // Format statistics
    const orderStats = {
      total: totalOrders,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pending: stats.find((s: any) => s.status === "PENDING")?._count.status || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      processing: stats.find((s: any) => s.status === "PROCESSING")?._count.status || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      shipped: stats.find((s: any) => s.status === "SHIPPED")?._count.status || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delivered: stats.find((s: any) => s.status === "DELIVERED")?._count.status || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cancelled: stats.find((s: any) => s.status === "CANCELLED")?._count.status || 0,
      revenue: totalRevenue._sum.totalAmount || 0,
    };

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total: totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
      },
      stats: orderStats,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { orderNumber, status, paymentStatus, trackingNumber } = await request.json();

    if (!orderNumber) {
      return NextResponse.json({ error: "Order number is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};

    if (status) {
      updateData.status = status.toUpperCase();
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus.toUpperCase();
    }

    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber;
    }

    const updatedOrder = await prisma.order.update({
      where: { orderNumber },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
