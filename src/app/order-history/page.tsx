import { Metadata } from "next";
import OrderHistoryPageNew from "@/components/OrderHistoryPageNew";

export const metadata: Metadata = {
  title: "Order History | E-Commerce",
  description: "View your order history",
};

export default function Page() {
  return <OrderHistoryPageNew />;
}
