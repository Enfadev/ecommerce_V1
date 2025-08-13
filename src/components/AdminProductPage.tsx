"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminDashboard from "./AdminDashboard";
import AdminProductManagement from "./AdminProductManagement";
import AdminOrderManagement from "./AdminOrderManagement";
import AdminCustomerManagement from "./AdminCustomerManagement";
import InventoryManager from "./InventoryManager";
import AdminSettingsPage from "./AdminSettingsPage";
import { Card } from "./ui/card";
import { Button } from "./ui/button";


function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <p className="text-muted-foreground mt-1">Analyze store performance and business insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Today's Sales</h3>
          <p className="text-3xl font-bold text-green-500">$2,500</p>
          <p className="text-sm text-muted-foreground">+15% from yesterday</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Today's Visitors</h3>
          <p className="text-3xl font-bold text-blue-500">1,234</p>
          <p className="text-sm text-muted-foreground">+8% from yesterday</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Conversion Rate</h3>
          <p className="text-3xl font-bold text-purple-500">3.2%</p>
          <p className="text-sm text-muted-foreground">+0.5% from last month</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Reports</h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Monthly Sales Report
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Best-Selling Product Analysis
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Customer Report
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Website Traffic Analysis
          </Button>
        </div>
      </Card>
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
