"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, DollarSign, Eye, ArrowUpRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const salesData = [
  { name: "Jan", value: 4000, orders: 240 },
  { name: "Feb", value: 3000, orders: 198 },
  { name: "Mar", value: 5000, orders: 350 },
  { name: "Apr", value: 4500, orders: 290 },
  { name: "May", value: 6000, orders: 410 },
  { name: "Jun", value: 5500, orders: 380 },
];

const categoryData = [
  { name: "Electronics", value: 400, color: "#8884d8" },
  { name: "Fashion", value: 300, color: "#82ca9d" },
  { name: "Home & Living", value: 200, color: "#ffc658" },
  { name: "Sports", value: 100, color: "#ff7300" },
];

const statsCards = [
  {
    title: "Total Sales",
    value: "Rp 28,000,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "from last month",
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    description: "new orders",
  },
  {
    title: "Total Products",
    value: "456",
    change: "+2.1%",
    trend: "up",
    icon: Package,
    description: "active products",
  },
  {
    title: "Total Customers",
    value: "2,345",
    change: "-1.2%",
    trend: "down",
    icon: Users,
    description: "active customers",
  },
];

const recentOrders = [
  { id: "ORD-001", customer: "Ahmad Fajar", amount: "Rp 450,000", status: "completed", date: "2 hours ago" },
  { id: "ORD-002", customer: "Siti Nurhaliza", amount: "Rp 280,000", status: "processing", date: "4 hours ago" },
  { id: "ORD-003", customer: "Budi Santoso", amount: "Rp 320,000", status: "pending", date: "6 hours ago" },
  { id: "ORD-004", customer: "Maya Indira", amount: "Rp 150,000", status: "completed", date: "8 hours ago" },
];

const topProducts = [
  { name: "iPhone 14 Pro", sales: 145, revenue: "Rp 150,000,000" },
  { name: "Samsung Galaxy S23", sales: 89, revenue: "Rp 95,000,000" },
  { name: "MacBook Air M2", sales: 67, revenue: "Rp 120,000,000" },
  { name: "iPad Pro", sales: 45, revenue: "Rp 65,000,000" },
];

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "processing":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "pending":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here is your store summary for today.</p>
        </div>
        <Button className="gap-2">
          <Eye className="w-4 h-4" />
          View Reports
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
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
              <LineChart data={salesData}>
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
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((entry, index) => (
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
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{order.id}</p>
                    <Badge className={getStatusColor(order.status)}>{order.status === "completed" ? "Completed" : order.status === "processing" ? "Processing" : "Pending"}</Badge>
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
            {topProducts.map((product, index) => (
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
