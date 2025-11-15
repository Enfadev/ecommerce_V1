import { useState, useEffect, useRef } from "react";
import type { Order, OrderStats, OrderPagination, FetchOrdersParams, UpdateOrderParams } from "@/types/order";

interface UseOrdersResult {
  orders: Order[];
  stats: OrderStats;
  loading: boolean;
  error: string | null;
  pagination: OrderPagination;
  fetchOrders: (params?: FetchOrdersParams) => Promise<void>;
  updateOrder: (orderNumber: string, updates: UpdateOrderParams) => Promise<void>;
}

export function useOrders(): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const initializedRef = useRef(false);

  const fetchOrders = async (params: FetchOrdersParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.set("page", params.page.toString());
      if (params.limit) searchParams.set("limit", params.limit.toString());
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (
    orderNumber: string,
    updates: {
      status?: string;
      paymentStatus?: string;
      trackingNumber?: string;
    }
  ) => {
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

      await fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order");
      throw err;
    }
  };

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      fetchOrders();
    }
  }, []);

  return {
    orders,
    stats,
    loading,
    error,
    pagination,
    fetchOrders,
    updateOrder,
  };
}
