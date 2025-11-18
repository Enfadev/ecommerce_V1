"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/hooks/use-orders";
import { ShoppingBag, Calendar, Clock, Package, Eye, Printer, Loader2 } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { statusStyles, paymentStatusStyles, statusLabels, paymentStatusLabels, formatCurrency, formatDate } from "../constants";

interface OrderListProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onPrintInvoice: (order: Order) => void;
  isPrinting: boolean;
}

export function OrderList({ orders, onViewDetails, onPrintInvoice, isPrinting }: OrderListProps) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(order.createdAt)}
                    <span>•</span>
                    <Clock className="h-4 w-4" />
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex gap-1 mb-2">
                  <Badge className={statusStyles[order.status]}>{statusLabels[order.status]}</Badge>
                  <Badge className={paymentStatusStyles[order.paymentStatus]}>{paymentStatusLabels[order.paymentStatus]}</Badge>
                </div>
                <div className="text-lg font-bold text-primary mt-2">{formatCurrency(order.totalAmount)}</div>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="space-y-2 mb-4">
              {order.items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <div className="w-8 h-8 bg-muted rounded flex items-center justify-center overflow-hidden">
                    {item.productImage ? <Image src={item.productImage} alt={item.productName} width={32} height={32} className="object-cover" /> : <Package className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">{item.productName}</span>
                    <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(item.productPrice * item.quantity)}</span>
                </div>
              ))}
              {order.items.length > 3 && <div className="text-sm text-muted-foreground">+{order.items.length - 3} more items</div>}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {order.items.length} item{order.items.length > 1 ? "s" : ""} • {order.paymentMethod} • {paymentStatusLabels[order.paymentStatus]}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onPrintInvoice(order)} disabled={isPrinting}>
                  {isPrinting ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Printing...
                    </>
                  ) : (
                    <>
                      <Printer className="h-3 w-3 mr-1" />
                      Print
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={() => onViewDetails(order)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
