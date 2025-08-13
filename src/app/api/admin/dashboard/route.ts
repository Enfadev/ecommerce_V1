import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get current date for calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get total sales and orders
    const totalOrders = await prisma.order.count();
    const totalSales = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    });

    // Get monthly sales for current month
    const currentMonthSales = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
      _count: true,
    });

    // Get last month sales for comparison
    const lastMonthSales = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
      _count: true,
    });

    // Get total products
    const totalProducts = await prisma.product.count({
      where: {
        status: 'active',
      },
    });

    // Get total customers
    const totalCustomers = await prisma.user.count({
      where: {
        role: 'USER',
      },
    });

    // Get customers for current month
    const currentMonthCustomers = await prisma.user.count({
      where: {
        role: 'USER',
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    // Get customers for last month
    const lastMonthCustomers = await prisma.user.count({
      where: {
        role: 'USER',
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    // Calculate growth percentages
    const salesGrowth = lastMonthSales._sum.totalAmount && lastMonthSales._sum.totalAmount > 0
      ? ((currentMonthSales._sum.totalAmount || 0) - (lastMonthSales._sum.totalAmount || 0)) / (lastMonthSales._sum.totalAmount || 0) * 100
      : 0;

    const ordersGrowth = lastMonthSales._count && lastMonthSales._count > 0 
      ? ((currentMonthSales._count || 0) - (lastMonthSales._count || 0)) / (lastMonthSales._count || 0) * 100
      : 0;

    const customersGrowth = lastMonthCustomers > 0
      ? ((currentMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100
      : 0;

    // Get sales data for the last 6 months
    const salesData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthData = await prisma.order.aggregate({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: {
          totalAmount: true,
        },
        _count: true,
      });

      const monthName = monthStart.toLocaleDateString('en-US', { month: 'short' });
      salesData.push({
        name: monthName,
        value: Math.round(monthData._sum.totalAmount || 0),
        orders: monthData._count,
      });
    }

    // Get category distribution
    const categoryData = await prisma.category.findMany({
      include: {
        products: {
          include: {
            orderItems: true,
          },
        },
      },
    });

    const categoryDistribution = categoryData.map(category => {
      const totalSales = category.products.reduce((sum, product) => {
        return sum + product.orderItems.reduce((itemSum, item) => itemSum + (item.productPrice * item.quantity), 0);
      }, 0);

      return {
        name: category.name,
        value: Math.round(totalSales),
        color: getRandomColor(),
      };
    }).filter(cat => cat.value > 0);

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 4,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    });

    // Get top products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      _count: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 4,
    });

    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        const revenue = await prisma.orderItem.aggregate({
          where: { productId: item.productId },
          _sum: {
            productPrice: true,
          },
        });

        return {
          name: product?.name || 'Unknown Product',
          sales: item._sum.quantity || 0,
          revenue: `$${Math.round((revenue._sum.productPrice || 0) * (item._sum.quantity || 0)).toLocaleString()}`,
        };
      })
    );

    const formatRecentOrders = recentOrders.map(order => ({
      id: order.orderNumber,
      customer: order.customerName,
      amount: `$${Math.round(order.totalAmount).toLocaleString()}`,
      status: order.status.toLowerCase(),
      date: getRelativeTime(order.createdAt),
    }));

    // Stats cards data
    const statsCards = [
      {
        title: "Total Sales",
        value: `$${Math.round(totalSales._sum.totalAmount || 0).toLocaleString()}`,
        change: `${salesGrowth >= 0 ? '+' : ''}${salesGrowth.toFixed(1)}%`,
        trend: salesGrowth >= 0 ? "up" : "down",
        description: "from last month",
      },
      {
        title: "Total Orders",
        value: totalOrders.toLocaleString(),
        change: `${ordersGrowth >= 0 ? '+' : ''}${ordersGrowth.toFixed(1)}%`,
        trend: ordersGrowth >= 0 ? "up" : "down",
        description: "new orders",
      },
      {
        title: "Total Products",
        value: totalProducts.toLocaleString(),
        change: "+0%",
        trend: "up",
        description: "active products",
      },
      {
        title: "Total Customers",
        value: totalCustomers.toLocaleString(),
        change: `${customersGrowth >= 0 ? '+' : ''}${customersGrowth.toFixed(1)}%`,
        trend: customersGrowth >= 0 ? "up" : "down",
        description: "new customers",
      },
    ];

    return NextResponse.json({
      statsCards,
      salesData,
      categoryData: categoryDistribution,
      recentOrders: formatRecentOrders,
      topProducts: topProductsWithDetails,
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

// Helper functions
function getRandomColor() {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getRelativeTime(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return 'Just now';
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}
