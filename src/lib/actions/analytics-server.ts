import { cache } from "react";
import { subDays } from "date-fns";
import { prisma } from "@/lib/database";
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

export interface AnalyticsParams {
  period?: "7d" | "30d" | "90d" | "1y" | "custom";
  from?: Date;
  to?: Date;
}

export const getInitialAnalyticsData = cache(async (params: AnalyticsParams = {}): Promise<AnalyticsData> => {
  try {
    const period = params.period || "30d";
    let fromDate: Date;
    let toDate = params.to || new Date();

    // Calculate date range
    if (params.from && params.to) {
      fromDate = params.from;
      toDate = params.to;
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

    return analyticsData;
  } catch (error) {
    console.error("Analytics Server Action Error:", error);
    throw new Error("Failed to fetch analytics data");
  } finally {
    await prisma.$disconnect();
  }
});
