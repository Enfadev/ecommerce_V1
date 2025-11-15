import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";
import { AdminExportButton } from "@/components/admin/AdminExportButton";
import { CustomerStatsCards } from "@/components/admin/customers/CustomerStatsCards";
import { CustomerFilters } from "@/components/admin/customers/CustomerFilters";
import { CustomerTableWrapper } from "@/components/admin/customers/CustomerTableWrapper";
import { getCustomers } from "@/actions/admin/customers";
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

async function CustomerContent({ searchParams }: { searchParams: Awaited<PageProps["searchParams"]> }) {
  const filters = {
    search: searchParams.search,
    status: searchParams.status,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
  };

  const result = await getCustomers(filters);

  if (!result.success) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">{result.error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const { customers, stats } = result;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);

  return (
    <>
      <CustomerStatsCards stats={stats} />

      <CustomerFilters initialSearch={filters.search} initialStatus={filters.status || "all"} totalResults={customers.length} totalRevenue={totalRevenue} />

      <CustomerTableWrapper customers={customers} totalCustomers={stats.total} />
    </>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="flex items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-lg">Loading customer data...</p>
      </div>
    </div>
  );
}

export default async function AdminCustomerManagement({ searchParams }: PageProps) {
  const awaitedSearchParams = await searchParams;
  const customers = await getCustomers({
    search: awaitedSearchParams.search,
    status: awaitedSearchParams.status,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground mt-1">Manage customer data and analyze purchase behavior</p>
        </div>
        <div className="flex gap-3">
          <AdminExportButton
            data={customers.customers.map((c) => ({
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

      <Suspense fallback={<LoadingState />}>
        <CustomerContent searchParams={awaitedSearchParams} />
      </Suspense>
    </div>
  );
}
