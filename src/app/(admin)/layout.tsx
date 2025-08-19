"use client";

import { useState, ReactNode } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import InventoryManager from "@/components/InventoryManager";
import AdminSettingsPage from "@/components/AdminSettingsPage";
import AdminAnalytics from "@/components/AdminAnalytics";
import AdminProductManagement from "./admin/product/AdminProductManagement";
import AdminOrderManagement from "./admin/orders/AdminOrderManagement";
import AdminCustomerManagement from "./admin/customers/page";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeSubTab, setActiveSubTab] = useState("general");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return children;
      case "products":
        return <AdminProductManagement />;
      case "orders":
        return <AdminOrderManagement />;
      case "customers":
        return <AdminCustomerManagement />;
      case "inventory":
        return <InventoryManager />;
      case "analytics":
        return <AdminAnalytics />;
      case "settings":
        return <AdminSettingsPage activeSubTab={activeSubTab} onSubTabChange={setActiveSubTab} />;
      default:
        return children;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
}
