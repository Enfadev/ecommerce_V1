export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  productImage?: string;
  quantity: number;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface Order {
  id: string;
  orderNumber: string;
  userId: number;
  customer: OrderCustomer;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
  postalCode?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  notes?: string;
}

export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  revenue: number;
}

export interface OrderPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrdersResponse {
  orders: Order[];
  stats: OrderStats;
  pagination: OrderPagination;
}

export interface FetchOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface UpdateOrderParams {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  trackingNumber?: string;
}
