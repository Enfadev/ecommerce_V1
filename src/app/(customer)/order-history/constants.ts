export const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  PROCESSING: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  RETURNED: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
} as const;

export const paymentStatusStyles = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  REFUNDED: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
} as const;

export const statusLabels = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
} as const;

export const paymentStatusLabels = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
} as const;

export type OrderStatus = keyof typeof statusStyles;
export type PaymentStatus = keyof typeof paymentStatusStyles;

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatDate(dateString: string | Date): string {
  return new Date(dateString).toLocaleDateString();
}
