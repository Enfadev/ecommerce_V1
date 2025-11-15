"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface CustomerFiltersProps {
  initialSearch?: string;
  initialStatus?: string;
  totalResults: number;
  totalRevenue: number;
}

export function CustomerFilters({ initialSearch = "", initialStatus = "all", totalResults, totalRevenue }: CustomerFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);

  const statusOptions = ["all", "active", "inactive", "blocked"];

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "blocked":
        return "Blocked";
      default:
        return "All Status";
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    startTransition(() => {
      const params = new URLSearchParams();
      if (value) params.set("search", value);
      if (selectedStatus !== "all") params.set("status", selectedStatus);
      router.push(`/admin/customers?${params.toString()}`);
    });
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    startTransition(() => {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (status !== "all") params.set("status", status);
      router.push(`/admin/customers?${params.toString()}`);
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
    startTransition(() => {
      router.push("/admin/customers");
    });
  };

  return (
    <Card className="border-0 shadow-md">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Search Customers</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, or ID..."
                className="pl-12 h-11 border-2 focus:border-primary/50 transition-all duration-200"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
            <div className="min-w-[200px]">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Filter by Status</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-11 justify-between border-2 hover:border-primary/50 transition-all duration-200" disabled={isPending}>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <span>{getStatusText(selectedStatus)}</span>
                    </div>
                    <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuLabel className="font-semibold">Select Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {statusOptions.map((status) => (
                    <DropdownMenuItem key={status} onClick={() => handleStatusChange(status)} className="gap-3">
                      {status !== "all" && <div className={`w-2 h-2 rounded-full ${status === "active" ? "bg-green-500" : status === "inactive" ? "bg-yellow-500" : "bg-red-500"}`} />}
                      {getStatusText(status)}
                      {selectedStatus === status && <div className="ml-auto w-1 h-1 bg-primary rounded-full" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="text-muted-foreground">
                <strong className="text-foreground">{totalResults}</strong> customers found
              </span>
              {(searchQuery || selectedStatus !== "all") && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-8 px-3 text-muted-foreground hover:text-foreground" disabled={isPending}>
                  Clear filters
                </Button>
              )}
            </div>

            <div className="text-muted-foreground">
              Total revenue:{" "}
              <strong className="text-green-600 dark:text-green-400">
                {totalRevenue.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
