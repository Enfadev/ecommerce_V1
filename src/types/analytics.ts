export interface AnalyticsOverview {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  avgOrderValue: number;
}

export interface SalesTrendData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  growth: number;
}

export interface TopCategory {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface CustomerAnalytics {
  newCustomers: number;
  returningCustomers: number;
  customerRetentionRate: number;
  avgCustomerLifetime: number;
}

export interface OrderAnalytics {
  averageOrderValue: number;
  ordersPerDay: number;
  completionRate: number;
  cancelationRate: number;
}

export interface PerformanceMetric {
  metric: string;
  value: number;
  target: number;
  performance: number;
}

export interface TimeSeriesData {
  date: string;
  orders: number;
  revenue: number;
  newCustomers: number;
  returningCustomers: number;
}

export interface AnalyticsData {
  overview: AnalyticsOverview;
  salesTrend: SalesTrendData[];
  topProducts: TopProduct[];
  topCategories: TopCategory[];
  customerAnalytics: CustomerAnalytics;
  orderAnalytics: OrderAnalytics;
  performanceMetrics: PerformanceMetric[];
  timeSeriesData: TimeSeriesData[];
}

export type DatePeriod = "7d" | "30d" | "90d" | "1y" | "custom";

export interface AnalyticsFilters {
  period: DatePeriod;
  from: Date;
  to: Date;
}
