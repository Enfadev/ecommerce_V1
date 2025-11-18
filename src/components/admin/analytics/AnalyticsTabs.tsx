"use client";

import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, RefreshCw, Star, Clock, DollarSign, Activity, TrendingUp, TrendingDown, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartSkeleton } from "@/components/admin/common/ChartSkeleton";
import { TopProductsList } from "./TopProductsList";
import type { AnalyticsData } from "@/types/analytics";

// Dynamic imports for heavy custom chart components only
const RevenueTrendChart = dynamic(() => import("./RevenueTrendChart").then((mod) => ({ default: mod.RevenueTrendChart })), { loading: () => <ChartSkeleton />, ssr: false });

const CategoryDistributionChart = dynamic(() => import("./CategoryDistributionChart").then((mod) => ({ default: mod.CategoryDistributionChart })), { loading: () => <ChartSkeleton />, ssr: false });

interface AnalyticsTabsProps {
  data: AnalyticsData;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0", "#ffb347", "#87ceeb"];

export function AnalyticsTabs({ data }: AnalyticsTabsProps) {
  return (
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
          <RevenueTrendChart data={data.salesTrend} />
          <CategoryDistributionChart data={data.topCategories} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          <TopProductsList products={data.topProducts} />
        </div>
      </TabsContent>

      <TabsContent value="sales" className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
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
  );
}
