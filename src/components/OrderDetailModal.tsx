"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import OrderRatingModal from "./OrderRatingModal";
import { Package, Truck, CheckCircle, XCircle, Clock, Calendar, MapPin, CreditCard, RefreshCw, User, Phone, Mail, Download, ExternalLink, Copy, Star } from "lucide-react";
import { Order, OrderStatus } from "./OrderHistoryPage";
import { toast } from "sonner";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  if (!order) return null;

  // Status configuration with colors and icons
  const statusConfig = {
    Pending: {
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      description: "Menunggu Konfirmasi",
    },
    Processing: {
      icon: Package,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      description: "Sedang Diproses",
    },
    Shipped: {
      icon: Truck,
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      description: "Dalam Pengiriman",
    },
    Delivered: {
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      description: "Pesanan Selesai",
    },
    Cancelled: {
      icon: XCircle,
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      description: "Dibatalkan",
    },
    Returned: {
      icon: RefreshCw,
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      description: "Dikembalikan",
    },
  };

  const StatusIcon = statusConfig[order.status].icon;

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate subtotal and other costs
  const subtotal = order.items.reduce((total, item) => total + item.price * item.qty, 0);
  const shipping = 25000; // Example shipping cost
  const tax = subtotal * 0.11; // 11% tax
  const discount = 0; // No discount for example

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} disalin ke clipboard`);
  };

  const trackingSteps = [
    { step: "Pesanan Dibuat", date: order.date, completed: true },
    { step: "Pembayaran Dikonfirmasi", date: order.date, completed: true },
    { step: "Pesanan Diproses", date: order.date, completed: order.status !== "Pending" },
    { step: "Pesanan Dikirim", date: order.estimatedDelivery, completed: ["Shipped", "Delivered"].includes(order.status) },
    { step: "Pesanan Tiba", date: order.estimatedDelivery, completed: order.status === "Delivered" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="h-5 w-5" />
            Detail Pesanan {order.orderNumber}
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
                      <span>Tanggal Pesanan: {formatDate(order.date)}</span>
                    </div>
                    {order.trackingNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span>No. Resi: {order.trackingNumber}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(order.trackingNumber!, "Nomor resi")} className="h-6 w-6 p-0">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{formatCurrency(order.total)}</div>
                  <div className="text-sm text-muted-foreground">Total Pembayaran</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Tracking */}
          {order.status !== "Cancelled" && order.status !== "Returned" && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Status Pengiriman</h3>
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
              <h3 className="font-semibold text-lg mb-4">Item Pesanan</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      {item.variant && <p className="text-sm text-muted-foreground mt-1">{item.variant}</p>}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {item.qty}x {formatCurrency(item.price)}
                      </div>
                      <div className="text-sm text-muted-foreground">Subtotal: {formatCurrency(item.price * item.qty)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Ringkasan Pembayaran</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({order.items.length} item)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Kirim</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak (PPN 11%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(order.total)}</span>
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
                  Alamat Pengiriman
                </h3>
                <div className="space-y-2">
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-muted-foreground">
                    <div>+62 812-3456-7890</div>
                    <div className="mt-2">{order.shippingAddress}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Metode Pembayaran
                </h3>
                <div className="space-y-2">
                  <div className="font-medium">{order.paymentMethod}</div>
                  <div className="text-sm text-muted-foreground">Pembayaran berhasil pada {formatDate(order.date)}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Catatan</h3>
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
            {order.trackingNumber && order.status === "Shipped" && (
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Lacak Paket
              </Button>
            )}
            {order.status === "Delivered" && (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsRatingModalOpen(true)}>
                  <Star className="h-4 w-4 mr-2" />
                  Beri Rating
                </Button>
                <Button variant="default" size="sm">
                  <Package className="h-4 w-4 mr-2" />
                  Beli Lagi
                </Button>
              </>
            )}
            {order.status === "Delivered" && (
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Return/Tukar
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
