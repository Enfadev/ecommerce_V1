import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  customer: string;
  amount: string;
  status: string;
  date: string;
}

interface RecentOrdersListProps {
  orders: Order[];
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

export function RecentOrdersList({ orders }: RecentOrdersListProps) {
  return (
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
        {orders.map((order) => (
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
  );
}
