import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ChatStats {
  total: number;
  open: number;
  closed: number;
  resolved: number;
  unread: number;
}

interface ChatStatsCardsProps {
  stats: ChatStats;
}

export function ChatStatsCards({ stats }: ChatStatsCardsProps) {
  const statsConfig = [
    {
      label: "Total Chats",
      value: stats.total,
      icon: MessageSquare,
      color: "blue",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Open",
      value: stats.open,
      icon: CheckCircle,
      color: "green",
      bgColor: "bg-green-500/10",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Closed",
      value: stats.closed,
      icon: XCircle,
      color: "gray",
      bgColor: "bg-gray-500/10",
      textColor: "text-gray-600 dark:text-gray-400",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle,
      color: "blue",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Unread",
      value: stats.unread,
      icon: AlertCircle,
      color: "red",
      bgColor: "bg-red-500/10",
      textColor: "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      {statsConfig.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-full`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
