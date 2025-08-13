"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminDashboard from "./AdminDashboard";
import AdminProductManagement from "./AdminProductManagement";
import AdminOrderManagement from "./AdminOrderManagement";
import AdminCustomerManagement from "./AdminCustomerManagement";
import InventoryManager from "./InventoryManager";
import AdminSettingsPage from "./AdminSettingsPage";
import { Button } from "./ui/button";

function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <p className="text-muted-foreground mt-1">Analyze store performance and business insights</p>
      </div>

      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-4">Analytics Dashboard Coming Soon</h3>
        <p className="text-muted-foreground mb-6">
          Advanced analytics features are currently in development. You can view basic analytics in the Dashboard section.
        </p>
        <Button variant="outline">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}

export default function AdminProductPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeSubTab, setActiveSubTab] = useState("general");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
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
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
}
