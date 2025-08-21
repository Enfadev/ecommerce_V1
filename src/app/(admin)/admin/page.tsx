"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-context";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, DollarSign, Eye, ArrowUpRight, Loader2, Download, FileText, FileSpreadsheet, FileBarChart } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface DashboardData {
  statsCards: Array<{
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    description: string;
  }>;
  salesData: Array<{
    name: string;
    value: number;
    orders: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    amount: string;
    status: string;
    date: string;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: string;
  }>;
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
    case "delivered":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "processing":
    case "confirmed":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "pending":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "shipped":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case "cancelled":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "completed":
    case "delivered":
      return "Completed";
    case "processing":
      return "Processing";
    case "confirmed":
      return "Confirmed";
    case "pending":
      return "Pending";
    case "shipped":
      return "Shipped";
    case "cancelled":
      return "Cancelled";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function getIconForStat(title: string) {
  switch (title) {
    case "Total Sales":
      return DollarSign;
    case "Total Orders":
      return ShoppingCart;
    case "Total Products":
      return Package;
    case "Total Customers":
      return Users;
    default:
      return Package;
  }
}

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/dashboard");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = (data: Record<string, unknown> | Record<string, unknown>[], filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async (format: 'csv' | 'json', type: 'orders' | 'products' | 'customers' | 'full-report') => {
    try {
      let data: Record<string, unknown> | Record<string, unknown>[];
      let filename: string;

      switch (type) {
        case 'orders':
          const ordersResponse = await fetch('/api/admin/orders?limit=1000');
          const ordersData = await ordersResponse.json();
          data = ordersData.orders?.map((order: Record<string, unknown>) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            customerName: order.customerName || (order.user as Record<string, unknown>)?.name || 'Unknown',
            customerEmail: order.customerEmail || (order.user as Record<string, unknown>)?.email || 'Unknown',
            status: order.status,
            totalAmount: `$${order.totalAmount}`,
            createdAt: new Date(order.createdAt as string).toLocaleDateString(),
            itemsCount: Array.isArray(order.items) ? order.items.length : 0
          })) || [];
          filename = 'orders-report';
          break;
        case 'products':
          const productsResponse = await fetch('/api/admin/products?limit=1000');
          const productsData = await productsResponse.json();
          data = productsData.products?.map((product: Record<string, unknown>) => ({
            id: product.id,
            name: product.name,
            category: product.category,
            price: `$${product.price}`,
            discountPrice: product.discountPrice ? `$${product.discountPrice}` : 'No discount',
            stock: product.stock,
            isActive: product.isActive ? 'Active' : 'Inactive',
            totalSold: product.totalSold || 0,
            totalRevenue: `$${product.totalRevenue || 0}`,
            createdAt: new Date(product.createdAt as string).toLocaleDateString()
          })) || [];
          filename = 'products-report';
          break;
        case 'customers':
          const customersResponse = await fetch('/api/admin/customers?limit=1000');
          const customersData = await customersResponse.json();
          data = customersData.customers?.map((customer: Record<string, unknown>) => ({
            id: customer.id,
            name: customer.name || 'Unknown',
            email: customer.email,
            phone: customer.phone || 'Not provided',
            totalOrders: Array.isArray(customer.orders) ? customer.orders.length : 0,
            totalSpent: customer.totalSpent ? `$${customer.totalSpent}` : '$0',
            lastOrderDate: customer.lastOrderDate ? new Date(customer.lastOrderDate as string).toLocaleDateString() : 'Never',
            createdAt: new Date(customer.createdAt as string).toLocaleDateString()
          })) || [];
          filename = 'customers-report';
          break;
        case 'full-report':
          data = {
            generatedAt: new Date().toISOString(),
            dashboard: dashboardData,
            summary: {
              totalSales: dashboardData?.statsCards.find(s => s.title === 'Total Sales')?.value,
              totalOrders: dashboardData?.statsCards.find(s => s.title === 'Total Orders')?.value,
              totalProducts: dashboardData?.statsCards.find(s => s.title === 'Total Products')?.value,
              totalCustomers: dashboardData?.statsCards.find(s => s.title === 'Total Customers')?.value,
            }
          };
          filename = 'dashboard-full-report';
          break;
        default:
          return;
      }

      if (format === 'csv') {
        if (type === 'full-report') {
          // Convert full report to CSV-friendly format
          const reportData = data as Record<string, unknown>;
          const summary = reportData.summary as Record<string, unknown>;
          const csvData = [
            { metric: 'Total Sales', value: summary?.totalSales || 'N/A' },
            { metric: 'Total Orders', value: summary?.totalOrders || 'N/A' },
            { metric: 'Total Products', value: summary?.totalProducts || 'N/A' },
            { metric: 'Total Customers', value: summary?.totalCustomers || 'N/A' },
          ];
          exportToCSV(csvData, filename);
        } else {
          exportToCSV(Array.isArray(data) ? data : [data], filename);
        }
      } else {
        exportToJSON(data, filename);
      }
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export data');
    }
  };

  if (isLoading || !user) return null;
  if (user.role !== "ADMIN") return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">{error || "Failed to load dashboard data"}</p>
          <Button onClick={fetchDashboardData}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here is your store summary for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Eye className="w-4 h-4" />
            View Reports
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleExport('json', 'full-report')}>
                <FileBarChart className="w-4 h-4 mr-2" />
                Dashboard Report (JSON)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv', 'full-report')}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Dashboard Report (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv', 'orders')}>
                <FileText className="w-4 h-4 mr-2" />
                Orders Report (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv', 'products')}>
                <FileText className="w-4 h-4 mr-2" />
                Products Report (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv', 'customers')}>
                <FileText className="w-4 h-4 mr-2" />
                Customers Report (CSV)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.statsCards.map((stat, index) => {
          const Icon = getIconForStat(stat.title);
          const isPositive = stat.trend === "up";

          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    {isPositive ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                    <span className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>{stat.change}</span>
                    <span className="text-sm text-muted-foreground">{stat.description}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Monthly Sales</h3>
              <p className="text-sm text-muted-foreground">Sales trend for the last 6 months</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowUpRight className="w-4 h-4" />
              Details
            </Button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.salesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }} />
              </LineChart>
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
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowUpRight className="w-4 h-4" />
              Details
            </Button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dashboardData.categoryData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {dashboardData.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <p className="text-sm text-muted-foreground">List of orders received today</p>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {dashboardData.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{order.id}</p>
                    <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{order.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Top Products</h3>
              <p className="text-sm text-muted-foreground">Products with the highest sales</p>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {dashboardData.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{product.revenue}</p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
