"use server";

import { revalidatePath } from "next/cache";
import type { Customer, CustomerStats, CustomerFilters } from "@/types/customer";

export async function getCustomers(filters: CustomerFilters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.status && filters.status !== "all") params.append("status", filters.status);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/admin/customers?${params}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch customers");
    }

    const data = await response.json();
    return {
      success: true,
      customers: data.customers as Customer[],
      stats: data.stats as CustomerStats,
      pagination: data.pagination,
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return {
      success: false,
      error: "Failed to load customer data",
      customers: [],
      stats: {
        total: 0,
        active: 0,
        inactive: 0,
        blocked: 0,
        newThisMonth: 0,
        totalRevenue: 0,
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  }
}

export async function updateCustomerStatus(customerId: string, newStatus: Customer["status"]) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/admin/customers?id=${customerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error("Failed to update customer status");
    }

    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error) {
    console.error("Error updating customer status:", error);
    return { success: false, error: "Failed to update customer status" };
  }
}

export async function deleteCustomer(customerId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/admin/customers?id=${customerId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete customer");
    }

    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return { success: false, error: "Failed to delete customer" };
  }
}
