import { format } from "date-fns";

export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function calculateRetentionRate(returning: number, total: number): number {
  if (total === 0) return 0;
  return (returning / total) * 100;
}

export function calculatePerformanceMetrics(currentRevenue: number, currentOrders: number, newCustomers: number, completionRate: number) {
  return [
    {
      metric: "Revenue Target",
      value: Math.round(currentRevenue),
      target: 100000,
      performance: Math.min((currentRevenue / 100000) * 100, 100),
    },
    {
      metric: "Order Target",
      value: currentOrders,
      target: 500,
      performance: Math.min((currentOrders / 500) * 100, 100),
    },
    {
      metric: "Customer Acquisition",
      value: newCustomers,
      target: 200,
      performance: Math.min((newCustomers / 200) * 100, 100),
    },
    {
      metric: "Completion Rate",
      value: Math.round(completionRate),
      target: 95,
      performance: Math.min((completionRate / 95) * 100, 100),
    },
  ];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function processCategoryData(categoryData: any[], totalCategoryRevenue: number) {
  return categoryData
    .map((category, index) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const categoryRevenue = category.products.reduce((sum: number, product: any) => {
        return (
          sum +
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          product.orderItems.reduce((itemSum: number, item: any) => itemSum + item.productPrice * item.quantity, 0)
        );
      }, 0);

      const percentage = totalCategoryRevenue > 0 ? (categoryRevenue / totalCategoryRevenue) * 100 : 0;

      return {
        name: category.name,
        value: Math.round(categoryRevenue),
        percentage: Math.round(percentage * 10) / 10,
        color: getRandomColor(index),
      };
    })
    .filter((cat) => cat.value > 0)
    .sort((a, b) => b.value - a.value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function calculateTotalCategoryRevenue(categoryData: any[]): number {
  return categoryData.reduce((sum, category) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categoryRevenue = category.products.reduce((catSum: number, product: any) => {
      return (
        catSum +
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        product.orderItems.reduce((itemSum: number, item: any) => itemSum + item.productPrice * item.quantity, 0)
      );
    }, 0);
    return sum + categoryRevenue;
  }, 0);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function calculateOrderMetrics(orders: any[], days: number) {
  const completedOrders = orders.filter((order) => order.status === "DELIVERED").length;
  const cancelledOrders = orders.filter((order) => order.status === "CANCELLED").length;
  const totalOrdersInPeriod = orders.length;

  const completionRate = totalOrdersInPeriod > 0 ? (completedOrders / totalOrdersInPeriod) * 100 : 0;
  const cancelationRate = totalOrdersInPeriod > 0 ? (cancelledOrders / totalOrdersInPeriod) * 100 : 0;
  const ordersPerDay = days > 0 ? totalOrdersInPeriod / days : 0;

  return { completionRate, cancelationRate, ordersPerDay };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatSalesTrend(salesTrend: any[]) {
  return salesTrend.map((day) => ({
    date: format(day.date, "MMM dd"),
    revenue: day.revenue,
    orders: day.orders,
    customers: day.customers,
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createTimeSeriesData(salesTrend: any[]) {
  return salesTrend.map((day) => ({
    date: day.date,
    orders: day.orders,
    revenue: day.revenue,
    newCustomers: Math.floor(day.customers * 0.7),
    returningCustomers: Math.floor(day.customers * 0.3),
  }));
}

export function getRandomColor(index: number) {
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0", "#ffb347", "#87ceeb"];
  return colors[index % colors.length];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ensureFallbackData(salesTrend: any[], topProducts: any[], topCategories: any[]) {
  const fallbackSalesTrend = salesTrend.length === 0 ? [{ date: format(new Date(), "MMM dd"), revenue: 0, orders: 0, customers: 0 }] : salesTrend;

  const fallbackTopProducts =
    topProducts.length === 0
      ? [
          {
            id: "placeholder",
            name: "No products data",
            sales: 0,
            revenue: 0,
            growth: 0,
          },
        ]
      : topProducts;

  const fallbackTopCategories =
    topCategories.length === 0
      ? [
          {
            name: "No categories",
            value: 0,
            percentage: 0,
            color: "#8884d8",
          },
        ]
      : topCategories;

  return { fallbackSalesTrend, fallbackTopProducts, fallbackTopCategories };
}
