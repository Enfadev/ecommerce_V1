import { useState, useCallback } from "react";
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
  
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  postalCode?: string;
  notes?: string;
  
  paymentMethod: string;
  paymentProof?: string;
  
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
  
  trackingNumber?: string;
  estimatedDelivery?: string;
  
  createdAt: string;
  updatedAt: string;
  
  items: OrderItem[];
}

export interface CreateOrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  postalCode?: string;
  notes?: string;
  paymentMethod: string; 
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

  const fetchOrders = useCallback(async (page = 1, limit = 10, status?: string) => {
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
  }, []);

  const createOrder = async (orderData: CreateOrderData): Promise<Order | null> => {
    setCreating(true);
    try {
      // Validate required fields before sending
      if (!orderData.customerName?.trim()) {
        throw new Error("Customer name is required");
      }
      if (!orderData.customerEmail?.trim()) {
        throw new Error("Customer email is required");
      }
      if (!orderData.customerPhone?.trim()) {
        throw new Error("Customer phone is required");
      }
      if (!orderData.shippingAddress?.trim()) {
        throw new Error("Shipping address is required");
      }
      if (!orderData.paymentMethod?.trim()) {
        throw new Error("Payment method is required");
      }
      if (!orderData.items || orderData.items.length === 0) {
        throw new Error("Order items are required");
      }
      if (isNaN(orderData.subtotal) || orderData.subtotal < 0) {
        throw new Error("Valid subtotal is required");
      }
      if (isNaN(orderData.totalAmount) || orderData.totalAmount < 0) {
        throw new Error("Valid total amount is required");
      }

      console.log("Sending order data:", {
        ...orderData,
        customerName: orderData.customerName?.trim(),
        customerEmail: orderData.customerEmail?.trim(),
        customerPhone: orderData.customerPhone?.trim(),
        shippingAddress: orderData.shippingAddress?.trim(),
        paymentMethod: orderData.paymentMethod?.trim(),
      });

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...orderData,
          customerName: orderData.customerName.trim(),
          customerEmail: orderData.customerEmail.trim(),
          customerPhone: orderData.customerPhone.trim(),
          shippingAddress: orderData.shippingAddress.trim(),
          paymentMethod: orderData.paymentMethod.trim(),
          postalCode: orderData.postalCode?.trim() || "",
          notes: orderData.notes?.trim() || "",
          shippingFee: orderData.shippingFee || 0,
          tax: orderData.tax || 0,
          discount: orderData.discount || 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const data = await response.json();
      toast.success("Order created successfully!");
      
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
