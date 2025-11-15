import { Card } from "@/components/ui/card";
import { Package, Clock, Truck, CheckCircle } from "lucide-react";
import type { OrderStats as OrderStatsType } from "@/types/order";

interface OrderStatsProps {
  stats: OrderStatsType;
}

export function OrderStats({ stats }: OrderStatsProps) {
  const statsConfig = [
    {
      label: "Total",
      value: stats.total,
      icon: Package,
      color: "blue",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "yellow",
    },
    {
      label: "Processing",
      value: stats.processing,
      icon: Package,
      color: "blue",
    },
    {
      label: "Shipped",
      value: stats.shipped,
      icon: Truck,
      color: "purple",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "Revenue",
      value: `USD $${stats.revenue.toLocaleString()}`,
      icon: CheckCircle,
      color: "green",
      isRevenue: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      {statsConfig.map((stat) => (
        <Card key={stat.label} className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-${stat.color}-500/10 rounded-lg flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={stat.isRevenue ? "text-lg font-bold" : "text-xl font-bold"}>{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
