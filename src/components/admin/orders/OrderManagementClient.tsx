"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { AdminExportButton } from "@/components/admin/shared/ExportButton";
import { OrderStats } from "@/components/admin/orders/OrderStats";
import { OrderFilters } from "@/components/admin/orders/OrderFilters";
import { OrderTable } from "@/components/admin/orders/OrderTable";
import { OrderDetailDialog } from "@/components/admin/orders/OrderDetailDialog";
import { useOrders } from "@/hooks/useOrders";
import { usePrintInvoice } from "@/hooks/use-print-invoice";
import type { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { toast } from "sonner";

export function OrderManagementClient() {
  const { orders, stats, loading, pagination, fetchOrders, updateOrder } = useOrders();
  const { printInvoice, isLoading: isPrinting } = usePrintInvoice();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const handlePrintInvoice = async (order: Order) => {
    try {
      await printInvoice(order);
      toast.success("Invoice printed successfully!");
    } catch (error) {
      console.error("Error printing invoice:", error);
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

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    try {
      await updateOrder(orderId, { status: newStatus });
      toast.success("Order status updated successfully!");
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdating(null);
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newPaymentStatus: PaymentStatus) => {
    setUpdating(orderId);
    try {
      await updateOrder(orderId, { paymentStatus: newPaymentStatus });
      toast.success("Payment status updated successfully!");
    } catch (error) {
      console.error("Failed to update payment status:", error);
      toast.error("Failed to update payment status");
    } finally {
      setUpdating(null);
    }
  };

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  return (
    <div className="space-y-6">
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

      <OrderStats stats={stats} />

      <OrderFilters searchQuery={searchQuery} selectedStatus={selectedStatus} onSearchChange={handleSearchChange} onStatusChange={handleStatusFilterChange} ordersCount={orders.length} stats={stats} />

      <OrderTable
        orders={orders}
        pagination={pagination}
        loading={loading}
        updating={updating}
        onViewDetail={handleViewDetail}
        onStatusChange={handleStatusChange}
        onPaymentStatusChange={handlePaymentStatusChange}
        onPageChange={handlePageChange}
        onPrintInvoice={handlePrintInvoice}
        isPrinting={isPrinting}
      />

      <OrderDetailDialog order={selectedOrder} open={showOrderDetail} onOpenChange={setShowOrderDetail} onPrintInvoice={handlePrintInvoice} isPrinting={isPrinting} />
    </div>
  );
}
