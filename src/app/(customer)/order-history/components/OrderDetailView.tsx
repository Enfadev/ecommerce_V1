"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/hooks/use-orders";
import { Package, ArrowLeft, CreditCard, MapPin, FileText, Printer, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { statusStyles, paymentStatusStyles, statusLabels, paymentStatusLabels, formatCurrency, formatDate } from "../constants";

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
  onPrintInvoice: (order: Order) => void;
  isPrinting: boolean;
}

export function OrderDetailView({ order, onBack, onPrintInvoice, isPrinting }: OrderDetailViewProps) {
  return (
    <div className="bg-background">
      <div className="py-8">
        <div className="mb-6 max-w-4xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">Order #{order.orderNumber}</p>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Order Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-muted-foreground">Placed {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</p>
                </div>
                <div className="text-right">
                  <div className="flex gap-2 mb-2">
                    <Badge className={statusStyles[order.status]}>{statusLabels[order.status]}</Badge>
                    <Badge className={paymentStatusStyles[order.paymentStatus]}>{paymentStatusLabels[order.paymentStatus]}</Badge>
                  </div>
                  <div className="text-2xl font-bold text-primary mt-2">{formatCurrency(order.totalAmount)}</div>
                  <Button variant="outline" size="sm" onClick={() => onPrintInvoice(order)} disabled={isPrinting} className="mt-2">
                    {isPrinting ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Printing...
                      </>
                    ) : (
                      <>
                        <Printer className="w-3 h-3 mr-1" />
                        Print Invoice
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {item.productImage ? <Image src={item.productImage} alt={item.productName} width={64} height={64} className="object-cover" /> : <Package className="h-6 w-6 text-muted-foreground" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.productName}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-muted-foreground">Quantity: {item.quantity}</span>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">{formatCurrency(item.productPrice)} each</div>
                          <div className="font-semibold">{formatCurrency(item.productPrice * item.quantity)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>{formatCurrency(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status</span>
                    <Badge className={paymentStatusStyles[order.paymentStatus]}>{paymentStatusLabels[order.paymentStatus]}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Date</span>
                    <span className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => onPrintInvoice(order)} disabled={isPrinting} className="flex-1 max-w-xs">
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
                <Button variant="outline" className="flex-1 max-w-xs" asChild>
                  <Link href="/contact">
                    <FileText className="w-4 h-4 mr-2" />
                    Contact Support
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
