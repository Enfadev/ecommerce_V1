"use client";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import OrderDetailModal from "./OrderDetailModal";
import AdvancedFilterModal, { FilterOptions } from "./AdvancedFilterModal";
import { Search, Package, Truck, CheckCircle, XCircle, Clock, Calendar, Receipt, Eye, Download, Filter, ArrowUpDown, ShoppingBag, MapPin, CreditCard, RefreshCw, X } from "lucide-react";

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returned";

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  image?: string;
  variant?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  shippingAddress?: string;
  paymentMethod?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
}


async function fetchOrderHistory(): Promise<Order[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          orderNumber: "ORD-2024-001",
          date: "2025-07-20",
          status: "Delivered",
          total: 1150,
          trackingNumber: "JNE123456789",
          estimatedDelivery: "2025-07-22",
          shippingAddress: "123 Sudirman St, Central Jakarta",
          paymentMethod: "Credit Card",
          items: [
            { id: "1", name: "Premium Plain T-Shirt", qty: 2, price: 250, variant: "Black, Size L" },
            { id: "2", name: "Baseball Cap", qty: 1, price: 650, variant: "Navy Blue" },
          ],
        },
        {
          id: "2",
          orderNumber: "ORD-2024-002",
          date: "2025-07-18",
          status: "Shipped",
          total: 320,
          trackingNumber: "SICEPAT987654321",
          estimatedDelivery: "2025-07-23",
          shippingAddress: "456 Gatot Subroto St, South Jakarta",
          paymentMethod: "Bank Transfer",
          items: [
            { id: "3", name: "Slim Fit Jeans", qty: 1, price: 280, variant: "Blue, Size 32" },
            { id: "4", name: "Leather Belt", qty: 1, price: 40, variant: "Brown" },
          ],
        },
        {
          id: "3",
          orderNumber: "ORD-2024-003",
          date: "2025-07-15",
          status: "Processing",
          total: 150,
          shippingAddress: "789 Thamrin St, Central Jakarta",
          paymentMethod: "E-Wallet",
          items: [{ id: "5", name: "Oversize Hoodie", qty: 1, price: 150, variant: "Grey, Size XL" }],
        },
        {
          id: "4",
          orderNumber: "ORD-2024-004",
          date: "2025-07-10",
          status: "Cancelled",
          total: 85,
          shippingAddress: "321 Kuningan St, South Jakarta",
          paymentMethod: "Credit Card",
          items: [{ id: "6", name: "Casual Shirt", qty: 1, price: 85, variant: "White, Size M" }],
          notes: "Cancelled due to out of stock",
        },
        {
          id: "5",
          orderNumber: "ORD-2024-005",
          date: "2025-07-08",
          status: "Pending",
          total: 275,
          shippingAddress: "654 Senopati St, South Jakarta",
          paymentMethod: "Bank Transfer",
          items: [{ id: "7", name: "Sneakers Shoes", qty: 1, price: 275, variant: "White, Size 42" }],
        },
        {
          id: "6",
          orderNumber: "ORD-2024-006",
          date: "2025-07-05",
          status: "Returned",
          total: 195,
          shippingAddress: "987 Rasuna Said St, South Jakarta",
          paymentMethod: "E-Wallet",
          items: [{ id: "8", name: "Bomber Jacket", qty: 1, price: 195, variant: "Black, Size L" }],
          notes: "Item did not meet expectations",
        },
      ]);
    }, 1200);
  });
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({
    searchQuery: "",
    status: "all",
    minAmount: undefined,
    maxAmount: undefined,
    paymentMethod: "all",
  });


  const statusConfig = {
    Pending: {
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      description: "Waiting for Confirmation",
    },
    Processing: {
      icon: Package,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      description: "Processing",
    },
    Shipped: {
      icon: Truck,
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      description: "Shipped",
    },
    Delivered: {
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      description: "Order Completed",
    },
    Cancelled: {
      icon: XCircle,
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      description: "Cancelled",
    },
    Returned: {
      icon: RefreshCw,
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      description: "Returned",
    },
  };


  useEffect(() => {
    fetchOrderHistory()
      .then((data) => {
        setOrders(data);
        setFilteredOrders(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load order history.");
        setLoading(false);
      });
  }, []);


  useEffect(() => {
    if (!orders) return;

    let filtered = [...orders];


    const searchTerm = searchQuery || advancedFilters.searchQuery;
    if (searchTerm) {
      filtered = filtered.filter((order) => order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }


    const statusToFilter = statusFilter !== "all" ? statusFilter : advancedFilters.status;
    if (statusToFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusToFilter);
    }


    if (advancedFilters.minAmount) {
      filtered = filtered.filter((order) => order.total >= advancedFilters.minAmount!);
    }
    if (advancedFilters.maxAmount) {
      filtered = filtered.filter((order) => order.total <= advancedFilters.maxAmount!);
    }


    if (advancedFilters.paymentMethod !== "all") {
      filtered = filtered.filter((order) => order.paymentMethod === advancedFilters.paymentMethod);
    }


    if (selectedTab !== "all") {
      filtered = filtered.filter((order) => order.status === selectedTab);
    }


    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "total-desc":
          return b.total - a.total;
        case "total-asc":
          return a.total - b.total;
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter, sortBy, selectedTab, advancedFilters]);


  const getOrderCounts = () => {
    if (!orders) return {};
    return orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const orderCounts = getOrderCounts();


  const handleOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };


  const handleCloseDetail = () => {
    setSelectedOrder(null);
    setIsDetailModalOpen(false);
  };


  const handleAdvancedFilterChange = (newFilters: FilterOptions) => {
    setAdvancedFilters(newFilters);

    if (newFilters.searchQuery) setSearchQuery("");
    if (newFilters.status !== "all") setStatusFilter("all");
  };

  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-9 w-20" />
            </div>

            {/* Statistics Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="text-center space-y-2">
                    <Skeleton className="h-6 w-8 mx-auto" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Filters Skeleton */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Skeleton className="h-10 flex-1" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-[150px]" />
                <Skeleton className="h-10 w-[150px]" />
                <Skeleton className="h-10 w-[140px]" />
              </div>
            </div>
          </Card>

          {/* Tabs Skeleton */}
          <div className="grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>

          {/* Orders List Skeleton */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Skeleton className="h-7 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-px w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <ShoppingBag className="h-8 w-8" />
              Order History
            </h1>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{orders?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
              </div>
            </Card>
            {Object.keys(statusConfig).map((status) => (
              <Card key={status} className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{orderCounts[status] || 0}</div>
                  <div className="text-sm text-muted-foreground">{statusConfig[status as keyof typeof statusConfig].description}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search order number or product name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <SelectItem key={status} value={status}>
                      {config.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest</SelectItem>
                  <SelectItem value="date-asc">Oldest</SelectItem>
                  <SelectItem value="total-desc">Highest Total</SelectItem>
                  <SelectItem value="total-asc">Lowest Total</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>

              <AdvancedFilterModal onApplyFilters={handleAdvancedFilterChange} currentFilters={advancedFilters} />
            </div>
          </div>
        </Card>

        {/* Tabs for quick filtering */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all" className="text-xs">
              All ({orders?.length || 0})
            </TabsTrigger>
            {Object.entries(statusConfig).map(([status]) => (
              <TabsTrigger key={status} value={status} className="text-xs">
                {status} ({orderCounts[status] || 0})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders && filteredOrders.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto space-y-4">
                {searchQuery ||
                statusFilter !== "all" ||
                selectedTab !== "all" ||
                advancedFilters.searchQuery ||
                advancedFilters.status !== "all" ||
                advancedFilters.minAmount ||
                advancedFilters.maxAmount ||
                advancedFilters.paymentMethod !== "all" ? (
                  <>
                    <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">No orders found</h3>
                      <p className="text-muted-foreground">Try changing your search or remove some filter criteria to see more results.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                          setSelectedTab("all");
                          setAdvancedFilters({
                            searchQuery: "",
                            status: "all",
                            minAmount: undefined,
                            maxAmount: undefined,
                            paymentMethod: "all",
                          });
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear Filter
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                      <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">No order history yet</h3>
                      <p className="text-muted-foreground">Your orders will appear here after you shop. Start exploring our products now!</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button className="bg-primary hover:bg-primary/90">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Start Shopping
                      </Button>
                      <Button variant="outline">View Catalog</Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          ) : (
            filteredOrders?.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;
              return (
                <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="space-y-4">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-foreground">{order.orderNumber}</h3>
                          <Badge className={statusConfig[order.status].color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(order.date)}
                          </div>
                          {order.trackingNumber && (
                            <div className="flex items-center gap-1">
                              <Truck className="h-4 w-4" />
                              {order.trackingNumber}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{formatCurrency(order.total)}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.items.length} item{order.items.length > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{item.name}</div>
                            {item.variant && <div className="text-sm text-muted-foreground">{item.variant}</div>}
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{item.qty}x</div>
                            <div className="text-sm text-muted-foreground">{formatCurrency(item.price)}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Additional Info */}
                    {(order.shippingAddress || order.paymentMethod || order.estimatedDelivery) && (
                      <>
                        <Separator />
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          {order.shippingAddress && (
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <div className="font-medium">Shipping Address</div>
                                <div className="text-muted-foreground">{order.shippingAddress}</div>
                              </div>
                            </div>
                          )}
                          {order.paymentMethod && (
                            <div className="flex items-start gap-2">
                              <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <div className="font-medium">Payment Method</div>
                                <div className="text-muted-foreground">{order.paymentMethod}</div>
                              </div>
                            </div>
                          )}
                          {order.estimatedDelivery && (
                            <div className="flex items-start gap-2">
                              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <div className="font-medium">Estimated Arrival</div>
                                <div className="text-muted-foreground">{formatDate(order.estimatedDelivery)}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Notes */}
                    {order.notes && (
                      <>
                        <Separator />
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <div className="text-sm">
                            <span className="font-medium">Note: </span>
                            <span className="text-muted-foreground">{order.notes}</span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleOrderDetail(order)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {order.status === "Delivered" && (
                        <Button variant="outline" size="sm">
                          <Receipt className="h-4 w-4 mr-2" />
                          Buy Again
                        </Button>
                      )}
                      {order.trackingNumber && order.status === "Shipped" && (
                        <Button variant="default" size="sm">
                          <Truck className="h-4 w-4 mr-2" />
                          Track Package
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Order Detail Modal */}
        <OrderDetailModal order={selectedOrder} isOpen={isDetailModalOpen} onClose={handleCloseDetail} />
      </div>
    </div>
  );
}
