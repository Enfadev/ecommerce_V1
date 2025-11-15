"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, Truck, FileText, Printer, Loader2 } from "lucide-react";
import type { Order } from "@/types/order";
import { getStatusColor, getStatusText, getPaymentStatusColor, getPaymentStatusText, formatOrderDateTime, formatOrderTime, formatCurrency, getCustomerInitials } from "@/lib/utils";

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrintInvoice: (order: Order) => void;
  isPrinting: boolean;
}

export function OrderDetailDialog({ order, open, onOpenChange, onPrintInvoice, isPrinting }: OrderDetailDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Package className="w-5 h-5" />
            Order Details #{order.id.slice(-8)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4">
              <Badge className={`${getStatusColor(order.status)} text-sm px-4 py-2`} variant="outline">
                {getStatusText(order.status)}
              </Badge>
              <Badge className={`${getPaymentStatusColor(order.paymentStatus)} text-sm px-4 py-2`} variant="outline">
                {getPaymentStatusText(order.paymentStatus)}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onPrintInvoice(order)} disabled={isPrinting}>
                {isPrinting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Printing...
                  </>
                ) : (
                  <>
                    <Printer className="w-4 h-4 mr-2" />
                    Print Invoice
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm">
                Track Order
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Order Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono font-medium">#{order.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span className="font-medium">{formatOrderDateTime(order.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Order Time:</span>
                  <span className="font-medium">{formatOrderTime(order.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tracking Number:</span>
                    <span className="font-mono font-medium text-blue-600">{order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full" />
                Customer Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl flex items-center justify-center ring-2 ring-blue-500/10">
                    <span className="text-lg font-bold text-blue-600">{getCustomerInitials(order.customer.name)}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{order.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{order.customer.phone}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Shipping Address
            </h3>
            <p className="text-sm bg-muted/50 p-4 rounded-lg">{order.shippingAddress}</p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} × {formatCurrency(item.productPrice)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(item.productPrice * item.quantity)}</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(item.productPrice)} each</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6 mt-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping Fee:</span>
                  <span>{formatCurrency(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax:</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount:</span>
                    <span className="text-green-600">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-600">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {order.notes && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Order Notes
              </h3>
              <p className="text-sm bg-muted/50 p-4 rounded-lg">{order.notes}</p>
            </Card>
          )}

          <div className="flex gap-4 pt-4 border-t">
            <Button variant="outline" className="flex-1" onClick={() => onPrintInvoice(order)} disabled={isPrinting}>
              {isPrinting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Printing Invoice...
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4 mr-2" />
                  Print Invoice
                </>
              )}
            </Button>
            <Button variant="outline" className="flex-1">
              Send Email Update
            </Button>
            <Button className="flex-1">Update Order Status</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
