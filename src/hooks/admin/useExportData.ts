import { useState } from "react";

interface DashboardData {
  statsCards: Array<{
    title: string;
    value: string;
  }>;
}

export function useExportData() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [headers.join(","), ...data.map((row) => headers.map((header) => `"${row[header] || ""}"`).join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToJSON = (data: Record<string, unknown> | Record<string, unknown>[], filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async (format: "csv" | "json", type: "orders" | "products" | "customers" | "full-report", dashboardData?: DashboardData) => {
    try {
      setIsExporting(true);
      setError(null);

      let data: Record<string, unknown> | Record<string, unknown>[];
      let filename: string;

      switch (type) {
        case "orders":
          const ordersResponse = await fetch("/api/admin/orders?limit=1000");
          const ordersData = await ordersResponse.json();
          data =
            ordersData.orders?.map((order: Record<string, unknown>) => ({
              id: order.id,
              orderNumber: order.orderNumber,
              customerName: order.customerName || (order.user as Record<string, unknown>)?.name || "Unknown",
              customerEmail: order.customerEmail || (order.user as Record<string, unknown>)?.email || "Unknown",
              status: order.status,
              totalAmount: `$${order.totalAmount}`,
              createdAt: new Date(order.createdAt as string).toLocaleDateString(),
              itemsCount: Array.isArray(order.items) ? order.items.length : 0,
            })) || [];
          filename = "orders-report";
          break;

        case "products":
          const productsResponse = await fetch("/api/admin/products?limit=1000");
          const productsData = await productsResponse.json();
          data =
            productsData.products?.map((product: Record<string, unknown>) => ({
              id: product.id,
              name: product.name,
              category: product.category,
              price: `$${product.price}`,
              discountPrice: product.discountPrice ? `$${product.discountPrice}` : "No discount",
              stock: product.stock,
              isActive: product.isActive ? "Active" : "Inactive",
              totalSold: product.totalSold || 0,
              totalRevenue: `$${product.totalRevenue || 0}`,
              createdAt: new Date(product.createdAt as string).toLocaleDateString(),
            })) || [];
          filename = "products-report";
          break;

        case "customers":
          const customersResponse = await fetch("/api/admin/customers?limit=1000");
          const customersData = await customersResponse.json();
          data =
            customersData.customers?.map((customer: Record<string, unknown>) => ({
              id: customer.id,
              name: customer.name || "Unknown",
              email: customer.email,
              phone: customer.phone || "Not provided",
              totalOrders: Array.isArray(customer.orders) ? customer.orders.length : 0,
              totalSpent: customer.totalSpent ? `$${customer.totalSpent}` : "$0",
              lastOrderDate: customer.lastOrderDate ? new Date(customer.lastOrderDate as string).toLocaleDateString() : "Never",
              createdAt: new Date(customer.createdAt as string).toLocaleDateString(),
            })) || [];
          filename = "customers-report";
          break;

        case "full-report":
          data = {
            generatedAt: new Date().toISOString(),
            dashboard: dashboardData,
            summary: {
              totalSales: dashboardData?.statsCards.find((s) => s.title === "Total Sales")?.value,
              totalOrders: dashboardData?.statsCards.find((s) => s.title === "Total Orders")?.value,
              totalProducts: dashboardData?.statsCards.find((s) => s.title === "Total Products")?.value,
              totalCustomers: dashboardData?.statsCards.find((s) => s.title === "Total Customers")?.value,
            },
          };
          filename = "dashboard-full-report";
          break;

        default:
          throw new Error("Invalid export type");
      }

      if (format === "csv") {
        if (type === "full-report") {
          const reportData = data as Record<string, unknown>;
          const summary = reportData.summary as Record<string, unknown>;
          const csvData = [
            { metric: "Total Sales", value: summary?.totalSales || "N/A" },
            { metric: "Total Orders", value: summary?.totalOrders || "N/A" },
            { metric: "Total Products", value: summary?.totalProducts || "N/A" },
            { metric: "Total Customers", value: summary?.totalCustomers || "N/A" },
          ];
          exportToCSV(csvData, filename);
        } else {
          exportToCSV(Array.isArray(data) ? data : [data], filename);
        }
      } else {
        exportToJSON(data, filename);
      }
    } catch (err) {
      console.error("Export error:", err);
      setError("Failed to export data");
      throw err;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    handleExport,
    isExporting,
    error,
  };
}
