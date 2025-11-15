import { prisma } from "@/lib/database";
import { subDays, startOfDay, endOfDay } from "date-fns";

export async function getOverviewStats() {
  return Promise.all([prisma.order.count(), prisma.order.aggregate({ _sum: { totalAmount: true } }), prisma.user.count({ where: { role: "USER" } }), prisma.product.count({ where: { status: "active" } })]);
}

export async function getCurrentPeriodStats(fromDate: Date, toDate: Date) {
  return Promise.all([
    prisma.order.aggregate({
      where: { createdAt: { gte: fromDate, lte: toDate } },
      _sum: { totalAmount: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: fromDate, lte: toDate } },
      _sum: { totalAmount: true },
    }),
    prisma.user.count({
      where: {
        role: "USER",
        createdAt: { gte: fromDate, lte: toDate },
      },
    }),
  ]);
}

export async function getPreviousPeriodStats(fromDate: Date, toDate: Date) {
  const periodDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
  const previousFromDate = subDays(fromDate, periodDays);

  return Promise.all([
    prisma.order.aggregate({
      where: {
        createdAt: { gte: previousFromDate, lte: fromDate },
      },
      _sum: { totalAmount: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: previousFromDate, lte: fromDate },
      },
      _sum: { totalAmount: true },
    }),
    prisma.user.count({
      where: {
        role: "USER",
        createdAt: { gte: previousFromDate, lte: fromDate },
      },
    }),
  ]);
}

export async function getSalesTrendData(fromDate: Date, toDate: Date) {
  const days = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
  const salesTrend = [];

  for (let i = 0; i < days; i++) {
    const day = subDays(toDate, days - 1 - i);
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);

    const [dayOrders, dayCustomers] = await Promise.all([
      prisma.order.aggregate({
        where: {
          createdAt: { gte: dayStart, lte: dayEnd },
        },
        _sum: { totalAmount: true },
        _count: true,
      }),
      prisma.user.count({
        where: {
          role: "USER",
          createdAt: { gte: dayStart, lte: dayEnd },
        },
      }),
    ]);

    salesTrend.push({
      date: day,
      revenue: Math.round(dayOrders._sum.totalAmount || 0),
      orders: dayOrders._count,
      customers: dayCustomers,
    });
  }

  return salesTrend;
}

export async function getTopProducts(fromDate: Date, toDate: Date) {
  const topProductsData = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true, productPrice: true },
    _count: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 10,
  });

  const periodDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
  const previousFromDate = subDays(fromDate, periodDays);

  return Promise.all(
    topProductsData.map(async (item) => {
      const [product, previousPeriodSales] = await Promise.all([
        prisma.product.findUnique({
          where: { id: item.productId },
        }),
        prisma.orderItem.aggregate({
          where: {
            productId: item.productId,
            order: {
              createdAt: { gte: previousFromDate, lte: fromDate },
            },
          },
          _sum: { quantity: true },
        }),
      ]);

      const currentSales = item._sum.quantity || 0;
      const prevSales = previousPeriodSales._sum.quantity || 0;
      const growth = prevSales > 0 ? ((currentSales - prevSales) / prevSales) * 100 : 0;

      return {
        id: String(item.productId),
        name: product?.name || "Unknown Product",
        sales: currentSales,
        revenue: Math.round((item._sum.productPrice || 0) * currentSales),
        growth,
      };
    })
  );
}

export async function getCategoryDistribution(fromDate: Date, toDate: Date) {
  const categoryData = await prisma.category.findMany({
    include: {
      products: {
        include: {
          orderItems: {
            where: {
              order: {
                createdAt: { gte: fromDate, lte: toDate },
              },
            },
          },
        },
      },
    },
  });

  return categoryData;
}

export async function getCustomerAnalytics(fromDate: Date, toDate: Date) {
  const [newCustomers, returningCustomersCount, totalCustomersInPeriod] = await Promise.all([
    prisma.user.count({
      where: {
        role: "USER",
        createdAt: { gte: fromDate, lte: toDate },
      },
    }),
    prisma.order.groupBy({
      by: ["userId"],
      where: {
        createdAt: { gte: fromDate, lte: toDate },
        userId: { not: undefined },
      },
      _count: { userId: true },
      having: {
        userId: { _count: { gt: 1 } },
      },
    }),
    prisma.order.findMany({
      where: {
        createdAt: { gte: fromDate, lte: toDate },
        userId: { not: undefined },
      },
      select: { userId: true },
      distinct: ["userId"],
    }),
  ]);

  return { newCustomers, returningCustomersCount, totalCustomersInPeriod };
}

export async function getOrderAnalytics(fromDate: Date, toDate: Date) {
  return prisma.order.findMany({
    where: {
      createdAt: { gte: fromDate, lte: toDate },
    },
    select: {
      totalAmount: true,
      status: true,
      createdAt: true,
    },
  });
}
