import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order History | Track Your Orders",
  description: "View and track all your orders, check order status, and download invoices",
  openGraph: {
    title: "Order History | Track Your Orders",
    description: "Manage and track all your orders in one place",
  },
};

export default function OrderHistoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
