"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays } from "date-fns";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Calendar as CalendarIcon, BarChart3, Activity, Users, ShoppingCart, DollarSign, Package, Star, Clock, ArrowUpRight, ArrowDownRight, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminExportButton } from "@/components/AdminExportButton";

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    revenueGrowth: number;
    ordersGrowth: number;
    customersGrowth: number;
    avgOrderValue: number;
  };
  salesTrend: Array<{
    date: string;
    revenue: number;
    orders: number;
    customers: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
    growth: number;
  }>;
  topCategories: Array<{
    name: string;
    value: number;
    percentage: number;
    color: string;
  }>;
  customerAnalytics: {
    newCustomers: number;
    returningCustomers: number;
    customerRetentionRate: number;
    avgCustomerLifetime: number;
  };
  orderAnalytics: {
    averageOrderValue: number;
    ordersPerDay: number;
    completionRate: number;
    cancelationRate: number;
  };
  performanceMetrics: Array<{
    metric: string;
    value: number;
    target: number;
    performance: number;
  }>;
  timeSeriesData: Array<{
    date: string;
    orders: number;
    revenue: number;
    newCustomers: number;
    returningCustomers: number;
  }>;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0", "#ffb347", "#87ceeb"];

const PERIOD_OPTIONS = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "1y", label: "Last Year" },
  { value: "custom", label: "Custom Range" },
];

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        period: selectedPeriod,
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
      });

      const response = await fetch(`/api/admin/analytics?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setError("Failed to load analytics data");

      // Set fallback data for demonstration
      setData({
        overview: {
          totalRevenue: 0,
          totalOrders: 0,
          totalCustomers: 0,
          totalProducts: 0,
          revenueGrowth: 0,
          ordersGrowth: 0,
          customersGrowth: 0,
          avgOrderValue: 0,
        },
        salesTrend: [],
        topProducts: [],
        topCategories: [],
        customerAnalytics: {
          newCustomers: 0,
          returningCustomers: 0,
          customerRetentionRate: 0,
          avgCustomerLifetime: 0,
        },
        orderAnalytics: {
          averageOrderValue: 0,
          ordersPerDay: 0,
          completionRate: 0,
          cancelationRate: 0,
        },
        performanceMetrics: [],
        timeSeriesData: [],
      });
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod, dateRange]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);

    if (period !== "custom") {
      const now = new Date();
      let from: Date;

      switch (period) {
        case "7d":
          from = subDays(now, 7);
          break;
        case "30d":
          from = subDays(now, 30);
          break;
        case "90d":
          from = subDays(now, 90);
          break;
        case "1y":
          from = subDays(now, 365);
          break;
        default:
          from = subDays(now, 30);
      }

      setDateRange({ from, to: now });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-lg">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">{error || "Failed to load analytics data"}</p>
          <Button onClick={fetchAnalyticsData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-1">Analyze store performance and business insights</p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedPeriod === "custom" && (
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({ from: range.from, to: range.to });
                      setShowDatePicker(false);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          )}

          <AdminExportButton 
            data={data?.timeSeriesData as unknown as Record<string, unknown>[] || []} 
            filename={`analytics-detailed-${new Date().toISOString().split('T')[0]}`}
            type="analytics"
            className=""
          />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">${data.overview.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center gap-1">
                {data.overview.revenueGrowth >= 0 ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
                <span className={cn("text-sm font-medium", data.overview.revenueGrowth >= 0 ? "text-green-500" : "text-red-500")}>
                  {data.overview.revenueGrowth >= 0 ? "+" : ""}
                  {data.overview.revenueGrowth.toFixed(1)}%
                </span>
                <span className="text-sm text-muted-foreground">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{data.overview.totalOrders.toLocaleString()}</p>
              <div className="flex items-center gap-1">
                {data.overview.ordersGrowth >= 0 ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
                <span className={cn("text-sm font-medium", data.overview.ordersGrowth >= 0 ? "text-green-500" : "text-red-500")}>
                  {data.overview.ordersGrowth >= 0 ? "+" : ""}
                  {data.overview.ordersGrowth.toFixed(1)}%
                </span>
                <span className="text-sm text-muted-foreground">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
              <p className="text-2xl font-bold">{data.overview.totalCustomers.toLocaleString()}</p>
              <div className="flex items-center gap-1">
                {data.overview.customersGrowth >= 0 ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
                <span className={cn("text-sm font-medium", data.overview.customersGrowth >= 0 ? "text-green-500" : "text-red-500")}>
                  {data.overview.customersGrowth >= 0 ? "+" : ""}
                  {data.overview.customersGrowth.toFixed(1)}%
                </span>
                <span className="text-sm text-muted-foreground">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
              <p className="text-2xl font-bold">${data.overview.avgOrderValue.toFixed(2)}</p>
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">per order</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Revenue Trend</h3>
                  <p className="text-sm text-muted-foreground">Revenue over time</p>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Category Distribution */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Category Distribution</h3>
                  <p className="text-sm text-muted-foreground">Sales by category</p>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.topCategories} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percentage }) => `${name} ${percentage}%`}>
                      {data.topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders vs Customers */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Orders vs Customers</h3>
                  <p className="text-sm text-muted-foreground">Relationship over time</p>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="orders" stroke="#8884d8" strokeWidth={2} name="Orders" />
                    <Line type="monotone" dataKey="customers" stroke="#82ca9d" strokeWidth={2} name="Customers" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Top Products */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Top Products</h3>
                  <p className="text-sm text-muted-foreground">Best performing products</p>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {data.topProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium">#</span>
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${product.revenue.toLocaleString()}</p>
                      <div className="flex items-center gap-1">
                        {product.growth >= 0 ? <ArrowUpRight className="w-3 h-3 text-green-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />}
                        <span className={cn("text-xs", product.growth >= 0 ? "text-green-500" : "text-red-500")}>
                          {product.growth >= 0 ? "+" : ""}
                          {product.growth.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Sales Performance Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Sales Performance</h3>
                  <p className="text-sm text-muted-foreground">Detailed sales analysis</p>
                </div>
              </div>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
                    <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Performance */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Product Performance</h3>
                  <p className="text-sm text-muted-foreground">Top selling products</p>
                </div>
              </div>
              <div className="space-y-4">
                {data.topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${product.revenue.toLocaleString()}</p>
                      <Badge variant={product.growth >= 0 ? "default" : "destructive"}>
                        {product.growth >= 0 ? "+" : ""}
                        {product.growth.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Category Analysis */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Category Analysis</h3>
                  <p className="text-sm text-muted-foreground">Performance by category</p>
                </div>
              </div>
              <div className="space-y-4">
                {data.topCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-muted-foreground">{category.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${category.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">${category.value.toLocaleString()} revenue</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">New Customers</p>
                  <p className="text-2xl font-bold">{data.customerAnalytics.newCustomers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Returning Customers</p>
                  <p className="text-2xl font-bold">{data.customerAnalytics.returningCustomers}</p>
                </div>
                <RefreshCw className="w-8 h-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Retention Rate</p>
                  <p className="text-2xl font-bold">{data.customerAnalytics.customerRetentionRate.toFixed(1)}%</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Avg Lifetime</p>
                  <p className="text-2xl font-bold">{data.customerAnalytics.avgCustomerLifetime}</p>
                  <p className="text-xs text-muted-foreground">days</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Customer Acquisition</h3>
                <p className="text-sm text-muted-foreground">New vs Returning customers</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area type="monotone" dataKey="newCustomers" stackId="1" stroke="#8884d8" fill="#8884d8" name="New Customers" />
                  <Area type="monotone" dataKey="returningCustomers" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Returning Customers" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                  <p className="text-2xl font-bold">${data.orderAnalytics.averageOrderValue.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Orders/Day</p>
                  <p className="text-2xl font-bold">{data.orderAnalytics.ordersPerDay.toFixed(1)}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">{data.orderAnalytics.completionRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Cancellation Rate</p>
                  <p className="text-2xl font-bold">{data.orderAnalytics.cancelationRate.toFixed(1)}%</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Performance Metrics</h3>
                <p className="text-sm text-muted-foreground">Key performance indicators vs targets</p>
              </div>
            </div>
            <div className="space-y-6">
              {data.performanceMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{metric.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {metric.value} / {metric.target}
                      </span>
                      <Badge variant={metric.performance >= 80 ? "default" : metric.performance >= 60 ? "secondary" : "destructive"}>{metric.performance.toFixed(0)}%</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className={cn("h-2 rounded-full transition-all", metric.performance >= 80 ? "bg-green-500" : metric.performance >= 60 ? "bg-yellow-500" : "bg-red-500")} style={{ width: `${Math.min(metric.performance, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
