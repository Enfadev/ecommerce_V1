"use client";

import { Card } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, BarChart3, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalyticsOverview } from "@/types/analytics";

interface OverviewCardsProps {
  overview: AnalyticsOverview;
}

export function OverviewCards({ overview }: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">${overview.totalRevenue.toLocaleString()}</p>
            <div className="flex items-center gap-1">
              {overview.revenueGrowth >= 0 ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
              <span className={cn("text-sm font-medium", overview.revenueGrowth >= 0 ? "text-green-500" : "text-red-500")}>
                {overview.revenueGrowth >= 0 ? "+" : ""}
                {overview.revenueGrowth.toFixed(1)}%
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
            <p className="text-2xl font-bold">{overview.totalOrders.toLocaleString()}</p>
            <div className="flex items-center gap-1">
              {overview.ordersGrowth >= 0 ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
              <span className={cn("text-sm font-medium", overview.ordersGrowth >= 0 ? "text-green-500" : "text-red-500")}>
                {overview.ordersGrowth >= 0 ? "+" : ""}
                {overview.ordersGrowth.toFixed(1)}%
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
            <p className="text-2xl font-bold">{overview.totalCustomers.toLocaleString()}</p>
            <div className="flex items-center gap-1">
              {overview.customersGrowth >= 0 ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
              <span className={cn("text-sm font-medium", overview.customersGrowth >= 0 ? "text-green-500" : "text-red-500")}>
                {overview.customersGrowth >= 0 ? "+" : ""}
                {overview.customersGrowth.toFixed(1)}%
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
            <p className="text-2xl font-bold">${overview.avgOrderValue.toFixed(2)}</p>
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
  );
}
