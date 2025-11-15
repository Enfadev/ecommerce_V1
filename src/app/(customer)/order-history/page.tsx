"use client";

import { useState, useEffect } from "react";
import { useOrders, Order } from "@/hooks/use-orders";
import { useAuth } from "@/components/contexts/auth-context";
import { usePrintInvoice } from "@/hooks/use-print-invoice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AdminBlocker } from "@/components/shared/AdminBlocker";
import { Package, Search, Filter, Calendar, MapPin, CreditCard, Eye, ArrowLeft, Loader2, ShoppingBag, Clock, FileText, Printer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  PROCESSING: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  RETURNED: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
};

const paymentStatusStyles = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  REFUNDED: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
};

const statusLabels = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

const paymentStatusLabels = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const { orders, loading, fetchOrders } = useOrders();
  const { printInvoice, isLoading: isPrinting } = usePrintInvoice();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      fetchOrders();
    }
  }, [fetchOrders, user]);

  const handlePrintInvoice = async (order: Order) => {
    try {
      await printInvoice(order);
      toast.success("Invoice printed successfully!");
    } catch (error) {
      console.error("Error printing invoice:", error);
      toast.error("Failed to print invoice. Please try again.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (selectedOrder) {
    return (
      <div className="bg-background">
        <div className="py-8">
          <div className="mb-6 max-w-4xl mx-auto">
            <Button variant="ghost" onClick={() => setSelectedOrder(null)} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-muted-foreground">Order #{selectedOrder.orderNumber}</p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Order Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{selectedOrder.orderNumber}</h3>
                    <p className="text-sm text-muted-foreground">Placed {formatDistanceToNow(new Date(selectedOrder.createdAt), { addSuffix: true })}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-2 mb-2">
                      <Badge className={statusStyles[selectedOrder.status]}>{statusLabels[selectedOrder.status]}</Badge>
                      <Badge className={paymentStatusStyles[selectedOrder.paymentStatus]}>{paymentStatusLabels[selectedOrder.paymentStatus]}</Badge>
                    </div>
                    <div className="text-2xl font-bold text-primary mt-2">{formatCurrency(selectedOrder.totalAmount)}</div>
                    <Button variant="outline" size="sm" onClick={() => handlePrintInvoice(selectedOrder)} disabled={isPrinting} className="mt-2">
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
                  Items ({selectedOrder.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
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
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span>{formatCurrency(selectedOrder.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(selectedOrder.totalAmount)}</span>
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
                    <div className="font-medium">{selectedOrder.customerName}</div>
                    <div className="text-sm text-muted-foreground">
                      <div>{selectedOrder.customerPhone}</div>
                      <div className="mt-2">{selectedOrder.shippingAddress}</div>
                      {selectedOrder.postalCode && <div>{selectedOrder.postalCode}</div>}
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
                      <span className="font-medium">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status</span>
                      <Badge className={paymentStatusStyles[selectedOrder.paymentStatus]}>{paymentStatusLabels[selectedOrder.paymentStatus]}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Date</span>
                      <span className="text-sm text-muted-foreground">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notes */}
            {selectedOrder.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => handlePrintInvoice(selectedOrder)} disabled={isPrinting} className="flex-1 max-w-xs">
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

  if (user?.role === "ADMIN") {
    return <AdminBlocker title="Order History Access Restricted" message="Order history is for customers to track their purchases. As an admin, you can view and manage all orders through the admin panel's order management section." />;
  }

  return (
    <div className="bg-background">
      <div className="py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Order History</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by order number, product name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="RETURNED">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading orders...</span>
              </div>
            </CardContent>
          </Card>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
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
                      <Button variant="outline" size="sm" onClick={() => handlePrintInvoice(order)} disabled={isPrinting}>
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
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                <p className="text-muted-foreground mb-4">{searchTerm || statusFilter !== "all" ? "No orders match your current filters." : "You haven't placed any orders yet."}</p>
                <Button asChild>
                  <Link href="/product">Start Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
