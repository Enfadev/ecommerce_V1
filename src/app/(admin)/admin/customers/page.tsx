"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, Edit, Trash2, Users, Mail, Phone, Calendar, MoreHorizontal, ArrowUpDown, UserPlus, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminExportButton } from "@/components/AdminExportButton";

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
    }, 300); // Debounce search

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

      // Remove customer from local state
      setCustomers(customers.filter((customer) => customer.id !== customerId));

      // Refresh stats
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
          <AdminExportButton 
            data={filteredCustomers as unknown as Record<string, unknown>[]} 
            filename={`customers-${new Date().toISOString().split('T')[0]}`}
            type="customers"
            className=""
          />
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

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name, email, phone, or ID..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Status: {selectedStatus === "all" ? "All" : getStatusText(selectedStatus)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statusOptions.map((status) => (
                  <DropdownMenuItem key={status} onClick={() => setSelectedStatus(status)}>
                    {status === "all" ? "All Status" : getStatusText(status)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("id")} className="gap-1 p-0 h-auto">
                  Customer ID
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("name")} className="gap-1 p-0 h-auto">
                  Name
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("totalOrders")} className="gap-1 p-0 h-auto">
                  Total Orders
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("totalSpent")} className="gap-1 p-0 h-auto">
                  Total Spent
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("joinDate")} className="gap-1 p-0 h-auto">
                  Joined
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{customer.id}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-center">
                    <p className="font-medium">{customer.totalOrders}</p>
                    <p className="text-sm text-muted-foreground">orders</p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{customer.totalSpent.toLocaleString("en-US", { style: "currency", currency: "USD" })}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(customer.status)}>{getStatusText(customer.status)}</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {new Date(customer.joinDate).toLocaleDateString("id-ID")}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString("id-ID") : "-"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewDetail(customer)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                      {["active", "inactive", "blocked"].map((status) => (
                        <DropdownMenuItem key={status} onClick={() => handleStatusChange(customer.id, status as Customer["status"])} disabled={customer.status === status}>
                          {getStatusText(status)}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDeleteCustomer(customer.id)} className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
