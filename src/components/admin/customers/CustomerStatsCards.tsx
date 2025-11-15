"use client";

import { Card } from "@/components/ui/card";
import { Users, UserPlus } from "lucide-react";
import type { CustomerStats } from "@/types/customer";

interface CustomerStatsCardsProps {
  stats: CustomerStats;
}

export function CustomerStatsCards({ stats }: CustomerStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-bold">{stats.total}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-xl font-bold">{stats.active}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Inactive</p>
            <p className="text-xl font-bold">{stats.inactive}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Blocked</p>
            <p className="text-xl font-bold">{stats.blocked}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">New This Month</p>
            <p className="text-xl font-bold">{stats.newThisMonth}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-lg font-bold">
              {stats.totalRevenue.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
