export interface SystemStats {
  users: {
    total: number;
    admins: number;
    customers: number;
    newThisMonth: number;
  };
  orders: {
    total: number;
    revenue: number;
    byStatus: Record<string, number>;
  };
  products: {
    total: number;
    lowStock: number;
  };
  security: {
    recentLogs: Array<{
      id: number;
      action: string;
      description: string;
      user: string;
      ipAddress: string | null;
      status: string;
      createdAt: string;
    }>;
  };
  system: {
    health: {
      database: boolean;
      apiServices: boolean;
      fileStorage: boolean;
      cacheSystem: boolean;
    };
    version: string;
    database: string;
    storage: string;
  };
}

export interface GeneralSettings {
  storeName: string;
  storeDescription: string;
  contactEmail: string;
  phoneNumber: string;
  officeAddress: string;
  timezone: string;
  logoUrl: string | null;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultMetaKeywords: string;
  defaultOgImageUrl: string;
  twitterHandle: string;
  facebookPage: string;
  canonicalBaseUrl: string;
  enableIndexing: boolean;
}

export type SettingsTab = "general" | "pages" | "seo" | "users" | "security" | "system";
export type PageTab = "home" | "about" | "products" | "contact";
