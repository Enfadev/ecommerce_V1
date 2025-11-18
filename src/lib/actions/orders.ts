import { PrismaClient } from "@prisma/client";
import { cache } from "react";
import type { Order, OrderStats, OrderPagination } from "@/types/order";

const prisma = new PrismaClient();

export interface InitialOrdersData {
  orders: Order[];
  stats: OrderStats;
  pagination: OrderPagination;
}

export const getInitialOrdersData = cache(async (): Promise<InitialOrdersData> => {
  const page = 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  const [orders, totalOrders, stats, totalRevenue] = await Promise.all([
    prisma.order.findMany({
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
    }),
    prisma.order.count({ where }),
    prisma.order.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    }),
    prisma.order.aggregate({
      where: {
        paymentStatus: "PAID",
      },
      _sum: {
        totalAmount: true,
      },
    }),
  ]);

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
  })) as Order[];

  const orderStats: OrderStats = {
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

  return {
    orders: formattedOrders,
    stats: orderStats,
    pagination: {
      page,
      limit,
      total: totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
    },
  };
});
