import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { AdminExportButton } from "@/components/admin/AdminExportButton";
import { CustomerStatsCards } from "@/components/admin/customers/CustomerStatsCards";
import { CustomerFilters } from "@/components/admin/customers/CustomerFilters";
import { CustomerTableWrapper } from "@/components/admin/customers/CustomerTableWrapper";
import { getCustomers } from "@/lib/actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Management | Admin Dashboard",
  description: "Manage customer data, analyze purchase behavior, and track customer engagement",
};

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminCustomerManagement({ searchParams }: PageProps) {
  const awaitedSearchParams = await searchParams;

  const filters = {
    search: awaitedSearchParams.search,
    status: awaitedSearchParams.status,
    page: awaitedSearchParams.page ? parseInt(awaitedSearchParams.page) : 1,
  };

  const result = await getCustomers(filters);

  if (!result.success) {
    throw new Error(result.error || "Failed to load customer data");
  }

  const { customers, stats } = result;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground mt-1">Manage customer data and analyze purchase behavior</p>
        </div>
        <div className="flex gap-3">
          <AdminExportButton
            data={customers.map((c) => ({
              id: c.id,
              name: c.name,
              email: c.email,
              phone: c.phone,
              totalOrders: c.totalOrders,
              totalSpent: c.totalSpent,
              status: c.status,
              joinDate: c.joinDate,
            }))}
            filename={`customers-${new Date().toISOString().split("T")[0]}`}
            type="customers"
            className=""
          />
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <CustomerStatsCards stats={stats} />

      <CustomerFilters initialSearch={filters.search} initialStatus={filters.status || "all"} totalResults={customers.length} totalRevenue={totalRevenue} />

      <CustomerTableWrapper customers={customers} totalCustomers={stats.total} />
    </div>
  );
}
