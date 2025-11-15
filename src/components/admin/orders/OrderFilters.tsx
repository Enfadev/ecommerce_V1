"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, ArrowUpDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import type { OrderStats } from "@/types/order";

interface OrderFiltersProps {
  searchQuery: string;
  selectedStatus: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: string) => void;
  ordersCount: number;
  stats: OrderStats;
}

const statusOptions = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "processing":
      return <Package className="w-4 h-4" />;
    case "shipped":
      return <Truck className="w-4 h-4" />;
    case "delivered":
      return <CheckCircle className="w-4 h-4" />;
    case "cancelled":
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getStatusText = (status: string) => {
  return status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1);
};

export function OrderFilters({ searchQuery, selectedStatus, onSearchChange, onStatusChange, ordersCount, stats }: OrderFiltersProps) {
  const handleClearFilters = () => {
    onSearchChange("");
    onStatusChange("all");
  };

  return (
    <Card className="border-0 shadow-md">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Search Orders</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search by order ID, customer name, or email..." className="pl-12 h-11 border-2 focus:border-primary/50 transition-all duration-200" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
            <div className="min-w-[200px]">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Filter by Status</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-11 justify-between border-2 hover:border-primary/50 transition-all duration-200">
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
                    <DropdownMenuItem key={status} onClick={() => onStatusChange(status)} className="gap-3">
                      {status !== "all" && getStatusIcon(status)}
                      {getStatusText(status)}
                      {selectedStatus === status && <div className="ml-auto w-1 h-1 bg-primary rounded-full" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="min-w-[160px]">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Date Range</label>
              <Button variant="outline" className="w-full h-11 justify-between border-2 hover:border-primary/50 transition-all duration-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>All Time</span>
                </div>
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="text-muted-foreground">
                <strong className="text-foreground">{ordersCount}</strong> orders found
              </span>
              {(searchQuery || selectedStatus !== "all") && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-8 px-3 text-muted-foreground hover:text-foreground">
                  Clear filters
                </Button>
              )}
            </div>

            <div className="text-muted-foreground">
              Total revenue:{" "}
              <strong className="text-green-600 dark:text-green-400">
                $
                {stats.revenue.toLocaleString("en-US", {
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
