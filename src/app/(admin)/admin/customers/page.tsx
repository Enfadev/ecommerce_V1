"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, Edit, Trash2, Users, Mail, Phone, Calendar, MoreHorizontal, ArrowUpDown, UserPlus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminExportButton } from "@/components/admin/AdminExportButton";

interface Customer {
  id: string;
  dbId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  lastOrder: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive" | "blocked";
}

interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  blocked: number;
  newThisMonth: number;
  totalRevenue: number;
}

interface CustomerApiResponse {
  customers: Customer[];
  stats: CustomerStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminCustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats>({
    total: 0,
    active: 0,
    inactive: 0,
    blocked: 0,
    newThisMonth: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [sortBy, setSortBy] = useState<keyof Customer>("joinDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedStatus !== "all") params.append("status", selectedStatus);

      const response = await fetch(`/api/admin/customers?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data: CustomerApiResponse = await response.json();
      setCustomers(data.customers);
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Failed to load customer data");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedStatus]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCustomers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [fetchCustomers]);

  const filteredCustomers = customers
    .filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        customer.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus]);

  const statusOptions = ["all", "active", "inactive", "blocked"];

  const handleSort = (field: keyof Customer) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleStatusChange = (customerId: string, newStatus: Customer["status"]) => {
    setCustomers(customers.map((customer) => (customer.id === customerId ? { ...customer, status: newStatus } : customer)));
  };

  const handleViewDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetail(true);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      const response = await fetch(`/api/admin/customers?id=${customerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      setCustomers(customers.filter((customer) => customer.id !== customerId));

      await fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "inactive":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "blocked":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "blocked":
        return "Blocked";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-lg">Loading customer data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">{error}</p>
          <Button onClick={fetchCustomers}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground mt-1">Manage customer data and analyze purchase behavior</p>
        </div>
        <div className="flex gap-3">
          <AdminExportButton data={filteredCustomers as unknown as Record<string, unknown>[]} filename={`customers-${new Date().toISOString().split("T")[0]}`} type="customers" className="" />
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-xl font-bold">{stats.active}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inactive</p>
              <p className="text-xl font-bold">{stats.inactive}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Blocked</p>
              <p className="text-xl font-bold">{stats.blocked}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">New This Month</p>
              <p className="text-xl font-bold">{stats.newThisMonth}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-lg font-bold">{stats.totalRevenue.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card className="border-0 shadow-md">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Search Customers
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, email, phone, or ID..." 
                  className="pl-12 h-11 border-2 focus:border-primary/50 transition-all duration-200" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
              <div className="min-w-[200px]">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Filter by Status
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full h-11 justify-between border-2 hover:border-primary/50 transition-all duration-200">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <span>{selectedStatus === "all" ? "All Status" : getStatusText(selectedStatus)}</span>
                      </div>
                      <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel className="font-semibold">Select Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {statusOptions.map((status) => (
                      <DropdownMenuItem 
                        key={status} 
                        onClick={() => setSelectedStatus(status)}
                        className="gap-3"
                      >
                        {status !== "all" && (
                          <div className={`w-2 h-2 rounded-full ${
                            status === 'active' ? 'bg-green-500' : 
                            status === 'inactive' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                        )}
                        {status === "all" ? "All Status" : getStatusText(status)}
                        {selectedStatus === status && (
                          <div className="ml-auto w-1 h-1 bg-primary rounded-full" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="min-w-[160px]">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Results per page
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full h-11 justify-between border-2 hover:border-primary/50 transition-all duration-200">
                      <span>{itemsPerPage} items</span>
                      <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {[5, 10, 20, 50].map((count) => (
                      <DropdownMenuItem 
                        key={count} 
                        onClick={() => {
                          // For now, we'll keep the default value since itemsPerPage is readonly
                          // In a real implementation, you'd make this mutable
                        }}
                      >
                        {count} items
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Quick stats summary */}
          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{filteredCustomers.length}</strong> customers found
                </span>
                {(searchQuery || selectedStatus !== "all") && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedStatus("all");
                    }}
                    className="h-8 px-3 text-muted-foreground hover:text-foreground"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
              
              <div className="text-muted-foreground">
                Total revenue: <strong className="text-green-600 dark:text-green-400">
                  {filteredCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0).toLocaleString("en-US", { 
                    style: "currency", 
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="border-0 shadow-lg">
        <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Customer Database</h3>
                <p className="text-sm text-muted-foreground">{filteredCustomers.length} customers found</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {filteredCustomers.length} / {stats.total}
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
              {paginatedCustomers.map((customer, index) => (
                <TableRow 
                  key={customer.id} 
                  className="group hover:bg-muted/50 transition-all duration-200 border-b border-border/50"
                >
                  <TableCell className="font-mono text-sm text-muted-foreground py-6 w-[120px]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
                        {startIndex + index + 1}
                      </div>
                      <span className="text-xs">#{customer.id.slice(-6)}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-6 w-[280px]">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center ring-2 ring-primary/10">
                          <span className="text-sm font-bold text-primary">
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                          customer.status === 'active' ? 'bg-green-500' : 
                          customer.status === 'inactive' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {customer.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Customer since {new Date(customer.joinDate).toLocaleDateString("en-US", { 
                            month: "short", 
                            year: "numeric" 
                          })}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-6 w-[240px]">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
                          <Mail className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-foreground font-medium truncate max-w-[200px]">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-md flex items-center justify-center">
                          <Phone className="w-3 h-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-muted-foreground">{customer.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center py-6 w-[140px]">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-foreground">{customer.totalOrders}</div>
                      <div className="text-xs text-muted-foreground">
                        {customer.lastOrder ? (
                          <>Last: {new Date(customer.lastOrder).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</>
                        ) : (
                          "No orders"
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right py-6 w-[160px]">
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {customer.totalSpent.toLocaleString("en-US", { 
                          style: "currency", 
                          currency: "USD",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {customer.totalOrders > 0 ? (
                          <>Avg: {(customer.totalSpent / customer.totalOrders).toLocaleString("en-US", { 
                            style: "currency", 
                            currency: "USD",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          })}</>
                        ) : (
                          "No purchases"
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center py-6 w-[140px]">
                    <div className="text-sm font-medium text-foreground">
                      {new Date(customer.joinDate).toLocaleDateString("en-US", { 
                        month: "short",
                        day: "numeric",
                        year: "2-digit"
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.floor((new Date().getTime() - new Date(customer.joinDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center py-6 w-[120px]">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetail(customer)}
                        className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-muted"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel className="font-semibold">Quick Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewDetail(customer)} className="gap-2">
                            <Eye className="w-4 h-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="w-4 h-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Mail className="w-4 h-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="font-semibold text-xs">Change Status</DropdownMenuLabel>
                          {["active", "inactive", "blocked"].map((status) => (
                            <DropdownMenuItem 
                              key={status} 
                              onClick={() => handleStatusChange(customer.id, status as Customer["status"])} 
                              disabled={customer.status === status}
                              className="gap-2 text-xs"
                            >
                              <div className={`w-2 h-2 rounded-full ${
                                status === 'active' ? 'bg-green-500' : 
                                status === 'inactive' ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                              {getStatusText(status)}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteCustomer(customer.id)} 
                            className="text-destructive gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12 border-t">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No customers found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedStatus !== "all" 
                ? "Try adjusting your search criteria or filters." 
                : "Start by adding your first customer to the database."
              }
            </p>
            {(!searchQuery && selectedStatus === "all") && (
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" />
                Add First Customer
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredCustomers.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredCustomers.length)} of {filteredCustomers.length} customers
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    const distance = Math.abs(page - currentPage);
                    return distance === 0 || distance === 1 || page === 1 || page === totalPages;
                  })
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && page - array[index - 1] > 1;
                    return (
                      <div key={page} className="flex items-center">
                        {showEllipsis && <span className="px-2 text-muted-foreground">...</span>}
                        <Button
                          variant={currentPage === page ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-9 h-9 p-0"
                        >
                          {page}
                        </Button>
                      </div>
                    );
                  })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={showCustomerDetail} onOpenChange={setShowCustomerDetail}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details: {selectedCustomer?.name}</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-primary">
                          {selectedCustomer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{selectedCustomer.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedCustomer.id}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedCustomer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedCustomer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Joined: {new Date(selectedCustomer.joinDate).toLocaleDateString("en-US")}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Status & Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(selectedCustomer.status)}>{getStatusText(selectedCustomer.status)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Orders:</span>
                      <span className="font-medium">{selectedCustomer.totalOrders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Spent:</span>
                      <span className="font-medium">{selectedCustomer.totalSpent.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Last Order:</span>
                      <span className="font-medium">{selectedCustomer.lastOrder ? new Date(selectedCustomer.lastOrder).toLocaleDateString("en-US") : "None"}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Address */}
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-sm">{selectedCustomer.address}</p>
              </Card>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Customer
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  View Orders
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
