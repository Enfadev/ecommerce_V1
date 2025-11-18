"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { AdminExportButton } from "@/components/admin/shared/ExportButton";
import { OrderStats } from "@/components/admin/orders/OrderStats";
import { OrderFilters } from "@/components/admin/orders/OrderFilters";
import { OrderTable } from "@/components/admin/orders/OrderTable";
import { OrderDetailDialog } from "@/components/admin/orders/OrderDetailDialog";
import { usePrintInvoice } from "@/hooks/use-print-invoice";
import type { Order, OrderStatus, PaymentStatus } from "@/types/order";
import type { InitialOrdersData } from "@/lib/actions";
import { toast } from "sonner";

interface OrderManagementWrapperProps {
  initialData: InitialOrdersData;
}

export function OrderManagementWrapper({ initialData }: OrderManagementWrapperProps) {
  const [orders, setOrders] = useState(initialData.orders);
  const [stats, setStats] = useState(initialData.stats);
  const [pagination, setPagination] = useState(initialData.pagination);
  const [loading, setLoading] = useState(false);
  const { printInvoice, isLoading: isPrinting } = usePrintInvoice();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(
    async (
      params: {
        page?: number;
        status?: string;
        search?: string;
      } = {}
    ) => {
      setLoading(true);

      try {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.set("page", params.page.toString());
        if (params.status) searchParams.set("status", params.status);
        if (params.search) searchParams.set("search", params.search);

        const response = await fetch(`/api/admin/orders?${searchParams.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        setOrders(data.orders);
        setStats(data.stats);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateOrder = useCallback(
    async (orderNumber: string, updates: { status?: string; paymentStatus?: string }) => {
      try {
        const response = await fetch("/api/admin/orders", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderNumber,
            ...updates,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update order");
        }

        await fetchOrders({
          page: pagination.page,
          status: selectedStatus,
          search: searchQuery,
        });
      } catch (error) {
        console.error("Failed to update order:", error);
        throw error;
      }
    },
    [fetchOrders, pagination.page, selectedStatus, searchQuery]
  );

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
    const timeoutId = setTimeout(() => {
      fetchOrders({
        page: 1,
        status: selectedStatus,
        search: value,
      });
    }, 500);

    return () => clearTimeout(timeoutId);
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
          <p className="mt-1 text-muted-foreground">Manage all customer orders</p>
        </div>
        <div className="flex gap-3">
          <AdminExportButton data={orders as unknown as Record<string, unknown>[]} filename={`orders-${new Date().toISOString().split("T")[0]}`} type="orders" className="" />
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
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
