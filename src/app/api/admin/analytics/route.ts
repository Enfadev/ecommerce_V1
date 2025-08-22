import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { subDays, startOfDay, endOfDay, format } from 'date-fns';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');

    let fromDate: Date;
    let toDate = new Date();

    if (fromParam && toParam) {
      fromDate = new Date(fromParam);
      toDate = new Date(toParam);
    } else {
      switch (period) {
        case '7d':
          fromDate = subDays(toDate, 7);
          break;
        case '30d':
          fromDate = subDays(toDate, 30);
          break;
        case '90d':
          fromDate = subDays(toDate, 90);
          break;
        case '1y':
          fromDate = subDays(toDate, 365);
          break;
        default:
          fromDate = subDays(toDate, 30);
      }
    }

    const [
      totalOrders,
      totalSales,
      totalCustomers,
      totalProducts,
      currentPeriodOrders,
      currentPeriodSales,
      currentPeriodCustomers,
      previousPeriodOrders,
      previousPeriodSales,
      previousPeriodCustomers
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { totalAmount: true } }),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.product.count({ where: { status: 'active' } }),
      
      prisma.order.aggregate({
        where: { createdAt: { gte: fromDate, lte: toDate } },
        _sum: { totalAmount: true },
        _count: true
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: fromDate, lte: toDate } },
        _sum: { totalAmount: true }
      }),
      prisma.user.count({
        where: { 
          role: 'USER',
          createdAt: { gte: fromDate, lte: toDate }
        }
      }),
      
      prisma.order.aggregate({
        where: { 
          createdAt: { 
            gte: subDays(fromDate, Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))),
            lte: fromDate
          }
        },
        _sum: { totalAmount: true },
        _count: true
      }),
      prisma.order.aggregate({
        where: { 
          createdAt: { 
            gte: subDays(fromDate, Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))),
            lte: fromDate
          }
        },
        _sum: { totalAmount: true }
      }),
      prisma.user.count({
        where: { 
          role: 'USER',
          createdAt: { 
            gte: subDays(fromDate, Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))),
            lte: fromDate
          }
        }
      })
    ]);

    const revenueGrowth = previousPeriodSales._sum.totalAmount && previousPeriodSales._sum.totalAmount > 0
      ? ((currentPeriodSales._sum.totalAmount || 0) - (previousPeriodSales._sum.totalAmount || 0)) / (previousPeriodSales._sum.totalAmount || 0) * 100
      : 0;

    const ordersGrowth = previousPeriodOrders._count > 0
      ? ((currentPeriodOrders._count - previousPeriodOrders._count) / previousPeriodOrders._count) * 100
      : 0;

    const customersGrowth = previousPeriodCustomers > 0
      ? ((currentPeriodCustomers - previousPeriodCustomers) / previousPeriodCustomers) * 100
      : 0;

    const avgOrderValue = currentPeriodOrders._count > 0 
      ? (currentPeriodSales._sum.totalAmount || 0) / currentPeriodOrders._count
      : 0;

    const salesTrend = [];
    const days = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < days; i++) {
      const day = subDays(toDate, days - 1 - i);
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      
      const [dayOrders, dayCustomers] = await Promise.all([
        prisma.order.aggregate({
          where: {
            createdAt: { gte: dayStart, lte: dayEnd }
          },
          _sum: { totalAmount: true },
          _count: true
        }),
        prisma.user.count({
          where: {
            role: 'USER',
            createdAt: { gte: dayStart, lte: dayEnd }
          }
        })
      ]);

      salesTrend.push({
        date: format(day, 'MMM dd'),
        revenue: Math.round(dayOrders._sum.totalAmount || 0),
        orders: dayOrders._count,
        customers: dayCustomers
      });
    }

    const topProductsData = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, productPrice: true },
      _count: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10
    });

    const topProducts = await Promise.all(
      topProductsData.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });

        const previousPeriodSales = await prisma.orderItem.aggregate({
          where: {
            productId: item.productId,
            order: {
              createdAt: {
                gte: subDays(fromDate, Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))),
                lte: fromDate
              }
            }
          },
          _sum: { quantity: true }
        });

        const currentSales = item._sum.quantity || 0;
        const prevSales = previousPeriodSales._sum.quantity || 0;
        const growth = prevSales > 0 ? ((currentSales - prevSales) / prevSales) * 100 : 0;

        return {
          id: item.productId,
          name: product?.name || 'Unknown Product',
          sales: currentSales,
          revenue: Math.round((item._sum.productPrice || 0) * currentSales),
          growth
        };
      })
    );

    const categoryData = await prisma.category.findMany({
      include: {
        products: {
          include: {
            orderItems: {
              where: {
                order: {
                  createdAt: { gte: fromDate, lte: toDate }
                }
              }
            }
          }
        }
      }
    });

    const totalCategoryRevenue = categoryData.reduce((sum, category) => {
      const categoryRevenue = category.products.reduce((catSum, product) => {
        return catSum + product.orderItems.reduce((itemSum, item) => 
          itemSum + (item.productPrice * item.quantity), 0
        );
      }, 0);
      return sum + categoryRevenue;
    }, 0);

    const topCategories = categoryData.map((category, index) => {
      const categoryRevenue = category.products.reduce((sum, product) => {
        return sum + product.orderItems.reduce((itemSum, item) => 
          itemSum + (item.productPrice * item.quantity), 0
        );
      }, 0);

      const percentage = totalCategoryRevenue > 0 ? (categoryRevenue / totalCategoryRevenue) * 100 : 0;

      return {
        name: category.name,
        value: Math.round(categoryRevenue),
        percentage: Math.round(percentage * 10) / 10,
        color: getRandomColor(index)
      };
    }).filter(cat => cat.value > 0).sort((a, b) => b.value - a.value);

    const [newCustomers, returningCustomersCount] = await Promise.all([
      prisma.user.count({
        where: {
          role: 'USER',
          createdAt: { gte: fromDate, lte: toDate }
        }
      }),
      prisma.order.groupBy({
        by: ['userId'],
        where: {
          createdAt: { gte: fromDate, lte: toDate },
          userId: { not: undefined }
        },
        _count: { userId: true },
        having: {
          userId: { _count: { gt: 1 } }
        }
      })
    ]);

    const totalCustomersInPeriod = await prisma.order.findMany({
      where: {
        createdAt: { gte: fromDate, lte: toDate },
        userId: { not: undefined }
      },
      select: { userId: true },
      distinct: ['userId']
    });

    const customerRetentionRate = totalCustomersInPeriod.length > 0 
      ? (returningCustomersCount.length / totalCustomersInPeriod.length) * 100 
      : 0;

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: fromDate, lte: toDate }
      },
      select: {
        totalAmount: true,
        status: true,
        createdAt: true
      }
    });

    const completedOrders = orders.filter(order => order.status === 'DELIVERED').length;
    const cancelledOrders = orders.filter(order => order.status === 'CANCELLED').length;
    const totalOrdersInPeriod = orders.length;

    const completionRate = totalOrdersInPeriod > 0 ? (completedOrders / totalOrdersInPeriod) * 100 : 0;
    const cancelationRate = totalOrdersInPeriod > 0 ? (cancelledOrders / totalOrdersInPeriod) * 100 : 0;
    const ordersPerDay = days > 0 ? totalOrdersInPeriod / days : 0;

    const timeSeriesData = salesTrend.map(day => ({
      date: day.date,
      orders: day.orders,
      revenue: day.revenue,
      newCustomers: Math.floor(day.customers * 0.7),
      returningCustomers: Math.floor(day.customers * 0.3)
    }));

    const performanceMetrics = [
      {
        metric: 'Revenue Target',
        value: Math.round(currentPeriodSales._sum.totalAmount || 0),
        target: 100000,
        performance: Math.min(((currentPeriodSales._sum.totalAmount || 0) / 100000) * 100, 100)
      },
      {
        metric: 'Order Target',
        value: currentPeriodOrders._count,
        target: 500,
        performance: Math.min((currentPeriodOrders._count / 500) * 100, 100)
      },
      {
        metric: 'Customer Acquisition',
        value: newCustomers,
        target: 200,
        performance: Math.min((newCustomers / 200) * 100, 100)
      },
      {
        metric: 'Completion Rate',
        value: Math.round(completionRate),
        target: 95,
        performance: Math.min((completionRate / 95) * 100, 100)
      }
    ];

    const fallbackSalesTrend = salesTrend.length === 0 ? [
      { date: format(new Date(), 'MMM dd'), revenue: 0, orders: 0, customers: 0 }
    ] : salesTrend;

    const fallbackTopProducts = topProducts.length === 0 ? [
      {
        id: 'placeholder',
        name: 'No products data',
        sales: 0,
        revenue: 0,
        growth: 0
      }
    ] : topProducts;

    const fallbackTopCategories = topCategories.length === 0 ? [
      {
        name: 'No categories',
        value: 0,
        percentage: 0,
        color: '#8884d8'
      }
    ] : topCategories;

    const analyticsData = {
      overview: {
        totalRevenue: Math.round(totalSales._sum.totalAmount || 0),
        totalOrders: totalOrders,
        totalCustomers: totalCustomers,
        totalProducts: totalProducts,
        revenueGrowth,
        ordersGrowth,
        customersGrowth,
        avgOrderValue
      },
      salesTrend: fallbackSalesTrend,
      topProducts: fallbackTopProducts,
      topCategories: fallbackTopCategories,
      customerAnalytics: {
        newCustomers,
        returningCustomers: returningCustomersCount.length,
        customerRetentionRate,
        avgCustomerLifetime: 180
      },
      orderAnalytics: {
        averageOrderValue: avgOrderValue,
        ordersPerDay,
        completionRate,
        cancelationRate
      },
      performanceMetrics,
      timeSeriesData
    };

    return NextResponse.json(analyticsData);

  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

function getRandomColor(index: number) {
  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', 
    '#8dd1e1', '#d084d0', '#ffb347', '#87ceeb'
  ];
  return colors[index % colors.length];
}
