import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, DollarSign } from "lucide-react";

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  description: string;
}

interface DashboardStatsCardsProps {
  stats: StatCard[];
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

export function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
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
  );
}
