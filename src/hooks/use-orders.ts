import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  productImage?: string;
  quantity: number;
  product?: {
    id: number;
    name: string;
    imageUrl?: string;
    stock: number;
  };
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  
  // Customer Information
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  postalCode?: string;
  notes?: string;
  
  // Payment Information
  paymentMethod: string;
  paymentProof?: string;
  
  // Price Information
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
  
  // Shipping Information
  trackingNumber?: string;
  estimatedDelivery?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Relations
  items: OrderItem[];
}

export interface CreateOrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  postalCode?: string;
  notes?: string;
  paymentMethod?: string;
  items: {
    productId: number;
    quantity: number;
  }[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // Fetch user orders
  const fetchOrders = async (page = 1, limit = 10, status?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
      });

      const response = await fetch(`/api/orders?${params}`, {
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch orders");
      }

      const data: OrdersResponse = await response.json();
      setOrders(data.orders);
      return data;
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to fetch orders");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new order
  const createOrder = async (orderData: CreateOrderData): Promise<Order | null> => {
    setCreating(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const data = await response.json();
      toast.success("Order created successfully!");
      
      // Refresh orders list
      await fetchOrders();
      
      return data.order;
    } catch (error) {
      console.error("Create order error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create order");
      return null;
    } finally {
      setCreating(false);
    }
  };

  // Get single order
  const getOrder = async (orderId: number): Promise<Order | null> => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch order");
      }

      const data = await response.json();
      return data.order;
    } catch (error) {
      console.error("Get order error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to fetch order");
      return null;
    }
  };

  // Update order (for admin or limited user updates)
  const updateOrder = async (
    orderId: number,
    updates: {
      status?: string;
      trackingNumber?: string;
      paymentStatus?: string;
      paymentProof?: string;
      notes?: string;
    }
  ): Promise<Order | null> => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update order");
      }

      const data = await response.json();
      toast.success("Order updated successfully!");
      
      // Refresh orders list
      await fetchOrders();
      
      return data.order;
    } catch (error) {
      console.error("Update order error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update order");
      return null;
    }
  };

  return {
    orders,
    loading,
    creating,
    fetchOrders,
    createOrder,
    getOrder,
    updateOrder,
  };
}
