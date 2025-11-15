import { NextRequest, NextResponse } from "next/server";
import { subDays } from "date-fns";
import { prisma } from "@/lib/database";
import { isAdminRequest } from "@/lib/auth";
import type { AnalyticsData } from "@/types/analytics";
import { getOverviewStats, getCurrentPeriodStats, getPreviousPeriodStats, getSalesTrendData, getTopProducts, getCategoryDistribution, getCustomerAnalytics, getOrderAnalytics } from "@/lib/analytics/queries";
import {
  calculateGrowth,
  calculateRetentionRate,
  calculatePerformanceMetrics,
  processCategoryData,
  calculateTotalCategoryRevenue,
  calculateOrderMetrics,
  formatSalesTrend,
  createTimeSeriesData,
  ensureFallbackData,
} from "@/lib/analytics/calculations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await isAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    let fromDate: Date;
    let toDate = new Date();

    // Calculate date range
    if (fromParam && toParam) {
      fromDate = new Date(fromParam);
      toDate = new Date(toParam);
    } else {
      switch (period) {
        case "7d":
          fromDate = subDays(toDate, 7);
          break;
        case "30d":
          fromDate = subDays(toDate, 30);
          break;
        case "90d":
          fromDate = subDays(toDate, 90);
          break;
        case "1y":
          fromDate = subDays(toDate, 365);
          break;
        default:
          fromDate = subDays(toDate, 30);
      }
    }

    // Fetch all data in parallel
    const [
      [totalOrders, totalSales, totalCustomers, totalProducts],
      [currentPeriodOrders, currentPeriodSales, currentPeriodCustomers],
      [previousPeriodOrders, previousPeriodSales, previousPeriodCustomers],
      salesTrendData,
      topProductsData,
      categoryData,
      customerAnalyticsData,
      ordersData,
    ] = await Promise.all([
      getOverviewStats(),
      getCurrentPeriodStats(fromDate, toDate),
      getPreviousPeriodStats(fromDate, toDate),
      getSalesTrendData(fromDate, toDate),
      getTopProducts(fromDate, toDate),
      getCategoryDistribution(fromDate, toDate),
      getCustomerAnalytics(fromDate, toDate),
      getOrderAnalytics(fromDate, toDate),
    ]);

    // Calculate growth metrics
    const revenueGrowth = calculateGrowth(currentPeriodSales._sum.totalAmount || 0, previousPeriodSales._sum.totalAmount || 0);
    const ordersGrowth = calculateGrowth(currentPeriodOrders._count, previousPeriodOrders._count);
    const customersGrowth = calculateGrowth(currentPeriodCustomers, previousPeriodCustomers);

    const avgOrderValue = currentPeriodOrders._count > 0 ? (currentPeriodSales._sum.totalAmount || 0) / currentPeriodOrders._count : 0;

    // Process category data
    const totalCategoryRevenue = calculateTotalCategoryRevenue(categoryData);
    const topCategories = processCategoryData(categoryData, totalCategoryRevenue);

    // Calculate customer retention
    const { newCustomers, returningCustomersCount, totalCustomersInPeriod } = customerAnalyticsData;
    const customerRetentionRate = calculateRetentionRate(returningCustomersCount.length, totalCustomersInPeriod.length);

    // Calculate order metrics
    const days = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    const { completionRate, cancelationRate, ordersPerDay } = calculateOrderMetrics(ordersData, days);

    // Format sales trend
    const formattedSalesTrend = formatSalesTrend(salesTrendData);
    const timeSeriesData = createTimeSeriesData(salesTrendData);

    // Generate performance metrics
    const performanceMetrics = calculatePerformanceMetrics(currentPeriodSales._sum.totalAmount || 0, currentPeriodOrders._count, newCustomers, completionRate);

    // Ensure fallback data
    const { fallbackSalesTrend, fallbackTopProducts, fallbackTopCategories } = ensureFallbackData(formattedSalesTrend, topProductsData, topCategories);

    const analyticsData: AnalyticsData = {
      overview: {
        totalRevenue: Math.round(totalSales._sum.totalAmount || 0),
        totalOrders: totalOrders,
        totalCustomers: totalCustomers,
        totalProducts: totalProducts,
        revenueGrowth,
        ordersGrowth,
        customersGrowth,
        avgOrderValue,
      },
      salesTrend: fallbackSalesTrend,
      topProducts: fallbackTopProducts,
      topCategories: fallbackTopCategories,
      customerAnalytics: {
        newCustomers,
        returningCustomers: returningCustomersCount.length,
        customerRetentionRate,
        avgCustomerLifetime: 180,
      },
      orderAnalytics: {
        averageOrderValue: avgOrderValue,
        ordersPerDay,
        completionRate,
        cancelationRate,
      },
      performanceMetrics,
      timeSeriesData,
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
