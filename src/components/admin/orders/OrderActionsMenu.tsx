"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Loader2, Printer } from "lucide-react";
import type { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { getStatusIcon, getStatusText, getPaymentStatusText, getPaymentStatusDotColor } from "@/lib/utils";

interface OrderActionsMenuProps {
  order: Order;
  updating: string | null;
  isPrinting: boolean;
  onViewDetail: (order: Order) => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onPaymentStatusChange: (orderId: string, status: PaymentStatus) => void;
  onPrintInvoice: (order: Order) => void;
}

export function OrderActionsMenu({ order, updating, isPrinting, onViewDetail, onStatusChange, onPaymentStatusChange, onPrintInvoice }: OrderActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted" disabled={updating === order.id}>
          {updating === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreHorizontal className="w-4 h-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-semibold">Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onViewDetail(order)} className="gap-2">
          <Eye className="w-4 h-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onPrintInvoice(order)} className="gap-2" disabled={isPrinting}>
          {isPrinting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Printing...
            </>
          ) : (
            <>
              <Printer className="w-4 h-4" />
              Print Invoice
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-semibold text-xs">Change Order Status</DropdownMenuLabel>
        {(["pending", "processing", "shipped", "delivered", "cancelled"] as OrderStatus[]).map((status) => (
          <DropdownMenuItem key={status} onClick={() => onStatusChange(order.id, status)} disabled={order.status === status || updating === order.id} className="gap-2 text-xs">
            {getStatusIcon(status)}
            {getStatusText(status)}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-semibold text-xs">Payment Status</DropdownMenuLabel>
        {(["pending", "paid", "failed"] as PaymentStatus[]).map((paymentStatus) => (
          <DropdownMenuItem key={paymentStatus} onClick={() => onPaymentStatusChange(order.id, paymentStatus)} disabled={order.paymentStatus === paymentStatus || updating === order.id} className="gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${getPaymentStatusDotColor(paymentStatus)}`} />
            {getPaymentStatusText(paymentStatus)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
