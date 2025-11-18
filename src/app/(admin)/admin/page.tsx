"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Loader2, Download, FileText, FileSpreadsheet, FileBarChart } from "lucide-react";
import { DashboardStatsCards } from "@/components/admin/dashboard/DashboardStatsCards";
import { DashboardCharts } from "@/components/admin/dashboard/DashboardCharts";
import { RecentOrdersList } from "@/components/admin/dashboard/RecentOrdersList";
import { TopProductsList } from "@/components/admin/dashboard/TopProductsList";
import { useExportData } from "@/hooks/admin/useExportData";

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

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleExport } = useExportData();

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
              <DropdownMenuItem onClick={() => handleExport("json", "full-report", dashboardData)}>
                <FileBarChart className="w-4 h-4 mr-2" />
                Dashboard Report (JSON)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv", "full-report", dashboardData)}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Dashboard Report (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv", "orders", dashboardData)}>
                <FileText className="w-4 h-4 mr-2" />
                Orders Report (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv", "products", dashboardData)}>
                <FileText className="w-4 h-4 mr-2" />
                Products Report (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv", "customers", dashboardData)}>
                <FileText className="w-4 h-4 mr-2" />
                Customers Report (CSV)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStatsCards stats={dashboardData.statsCards} />

      {/* Charts Row */}
      <DashboardCharts salesData={dashboardData.salesData} categoryData={dashboardData.categoryData} />

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrdersList orders={dashboardData.recentOrders} />
        <TopProductsList products={dashboardData.topProducts} />
      </div>
    </div>
  );
}
