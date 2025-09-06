"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, Package, Truck, CheckCircle, Clock, XCircle, MoreHorizontal, Calendar, ArrowUpDown, FileText, Loader2, ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useOrders } from "@/hooks/useOrders";
import { usePrintInvoice } from "@/hooks/use-print-invoice";
import { AdminExportButton } from "@/components/admin/AdminExportButton";
import { toast } from "sonner";

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  notes?: string;
}

export default function AdminOrderManagement() {
  const { orders, stats, loading, error, pagination, fetchOrders, updateOrder } = useOrders();
  const { printInvoice, isLoading: isPrinting } = usePrintInvoice();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<keyof Order>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handlePrintInvoice = async (order: Order) => {
    try {
      const printOrder = {
        id: parseInt(order.id) || 1,
        orderNumber: order.id,
        userId: 1,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        customerPhone: order.customer.phone,
        shippingAddress: order.shippingAddress,
        postalCode: "",
        notes: order.notes || "",
        paymentMethod: order.paymentMethod,
        status: order.status.toUpperCase() as "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED",
        paymentStatus: order.paymentStatus.toUpperCase() as "PENDING" | "PAID" | "FAILED" | "REFUNDED",
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        tax: order.tax,
        discount: order.discount,
        totalAmount: order.total,
        trackingNumber: order.trackingNumber,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.items.map((item, index) => ({
          id: index + 1,
          productId: index + 1,
          productName: item.name,
          productPrice: item.price,
          productImage: item.image || undefined,
          quantity: item.quantity
        }))
      };

      await printInvoice(printOrder);
      toast.success("Invoice printed successfully!");
    } catch (error) {
      console.error('Error printing invoice:', error);
      toast.error("Failed to print invoice. Please try again.");
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchOrders({
      page: newPage,
      status: selectedStatus,
      search: searchQuery,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setTimeout(() => {
      if (value === searchQuery) {
        fetchOrders({
          page: 1,
          status: selectedStatus,
          search: value,
        });
      }
    }, 500);
  };

  const handleStatusFilterChange = (value: string) => {
    setSelectedStatus(value);
    fetchOrders({
      page: 1,
      status: value,
      search: searchQuery,
    });
  };

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    setUpdating(orderId);
    try {
      await updateOrder(orderId, { status: newStatus });
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setUpdating(null);
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newPaymentStatus: Order["paymentStatus"]) => {
    setUpdating(orderId);
    try {
      await updateOrder(orderId, { paymentStatus: newPaymentStatus });
    } catch (error) {
      console.error("Failed to update payment status:", error);
    } finally {
      setUpdating(null);
    }
  };

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleSort = (field: keyof Order) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "processing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "shipped":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "delivered":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "paid":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "paid":
        return "Paid";
      case "failed":
        return "Failed";
      default:
        return status;
    }
  };

  const statusOptions = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">Error loading orders</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => fetchOrders({ page: 1, status: selectedStatus, search: searchQuery })}>
            Try Again
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground mt-1">Manage all customer orders</p>
        </div>
        <div className="flex gap-3">
          <AdminExportButton data={orders as unknown as Record<string, unknown>[]} filename={`orders-${new Date().toISOString().split("T")[0]}`} type="orders" className="" />
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Date Filter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Processing</p>
              <p className="text-xl font-bold">{stats.processing}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Shipped</p>
              <p className="text-xl font-bold">{stats.shipped}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="text-xl font-bold">{stats.delivered}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-lg font-bold">USD ${stats.revenue.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card className="border-0 shadow-md">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Search Orders
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search by order ID, customer name, or email..." 
                  className="pl-12 h-11 border-2 focus:border-primary/50 transition-all duration-200" 
                  value={searchQuery} 
                  onChange={(e) => handleSearchChange(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
              <div className="min-w-[200px]">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Filter by Status
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full h-11 justify-between border-2 hover:border-primary/50 transition-all duration-200">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <span>{selectedStatus === "all" ? "All Status" : getStatusText(selectedStatus)}</span>
                      </div>
                      <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel className="font-semibold">Select Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {statusOptions.map((status) => (
                      <DropdownMenuItem 
                        key={status} 
                        onClick={() => handleStatusFilterChange(status)}
                        className="gap-3"
                      >
                        {status !== "all" && getStatusIcon(status)}
                        {status === "all" ? "All Status" : getStatusText(status)}
                        {selectedStatus === status && (
                          <div className="ml-auto w-1 h-1 bg-primary rounded-full" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="min-w-[160px]">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Date Range
                </label>
                <Button variant="outline" className="w-full h-11 justify-between border-2 hover:border-primary/50 transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>All Time</span>
                  </div>
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick stats summary */}
          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{orders.length}</strong> orders found
                </span>
                {(searchQuery || selectedStatus !== "all") && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedStatus("all");
                      fetchOrders({ page: 1, status: "all", search: "" });
                    }}
                    className="h-8 px-3 text-muted-foreground hover:text-foreground"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
              
              <div className="text-muted-foreground">
                Total revenue: <strong className="text-green-600 dark:text-green-400">
                  ${stats.revenue.toLocaleString("en-US", { 
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="border-0 shadow-lg">
        <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Orders Database</h3>
                <p className="text-sm text-muted-foreground">{orders.length} orders found</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {orders.length} / {stats.total}
            </Badge>
          </div>
        </div>

        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 bg-muted/30">
                <TableHead className="text-left font-semibold w-[140px]">
                  <Button variant="ghost" onClick={() => handleSort("id")} className="gap-2 p-2 h-auto font-semibold hover:bg-primary/10">
                    Order ID
                    <ArrowUpDown className="w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-left font-semibold w-[220px]">
                  <Button variant="ghost" onClick={() => handleSort("customer")} className="gap-2 p-2 h-auto font-semibold hover:bg-primary/10">
                    Customer
                    <ArrowUpDown className="w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-left font-semibold w-[180px]">Products</TableHead>
                <TableHead className="text-right font-semibold w-[120px]">
                  <Button variant="ghost" onClick={() => handleSort("total")} className="gap-2 p-2 h-auto font-semibold hover:bg-primary/10">
                    Total
                    <ArrowUpDown className="w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-center font-semibold w-[140px]">Order Status</TableHead>
                <TableHead className="text-center font-semibold w-[120px]">Payment</TableHead>
                <TableHead className="text-center font-semibold w-[120px]">
                  <Button variant="ghost" onClick={() => handleSort("createdAt")} className="gap-2 p-2 h-auto font-semibold hover:bg-primary/10">
                    Date
                    <ArrowUpDown className="w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-center font-semibold w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <p className="text-lg">Loading orders...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="text-center">
                      <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <p className="text-lg text-red-500 mb-2">Error loading orders</p>
                      <p className="text-muted-foreground mb-4">{error}</p>
                      <Button onClick={() => fetchOrders({ page: 1, status: selectedStatus, search: searchQuery })}>
                        Try Again
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery || selectedStatus !== "all" 
                          ? "Try adjusting your search criteria or filters." 
                          : "No orders have been placed yet."
                        }
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, index) => (
                  <TableRow key={order.id} className="group hover:bg-muted/50 transition-all duration-200 border-b border-border/50">
                    <TableCell className="font-mono text-sm py-6 w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="text-xs font-medium">#{order.id.slice(-8)}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-6 w-[220px]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl flex items-center justify-center ring-2 ring-blue-500/10">
                          <span className="text-sm font-bold text-blue-600">
                            {order.customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {order.customer.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {order.customer.email}
                          </p>
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
                          {order.items[0]?.name}
                          {order.items.length > 1 && ` +${order.items.length - 1} more`}
                        </p>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right py-6 w-[120px]">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${order.total.toLocaleString("en-US", { 
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.items.length} items
                      </div>
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
                      <div className="text-sm font-medium text-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { 
                          month: "short",
                          day: "numeric",
                          year: "2-digit"
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleTimeString("en-US", { 
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center py-6 w-[100px]">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(order)}
                          className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-muted"
                              disabled={updating === order.id}
                            >
                              {updating === order.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="w-4 h-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="font-semibold">Quick Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDetail(order)} className="gap-2">
                              <Eye className="w-4 h-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handlePrintInvoice(order)} 
                              className="gap-2"
                              disabled={isPrinting}
                            >
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
                            {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                              <DropdownMenuItem 
                                key={status} 
                                onClick={() => handleStatusChange(order.id, status as Order["status"])} 
                                disabled={order.status === status || updating === order.id}
                                className="gap-2 text-xs"
                              >
                                {getStatusIcon(status)}
                                {getStatusText(status)}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="font-semibold text-xs">Payment Status</DropdownMenuLabel>
                            {["pending", "paid", "failed"].map((paymentStatus) => (
                              <DropdownMenuItem 
                                key={paymentStatus} 
                                onClick={() => handlePaymentStatusChange(order.id, paymentStatus as Order["paymentStatus"])} 
                                disabled={order.paymentStatus === paymentStatus || updating === order.id}
                                className="gap-2 text-xs"
                              >
                                <div className={`w-2 h-2 rounded-full ${
                                  paymentStatus === 'paid' ? 'bg-green-500' : 
                                  paymentStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                }`} />
                                {getPaymentStatusText(paymentStatus)}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Enhanced Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
            <div className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    const distance = Math.abs(page - pagination.page);
                    return distance === 0 || distance === 1 || page === 1 || page === pagination.totalPages;
                  })
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && page - array[index - 1] > 1;
                    return (
                      <div key={page} className="flex items-center">
                        {showEllipsis && <span className="px-2 text-muted-foreground">...</span>}
                        <Button
                          variant={pagination.page === page ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-9 h-9 p-0"
                          disabled={loading}
                        >
                          {page}
                        </Button>
                      </div>
                    );
                  })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || loading}
                className="gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Enhanced Order Detail Dialog */}
      <Dialog open={showOrderDetail} onOpenChange={setShowOrderDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Package className="w-5 h-5" />
              Order Details #{selectedOrder?.id.slice(-8)}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status & Actions Bar */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge className={`${getStatusColor(selectedOrder.status)} text-sm px-4 py-2`} variant="outline">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedOrder.status)}
                      {getStatusText(selectedOrder.status)}
                    </div>
                  </Badge>
                  <Badge className={`${getPaymentStatusColor(selectedOrder.paymentStatus)} text-sm px-4 py-2`} variant="outline">
                    {getPaymentStatusText(selectedOrder.paymentStatus)}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePrintInvoice(selectedOrder)}
                    disabled={isPrinting}
                  >
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

              {/* Order & Customer Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Order Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-mono font-medium">#{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Order Date:</span>
                      <span className="font-medium">
                        {new Date(selectedOrder.createdAt).toLocaleDateString("en-US", { 
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Order Time:</span>
                      <span className="font-medium">
                        {new Date(selectedOrder.createdAt).toLocaleTimeString("en-US", { 
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span className="font-medium">{selectedOrder.paymentMethod}</span>
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Tracking Number:</span>
                        <span className="font-mono font-medium text-blue-600">{selectedOrder.trackingNumber}</span>
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
                        <span className="text-lg font-bold text-blue-600">
                          {selectedOrder.customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{selectedOrder.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">{selectedOrder.customer.phone}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Shipping Address */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Shipping Address
                </h3>
                <p className="text-sm bg-muted/50 p-4 rounded-lg">{selectedOrder.shippingAddress}</p>
              </Card>

              {/* Order Items */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Order Items ({selectedOrder.items.length})
                </h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × ${item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t border-border pt-6 mt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>${selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping Fee:</span>
                      <span>${selectedOrder.shippingFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax:</span>
                      <span>${selectedOrder.tax.toLocaleString()}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Discount:</span>
                        <span className="text-green-600">-${selectedOrder.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total Amount:</span>
                        <span className="text-2xl font-bold text-green-600">
                          ${selectedOrder.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Notes (if any) */}
              {selectedOrder.notes && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Order Notes
                  </h3>
                  <p className="text-sm bg-muted/50 p-4 rounded-lg">{selectedOrder.notes}</p>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => selectedOrder && handlePrintInvoice(selectedOrder)}
                  disabled={isPrinting}
                >
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
                <Button className="flex-1">
                  Update Order Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
