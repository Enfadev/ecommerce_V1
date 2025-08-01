"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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

// Enhanced dummy data with more realistic orders
async function fetchOrderHistory(): Promise<Order[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          orderNumber: "ORD-2024-001",
          date: "2025-07-20",
          status: "Delivered",
          total: 450000,
          trackingNumber: "JNE123456789",
          estimatedDelivery: "2025-07-22",
          shippingAddress: "Jl. Sudirman No. 123, Jakarta Pusat",
          paymentMethod: "Credit Card",
          items: [
            { id: "1", name: "Kaos Polos Premium", qty: 2, price: 125000, variant: "Hitam, Size L" },
            { id: "2", name: "Topi Baseball Cap", qty: 1, price: 200000, variant: "Navy Blue" },
          ],
        },
        {
          id: "2",
          orderNumber: "ORD-2024-002",
          date: "2025-07-18",
          status: "Shipped",
          total: 320000,
          trackingNumber: "SICEPAT987654321",
          estimatedDelivery: "2025-07-23",
          shippingAddress: "Jl. Gatot Subroto No. 456, Jakarta Selatan",
          paymentMethod: "Bank Transfer",
          items: [
            { id: "3", name: "Celana Jeans Slim Fit", qty: 1, price: 280000, variant: "Blue, Size 32" },
            { id: "4", name: "Ikat Pinggang Kulit", qty: 1, price: 40000, variant: "Brown" },
          ],
        },
        {
          id: "3",
          orderNumber: "ORD-2024-003",
          date: "2025-07-15",
          status: "Processing",
          total: 150000,
          shippingAddress: "Jl. Thamrin No. 789, Jakarta Pusat",
          paymentMethod: "E-Wallet",
          items: [{ id: "5", name: "Hoodie Oversize", qty: 1, price: 150000, variant: "Grey, Size XL" }],
        },
        {
          id: "4",
          orderNumber: "ORD-2024-004",
          date: "2025-07-10",
          status: "Cancelled",
          total: 85000,
          shippingAddress: "Jl. Kuningan No. 321, Jakarta Selatan",
          paymentMethod: "Credit Card",
          items: [{ id: "6", name: "Kemeja Casual", qty: 1, price: 85000, variant: "White, Size M" }],
          notes: "Dibatalkan karena stok habis",
        },
        {
          id: "5",
          orderNumber: "ORD-2024-005",
          date: "2025-07-08",
          status: "Pending",
          total: 275000,
          shippingAddress: "Jl. Senopati No. 654, Jakarta Selatan",
          paymentMethod: "Bank Transfer",
          items: [{ id: "7", name: "Sepatu Sneakers", qty: 1, price: 275000, variant: "White, Size 42" }],
        },
        {
          id: "6",
          orderNumber: "ORD-2024-006",
          date: "2025-07-05",
          status: "Returned",
          total: 195000,
          shippingAddress: "Jl. Rasuna Said No. 987, Jakarta Selatan",
          paymentMethod: "E-Wallet",
          items: [{ id: "8", name: "Jaket Bomber", qty: 1, price: 195000, variant: "Black, Size L" }],
          notes: "Barang tidak sesuai ekspektasi",
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

  // Status configuration with colors and icons
  const statusConfig = {
    Pending: {
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      description: "Menunggu Konfirmasi",
    },
    Processing: {
      icon: Package,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      description: "Sedang Diproses",
    },
    Shipped: {
      icon: Truck,
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      description: "Dalam Pengiriman",
    },
    Delivered: {
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      description: "Pesanan Selesai",
    },
    Cancelled: {
      icon: XCircle,
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      description: "Dibatalkan",
    },
    Returned: {
      icon: RefreshCw,
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      description: "Dikembalikan",
    },
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrderHistory()
      .then((data) => {
        setOrders(data);
        setFilteredOrders(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat riwayat pesanan.");
        setLoading(false);
      });
  }, []);

  // Filter and sort orders
  useEffect(() => {
    if (!orders) return;

    let filtered = [...orders];

    // Apply search filter (from both basic and advanced)
    const searchTerm = searchQuery || advancedFilters.searchQuery;
    if (searchTerm) {
      filtered = filtered.filter((order) => order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }

    // Apply status filter (from both basic and advanced)
    const statusToFilter = statusFilter !== "all" ? statusFilter : advancedFilters.status;
    if (statusToFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusToFilter);
    }

    // Apply amount filters (advanced only)
    if (advancedFilters.minAmount) {
      filtered = filtered.filter((order) => order.total >= advancedFilters.minAmount!);
    }
    if (advancedFilters.maxAmount) {
      filtered = filtered.filter((order) => order.total <= advancedFilters.maxAmount!);
    }

    // Apply payment method filter (advanced only)
    if (advancedFilters.paymentMethod !== "all") {
      filtered = filtered.filter((order) => order.paymentMethod === advancedFilters.paymentMethod);
    }

    // Apply tab filter
    if (selectedTab !== "all") {
      filtered = filtered.filter((order) => order.status === selectedTab);
    }

    // Apply sorting
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

  // Get order counts by status
  const getOrderCounts = () => {
    if (!orders) return {};
    return orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const orderCounts = getOrderCounts();

  // Handle opening order detail
  const handleOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // Handle closing order detail
  const handleCloseDetail = () => {
    setSelectedOrder(null);
    setIsDetailModalOpen(false);
  };

  // Handle advanced filter changes
  const handleAdvancedFilterChange = (newFilters: FilterOptions) => {
    setAdvancedFilters(newFilters);
    // Clear basic filters when advanced filters are applied
    if (newFilters.searchQuery) setSearchQuery("");
    if (newFilters.status !== "all") setStatusFilter("all");
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
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
              Riwayat Pesanan
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
                <div className="text-sm text-muted-foreground">Total Pesanan</div>
              </div>
            </Card>
            {Object.entries(statusConfig).map(([status, config]) => (
              <Card key={status} className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{orderCounts[status] || 0}</div>
                  <div className="text-sm text-muted-foreground">{config.description}</div>
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
              <Input placeholder="Cari nomor pesanan atau nama produk..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
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
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Terbaru</SelectItem>
                  <SelectItem value="date-asc">Terlama</SelectItem>
                  <SelectItem value="total-desc">Total Tertinggi</SelectItem>
                  <SelectItem value="total-asc">Total Terendah</SelectItem>
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
              Semua ({orders?.length || 0})
            </TabsTrigger>
            {Object.entries(statusConfig).map(([status, config]) => (
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
                      <h3 className="text-xl font-semibold text-foreground">Tidak ada pesanan ditemukan</h3>
                      <p className="text-muted-foreground">Coba ubah filter pencarian atau hapus beberapa kriteria filter untuk melihat lebih banyak hasil.</p>
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
                        Hapus Filter
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                      <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">Belum ada riwayat pesanan</h3>
                      <p className="text-muted-foreground">Pesanan Anda akan muncul di sini setelah Anda berbelanja. Mulai jelajahi produk kami sekarang!</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button className="bg-primary hover:bg-primary/90">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Mulai Belanja
                      </Button>
                      <Button variant="outline">Lihat Katalog</Button>
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
                                <div className="font-medium">Alamat Pengiriman</div>
                                <div className="text-muted-foreground">{order.shippingAddress}</div>
                              </div>
                            </div>
                          )}
                          {order.paymentMethod && (
                            <div className="flex items-start gap-2">
                              <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <div className="font-medium">Metode Pembayaran</div>
                                <div className="text-muted-foreground">{order.paymentMethod}</div>
                              </div>
                            </div>
                          )}
                          {order.estimatedDelivery && (
                            <div className="flex items-start gap-2">
                              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <div className="font-medium">Estimasi Tiba</div>
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
                            <span className="font-medium">Catatan: </span>
                            <span className="text-muted-foreground">{order.notes}</span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleOrderDetail(order)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Lihat Detail
                      </Button>
                      {order.status === "Delivered" && (
                        <Button variant="outline" size="sm">
                          <Receipt className="h-4 w-4 mr-2" />
                          Beli Lagi
                        </Button>
                      )}
                      {order.trackingNumber && order.status === "Shipped" && (
                        <Button variant="default" size="sm">
                          <Truck className="h-4 w-4 mr-2" />
                          Lacak Paket
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
