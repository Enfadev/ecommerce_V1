import { Metadata } from "next";
import OrderHistoryPage from "@/components/OrderHistoryPage";

export const metadata: Metadata = {
  title: "Order History | E-Commerce",
  description: "View your order history",
};

export default function Page() {
  return <OrderHistoryPage />;
}
