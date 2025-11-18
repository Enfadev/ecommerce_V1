"use client";

import { useState, useEffect, useMemo } from "react";
import { useOrders, Order } from "@/hooks/use-orders";
import { useAuth } from "@/components/contexts/AuthContext";
import { usePrintInvoice } from "@/hooks/use-print-invoice";
import { Button } from "@/components/ui/button";
import { AdminBlocker } from "@/components/shared/AdminBlocker";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Components
import { OrderFilters } from "./components/OrderFilters";
import { OrderList } from "./components/OrderList";
import { EmptyOrders } from "./components/EmptyOrders";
import { OrdersLoading } from "./components/OrdersLoading";
import { OrderDetailView } from "./components/OrderDetailView";

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
      const orderData = {
        ...order,
        id: order.orderNumber,
        customer: {
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
        },
        total: order.totalAmount,
        status: order.status.toLowerCase() as "pending" | "processing" | "shipped" | "delivered" | "cancelled",
        paymentStatus: order.paymentStatus.toLowerCase() as "pending" | "paid" | "failed",
      };
      await printInvoice(orderData as unknown as Parameters<typeof printInvoice>[0]);
      toast.success("Invoice printed successfully!");
    } catch (error) {
      console.error("Error printing invoice:", error);
      toast.error("Failed to print invoice. Please try again.");
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  if (selectedOrder) {
    return <OrderDetailView order={selectedOrder} onBack={() => setSelectedOrder(null)} onPrintInvoice={handlePrintInvoice} isPrinting={isPrinting} />;
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

        <OrderFilters searchTerm={searchTerm} statusFilter={statusFilter} onSearchChange={setSearchTerm} onStatusChange={setStatusFilter} />

        {loading ? <OrdersLoading /> : filteredOrders.length > 0 ? <OrderList orders={filteredOrders} onViewDetails={setSelectedOrder} onPrintInvoice={handlePrintInvoice} isPrinting={isPrinting} /> : <EmptyOrders hasFilters={searchTerm !== "" || statusFilter !== "all"} />}
      </div>
    </div>
  );
}
