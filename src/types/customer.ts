export interface Customer {
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

export interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  blocked: number;
  newThisMonth: number;
  totalRevenue: number;
}

export interface CustomerApiResponse {
  customers: Customer[];
  stats: CustomerStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CustomerFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
