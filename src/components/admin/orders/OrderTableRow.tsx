"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, Package } from "lucide-react";
import type { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { getStatusColor, getStatusIcon, getStatusText, getPaymentStatusColor, getPaymentStatusText, formatOrderDate, formatOrderTime, formatCurrency, getCustomerInitials } from "@/lib/utils";
import { OrderActionsMenu } from "./OrderActionsMenu";

interface OrderTableRowProps {
  order: Order;
  index: number;
  updating: string | null;
  isPrinting: boolean;
  onViewDetail: (order: Order) => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onPaymentStatusChange: (orderId: string, status: PaymentStatus) => void;
  onPrintInvoice: (order: Order) => void;
}

export function OrderTableRow({ order, index, updating, isPrinting, onViewDetail, onStatusChange, onPaymentStatusChange, onPrintInvoice }: OrderTableRowProps) {
  return (
    <TableRow className="group hover:bg-muted/50 transition-all duration-200 border-b border-border/50">
      <TableCell className="font-mono text-sm py-6 w-[140px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium">{index + 1}</div>
          <span className="text-xs font-medium">#{order.id.slice(-8)}</span>
        </div>
      </TableCell>

      <TableCell className="py-6 w-[220px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl flex items-center justify-center ring-2 ring-blue-500/10">
            <span className="text-sm font-bold text-blue-600">{getCustomerInitials(order.customer.name)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{order.customer.name}</p>
            <p className="text-xs text-muted-foreground truncate">{order.customer.email}</p>
          </div>
        </div>
      </TableCell>

      <TableCell className="py-6 w-[180px]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-sm">
              {order.items.length} item{order.items.length > 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {order.items[0]?.productName}
            {order.items.length > 1 && ` +${order.items.length - 1} more`}
          </p>
        </div>
      </TableCell>

      <TableCell className="text-right py-6 w-[120px]">
        <div className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(order.total)}</div>
        <div className="text-xs text-muted-foreground">{order.items.length} items</div>
      </TableCell>

      <TableCell className="text-center py-6 w-[140px]">
        <Badge className={`${getStatusColor(order.status)} font-medium px-3 py-1.5`} variant="outline">
          <div className="flex items-center gap-1.5">
            {getStatusIcon(order.status)}
            {getStatusText(order.status)}
          </div>
        </Badge>
      </TableCell>

      <TableCell className="text-center py-6 w-[120px]">
        <Badge className={`${getPaymentStatusColor(order.paymentStatus)} font-medium px-3 py-1`} variant="outline">
          {getPaymentStatusText(order.paymentStatus)}
        </Badge>
      </TableCell>

      <TableCell className="text-center py-6 w-[120px]">
        <div className="text-sm font-medium text-foreground">{formatOrderDate(order.createdAt)}</div>
        <div className="text-xs text-muted-foreground">{formatOrderTime(order.createdAt)}</div>
      </TableCell>

      <TableCell className="text-center py-6 w-[100px]">
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onViewDetail(order)} className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30">
            <Eye className="w-4 h-4" />
          </Button>

          <OrderActionsMenu order={order} updating={updating} isPrinting={isPrinting} onViewDetail={onViewDetail} onStatusChange={onStatusChange} onPaymentStatusChange={onPaymentStatusChange} onPrintInvoice={onPrintInvoice} />
        </div>
      </TableCell>
    </TableRow>
  );
}
