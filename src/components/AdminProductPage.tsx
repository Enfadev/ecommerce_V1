"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminDashboard from "./AdminDashboard";
import AdminProductManagement from "./AdminProductManagement";
import AdminOrderManagement from "./AdminOrderManagement";
import AdminCustomerManagement from "./AdminCustomerManagement";
import InventoryManager from "./InventoryManager";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Settings, Bell, User, Shield, Database, Mail, Palette, Globe } from "lucide-react";

// Settings Component
function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground mt-1">Kelola pengaturan toko dan sistem</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold">Pengaturan Umum</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nama Toko</label>
              <Input defaultValue="E-Commerce Store" />
            </div>
            <div>
              <label className="text-sm font-medium">Deskripsi</label>
              <Input defaultValue="Toko online terpercaya" />
            </div>
            <div>
              <label className="text-sm font-medium">Email Kontak</label>
              <Input defaultValue="contact@store.com" />
            </div>
            <Button>Simpan Perubahan</Button>
          </div>
        </Card>

        {/* User Management */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold">Manajemen User</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Admin</span>
              <Badge>3</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Pelanggan</span>
              <Badge>1,234</Badge>
            </div>
            <Button variant="outline" className="w-full">
              <User className="w-4 h-4 mr-2" />
              Kelola User
            </Button>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold">Keamanan</h3>
          </div>
          <div className="space-y-4">
            <Button variant="outline" className="w-full">
              <Shield className="w-4 h-4 mr-2" />
              Ubah Password
            </Button>
            <Button variant="outline" className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              Pengaturan Notifikasi
            </Button>
          </div>
        </Card>

        {/* System Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold">Sistem</h3>
          </div>
          <div className="space-y-4">
            <Button variant="outline" className="w-full">
              <Database className="w-4 h-4 mr-2" />
              Backup Data
            </Button>
            <Button variant="outline" className="w-full">
              <Globe className="w-4 h-4 mr-2" />
              API Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Analytics Component
function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Laporan</h1>
        <p className="text-muted-foreground mt-1">Analisis performa toko dan insights bisnis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Penjualan Hari Ini</h3>
          <p className="text-3xl font-bold text-green-500">Rp 2,500,000</p>
          <p className="text-sm text-muted-foreground">+15% dari kemarin</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Pengunjung Hari Ini</h3>
          <p className="text-3xl font-bold text-blue-500">1,234</p>
          <p className="text-sm text-muted-foreground">+8% dari kemarin</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Konversi Rate</h3>
          <p className="text-3xl font-bold text-purple-500">3.2%</p>
          <p className="text-sm text-muted-foreground">+0.5% dari bulan lalu</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Laporan Detail</h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Laporan Penjualan Bulanan
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Analisis Produk Terlaris
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Laporan Pelanggan
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Analisis Traffic Website
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function AdminProductPage() {
  const [activeSection, setActiveSection] = useState("dashboard");

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
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
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
