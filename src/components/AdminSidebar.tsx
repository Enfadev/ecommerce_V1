"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Package2, ChevronLeft, ChevronRight, Bell, Search, LogOut, Settings, ChevronDown, ChevronUp, Home, Info, Calendar, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface SubMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string | null;
  href: string;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null, href: "/admin" },
  { id: "products", label: "Products", icon: Package, badge: null, href: "/admin/product" },
  { id: "orders", label: "Orders", icon: ShoppingCart, badge: "12", href: "/admin/orders" },
  { id: "customers", label: "Customers", icon: Users, badge: null, href: "/admin/customers" },
  { id: "inventory", label: "Inventory", icon: Package2, badge: null, href: "/admin/inventory" },
  { id: "analytics", label: "Analytics", icon: BarChart3, badge: null, href: "/admin/analytics" },
  { 
    id: "settings", 
    label: "Settings", 
    icon: Settings, 
    badge: null, 
    href: "/admin/settings",
    subItems: [
      { id: "edit-home", label: "Edit Home Page", icon: Home, href: "/admin/settings/edit-home" },
      { id: "edit-about", label: "Edit About Page", icon: Info, href: "/admin/settings/edit-about" },
      { id: "edit-products", label: "Edit Products Page", icon: Package, href: "/admin/settings/edit-products" },
      { id: "edit-events", label: "Edit Events Page", icon: Calendar, href: "/admin/settings/edit-events" },
      { id: "edit-contact", label: "Edit Contact Page", icon: Mail, href: "/admin/settings/edit-contact" },
      { id: "general-settings", label: "General Settings", icon: Settings, href: "/admin/settings/general" },
    ]
  },
];

export default function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (section: string, href: string) => {
    onSectionChange(section);
    
    if (pathname === "/admin" || pathname === "/admin/product" || pathname.startsWith("/admin/")) {
      
      return;
    }
    router.push(href);
  };

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
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
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const isExpanded = expandedMenus.includes(item.id);
          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <div key={item.id}>
              {/* Main Menu Item */}
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  isCollapsed && "px-2 justify-center",
                  isActive && "bg-primary text-primary-foreground shadow-sm"
                )}
                onClick={() => {
                  if (hasSubItems && !isCollapsed) {
                    toggleSubmenu(item.id);
                  } else {
                    handleNavigation(item.id, item.href);
                  }
                }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant={isActive ? "secondary" : "outline"} className="h-5 px-1.5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    {hasSubItems && (
                      <div className="ml-auto">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </>
                )}
              </Button>

              {/* Submenu Items */}
              {hasSubItems && isExpanded && !isCollapsed && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.subItems!.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = activeSection === subItem.id;

                    return (
                      <Button
                        key={subItem.id}
                        variant={isSubActive ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "w-full justify-start gap-2 h-8 text-sm",
                          isSubActive && "bg-primary text-primary-foreground shadow-sm"
                        )}
                        onClick={() => handleNavigation(subItem.id, subItem.href)}
                      >
                        <SubIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 text-left">{subItem.label}</span>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        {!isCollapsed && (
          <Card className="p-3 bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-primary-foreground">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
              </div>
            </div>
          </Card>
        )}

        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="flex-1" title="Notifications">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="flex-1" title="Logout" onClick={() => router.push("/")}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
