"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/contexts/auth-context";
import { useOrders } from "@/hooks/useOrders";
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Package2, ChevronLeft, ChevronRight, Bell, Search, LogOut, Settings, Home, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string | null;
}

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin", badge: null },
  { id: "products", label: "Products", icon: Package, href: "/admin/product", badge: null },
  { id: "orders", label: "Orders", icon: ShoppingCart, href: "/admin/orders", badge: "12" },
  { id: "customers", label: "Customers", icon: Users, href: "/admin/customers", badge: null },
  { id: "inventory", label: "Inventory", icon: Package2, href: "/admin/inventory", badge: null },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/admin/analytics", badge: null },
  { id: "security", label: "Security", icon: Shield, href: "/admin/security", badge: null },
  { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings", badge: null },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { stats } = useOrders();

  const isActiveRoute = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even if signOut fails
      // Force redirect even if signOut fails
      router.push("/signin");
    }
  };

  return (
    <div className={cn("relative h-screen bg-background border-r border-border transition-all duration-300 flex flex-col", isCollapsed ? "w-16" : "w-64")}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">E-Commerce</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="ml-auto">
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search menu..." className="pl-10 h-9" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Back to Home Button */}
        <Link href="/">
          <Button variant="outline" className={cn("w-full justify-start gap-3 h-10 border-dashed", isCollapsed && "px-2 justify-center")}>
            <Home className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="flex-1 text-left">Back to Home</span>}
          </Button>
        </Link>

        {/* Divider */}
        <div className="border-t border-border my-2"></div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.href);
          const badgeValue = item.id === "orders" ? stats.total : item.badge;

          return (
            <Link key={item.id} href={item.href}>
              <Button variant={isActive ? "default" : "ghost"} className={cn("w-full justify-start gap-3 h-10", isCollapsed && "px-2 justify-center", isActive && "bg-primary text-primary-foreground shadow-sm")}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {badgeValue ? (
                      <Badge variant={isActive ? "secondary" : "outline"} className="h-5 px-1.5 text-xs">
                        {badgeValue}
                      </Badge>
                    ) : null}
                  </>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        {!isCollapsed && (
          <Card className="p-3 bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-primary-foreground">{user?.name?.charAt(0).toUpperCase() || "A"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || "Admin User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || "admin@example.com"}</p>
              </div>
            </div>
          </Card>
        )}

        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="flex-1" title="Notifications">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="flex-1" title="Logout" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
