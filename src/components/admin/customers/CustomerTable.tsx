"use client";

import { useState, useTransition, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowUpDown } from "lucide-react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Customer } from "@/types/customer";
import { updateCustomerStatus, deleteCustomer } from "@/actions/admin/customers";
import { toast } from "sonner";
import { CustomerTableRow } from "./CustomerTableRow";
import { CustomerTablePagination } from "./CustomerTablePagination";

interface CustomerTableProps {
  customers: Customer[];
  totalCustomers: number;
  onViewDetail: (customer: Customer) => void;
}

const ITEMS_PER_PAGE = 10;

export function CustomerTable({ customers, totalCustomers, onViewDetail }: CustomerTableProps) {
  const [isPending, startTransition] = useTransition();
  const [sortBy, setSortBy] = useState<keyof Customer>("joinDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const sortedCustomers = useMemo(() => {
    return [...customers].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      const modifier = sortOrder === "asc" ? 1 : -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * modifier;
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * modifier;
      }
      return 0;
    });
  }, [customers, sortBy, sortOrder]);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(sortedCustomers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedCustomers = sortedCustomers.slice(startIndex, endIndex);

    return { totalPages, startIndex, endIndex, paginatedCustomers };
  }, [sortedCustomers, currentPage]);

  const handleSort = useCallback((field: keyof Customer) => {
    setSortBy((prev) => {
      if (prev === field) {
        setSortOrder((order) => (order === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortOrder("asc");
      return field;
    });
  }, []);

  const handleStatusChange = useCallback((customerId: string, newStatus: Customer["status"]) => {
    startTransition(async () => {
      const result = await updateCustomerStatus(customerId, newStatus);
      if (result.success) {
        toast.success("Customer status updated successfully");
      } else {
        toast.error(result.error || "Failed to update customer status");
      }
    });
  }, []);

  const handleDeleteCustomer = useCallback((customerId: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    startTransition(async () => {
      const result = await deleteCustomer(customerId);
      if (result.success) {
        toast.success("Customer deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete customer");
      }
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <Card className="border-0 shadow-lg">
      <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Customer Database</h3>
              <p className="text-sm text-muted-foreground">{sortedCustomers.length} customers found</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {sortedCustomers.length} / {totalCustomers}
          </Badge>
        </div>
      </div>

      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 bg-muted/30">
              <TableHead className="text-left font-semibold w-[120px]">
                <Button variant="ghost" onClick={() => handleSort("id")} className="gap-2 p-2 h-auto font-semibold hover:bg-primary/10">
                  ID
                  <ArrowUpDown className="w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead className="text-left font-semibold w-[280px]">
                <Button variant="ghost" onClick={() => handleSort("name")} className="gap-2 p-2 h-auto font-semibold hover:bg-primary/10">
                  Customer
                  <ArrowUpDown className="w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead className="text-left font-semibold w-[240px]">Contact Info</TableHead>
              <TableHead className="text-center font-semibold w-[140px]">
                <Button variant="ghost" onClick={() => handleSort("totalOrders")} className="gap-2 p-2 h-auto font-semibold hover:bg-primary/10">
                  Orders
                  <ArrowUpDown className="w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right font-semibold w-[160px]">
                <Button variant="ghost" onClick={() => handleSort("totalSpent")} className="gap-2 p-2 h-auto font-semibold hover:bg-primary/10">
                  Revenue
                  <ArrowUpDown className="w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead className="text-center font-semibold w-[140px]">
                <Button variant="ghost" onClick={() => handleSort("joinDate")} className="gap-2 p-2 h-auto font-semibold hover:bg-primary/10">
                  Joined
                  <ArrowUpDown className="w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead className="text-center font-semibold w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginationData.paginatedCustomers.map((customer, index) => (
              <CustomerTableRow
                key={customer.id}
                customer={customer}
                index={index}
                startIndex={paginationData.startIndex}
                isPending={isPending}
                onViewDetail={onViewDetail}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteCustomer}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {sortedCustomers.length === 0 && (
        <div className="text-center py-12 border-t">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No customers found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {sortedCustomers.length > 0 && paginationData.totalPages > 1 && (
        <CustomerTablePagination
          currentPage={currentPage}
          totalPages={paginationData.totalPages}
          totalItems={sortedCustomers.length}
          startIndex={paginationData.startIndex}
          endIndex={paginationData.endIndex}
          onPageChange={handlePageChange}
        />
      )}
    </Card>
  );
}
