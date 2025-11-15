import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import type { OrderStatus, PaymentStatus } from "@/types/order";

export const ORDER_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    icon: XCircle,
  },
} as const;

export const PAYMENT_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    dotColor: "bg-yellow-500",
  },
  paid: {
    label: "Paid",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    dotColor: "bg-green-500",
  },
  failed: {
    label: "Failed",
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    dotColor: "bg-red-500",
  },
} as const;

export function getOrderStatusConfig(status: OrderStatus) {
  return ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.pending;
}

export function getPaymentStatusConfig(status: PaymentStatus) {
  return PAYMENT_STATUS_CONFIG[status] || PAYMENT_STATUS_CONFIG.pending;
}

export function getStatusColor(status: OrderStatus): string {
  return getOrderStatusConfig(status).color;
}

export function getStatusIcon(status: OrderStatus) {
  const Icon = getOrderStatusConfig(status).icon;
  return <Icon className="w-4 h-4" />;
}

export function getStatusText(status: OrderStatus): string {
  return getOrderStatusConfig(status).label;
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  return getPaymentStatusConfig(status).color;
}

export function getPaymentStatusText(status: PaymentStatus): string {
  return getPaymentStatusConfig(status).label;
}

export function getPaymentStatusDotColor(status: PaymentStatus): string {
  return getPaymentStatusConfig(status).dotColor;
}

export function formatOrderDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}

export function formatOrderTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatOrderDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatCurrency(amount: number, options?: Intl.NumberFormatOptions): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  })}`;
}

export function getCustomerInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
