import { Suspense } from "react";
import { OrderManagementWrapper } from "@/components/admin/orders/OrderManagementWrapper";
import { getInitialOrdersData } from "@/lib/actions";
import Loading from "./loading";

export const metadata = {
  title: "Order Management - Admin",
  description: "Manage all customer orders and track their status",
};

export default async function AdminOrderManagement() {
  const initialData = await getInitialOrdersData();

  return (
    <Suspense fallback={<Loading />}>
      <OrderManagementWrapper initialData={initialData} />
    </Suspense>
  );
}
