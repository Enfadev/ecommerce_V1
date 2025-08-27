"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import OrderRatingModal from "./OrderRatingModal";
import { Package, Truck, CheckCircle, XCircle, Clock, Calendar, MapPin, CreditCard, RefreshCw, Download, ExternalLink, Copy, Star } from "lucide-react";
import { Order } from "@/hooks/use-orders";
import { toast } from "sonner";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  if (!order) return null;

  const statusConfig = {
    PENDING: {
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      description: "Pending Confirmation",
    },
    CONFIRMED: {
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      description: "Order Confirmed",
    },
    PROCESSING: {
      icon: Package,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      description: "Processing",
    },
    SHIPPED: {
      icon: Truck,
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      description: "Shipped",
    },
    DELIVERED: {
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      description: "Delivered",
    },
    CANCELLED: {
      icon: XCircle,
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      description: "Cancelled",
    },
    RETURNED: {
      icon: RefreshCw,
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      description: "Returned",
    },
  } as const;

  const StatusIcon = statusConfig[order.status].icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const subtotal = order.items.reduce((total: number, item) => total + item.productPrice * item.quantity, 0);
  const shipping = order.shippingFee;
  const tax = order.tax;
  const discount = order.discount;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const trackingSteps = [
    { step: "Order Created", date: order.createdAt, completed: true },
    { step: "Payment Confirmed", date: order.createdAt, completed: true },
    { step: "Order Processing", date: order.createdAt, completed: order.status !== "PENDING" },
    { step: "Order Shipped", date: order.estimatedDelivery, completed: ["SHIPPED", "DELIVERED"].includes(order.status) },
    { step: "Order Delivered", date: order.estimatedDelivery, completed: order.status === "DELIVERED" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="h-5 w-5" />
            Order Details {order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status & Basic Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={statusConfig[order.status].color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {order.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{statusConfig[order.status].description}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Order Date: {formatDate(order.createdAt)}</span>
                    </div>
                    {order.trackingNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span>Tracking Number: {order.trackingNumber}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(order.trackingNumber!, "Tracking number")} className="h-6 w-6 p-0">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{formatCurrency(order.totalAmount)}</div>
                  <div className="text-sm text-muted-foreground">Total Payment</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Tracking */}
          {order.status !== "CANCELLED" && order.status !== "RETURNED" && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Shipping Status</h3>
                <div className="space-y-4">
                  {trackingSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full border-2 ${step.completed ? "bg-green-500 border-green-500" : "border-muted-foreground bg-background"}`}>
                        {step.completed && <CheckCircle className="h-3 w-3 text-white -m-0.5" />}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>{step.step}</div>
                        {step.date && <div className="text-sm text-muted-foreground">{formatDate(step.date)}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{item.productName}</h4>
                      {item.product && <p className="text-sm text-muted-foreground mt-1">Product ID: {item.productId}</p>}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {item.quantity}x {formatCurrency(item.productPrice)}
                      </div>
                      <div className="text-sm text-muted-foreground">Subtotal: {formatCurrency(item.productPrice * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({order.items.length} items)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Payment Info */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </h3>
                <div className="space-y-2">
                  <div className="font-medium">{order.customerName}</div>
                  <div className="text-sm text-muted-foreground">
                    <div>{order.customerPhone}</div>
                    <div className="mt-2">{order.shippingAddress}</div>
                    {order.postalCode && <div>{order.postalCode}</div>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </h3>
                <div className="space-y-2">
                  <div className="font-medium">{order.paymentMethod}</div>
                  <div className="text-sm text-muted-foreground">Payment successful on {formatDate(order.createdAt)}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Notes</h3>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-end pt-4 border-t">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
            {order.trackingNumber && order.status === "SHIPPED" && (
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Track Package
              </Button>
            )}
            {order.status === "DELIVERED" && (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsRatingModalOpen(true)}>
                  <Star className="h-4 w-4 mr-2" />
                  Rate Order
                </Button>
                <Button variant="default" size="sm">
                  <Package className="h-4 w-4 mr-2" />
                  Buy Again
                </Button>
              </>
            )}
            {order.status === "DELIVERED" && (
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Return/Exchange
              </Button>
            )}
          </div>
        </div>

        {/* Rating Modal */}
        <OrderRatingModal orderNumber={order.orderNumber} items={order.items} isOpen={isRatingModalOpen} onClose={() => setIsRatingModalOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
