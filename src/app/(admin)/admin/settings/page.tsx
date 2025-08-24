"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Globe, Shield, Users, Database, Bell, Eye, Save, Key, Palette, Home, Info, Package, MessageCircle } from "lucide-react";
import AdminContactPageEditor from "@/components/AdminContactPageEditor";
import AdminHomePageEditor from "@/components/AdminHomePageEditor";
import AdminAboutPageEditor from "@/components/AdminAboutPageEditor";
import AdminProductPageEditor from "@/components/AdminProductPageEditor";

interface SystemStats {
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

export default function AdminSettingsPage() {
  const [currentTab, setCurrentTab] = useState("general");
  const [pageTab, setPageTab] = useState("home");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "E-Commerce Store",
    storeDescription: "Trusted online store",
    contactEmail: "contact@store.com",
    currency: "USD",
    timezone: "Asia/Jakarta",
    language: "en",
  });

  const [themeSettings, setThemeSettings] = useState({
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    accentColor: "#8b5cf6",
    darkMode: false,
    customCSS: "",
  });

  // Load settings and stats on component mount
  useEffect(() => {
    loadSettings();
    loadStats();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setGeneralSettings(data.settings);
          setThemeSettings({
            primaryColor: data.settings.primaryColor || "#3b82f6",
            secondaryColor: data.settings.secondaryColor || "#64748b",
            accentColor: data.settings.accentColor || "#8b5cf6",
            darkMode: data.settings.darkMode || false,
            customCSS: data.settings.customCSS || "",
          });
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  const handleSaveGeneral = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generalSettings),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert("General settings updated successfully!");
        } else {
          alert("Failed to update settings: " + data.message);
        }
      } else {
        alert("Failed to update settings");
      }
    } catch (error) {
      console.error("Save settings error:", error);
      alert("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTheme = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(themeSettings),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert("Theme settings updated successfully!");
        } else {
          alert("Failed to update theme settings: " + data.message);
        }
      } else {
        alert("Failed to update theme settings");
      }
    } catch (error) {
      console.error("Save theme settings error:", error);
      alert("Failed to update theme settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage store and system settings</p>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Page Management
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Theme
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Store Name</label>
                <Input 
                  value={generalSettings.storeName} 
                  onChange={(e) => setGeneralSettings((prev) => ({ ...prev, storeName: e.target.value }))} 
                  placeholder="Enter store name" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea 
                  value={generalSettings.storeDescription} 
                  onChange={(e) => setGeneralSettings((prev) => ({ ...prev, storeDescription: e.target.value }))} 
                  placeholder="Enter store description" 
                  rows={3} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact Email</label>
                <Input 
                  type="email" 
                  value={generalSettings.contactEmail} 
                  onChange={(e) => setGeneralSettings((prev) => ({ ...prev, contactEmail: e.target.value }))} 
                  placeholder="contact@store.com" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select 
                    value={generalSettings.currency} 
                    onChange={(e) => setGeneralSettings((prev) => ({ ...prev, currency: e.target.value }))} 
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="USD">US Dollar (USD)</option>
                    <option value="IDR">Indonesian Rupiah (IDR)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select 
                    value={generalSettings.language} 
                    onChange={(e) => setGeneralSettings((prev) => ({ ...prev, language: e.target.value }))} 
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="en">English</option>
                    <option value="id">Bahasa Indonesia</option>
                  </select>
                </div>
              </div>
              <Button onClick={handleSaveGeneral} className="w-full" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Page Management */}
        <TabsContent value="pages" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Page Management</h2>
            <p className="text-muted-foreground mb-6">Manage and edit your website pages content</p>
          </div>

          <Tabs value={pageTab} onValueChange={setPageTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="home" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                About
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Contact
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home">
              <AdminHomePageEditor />
            </TabsContent>

            <TabsContent value="about">
              <AdminAboutPageEditor />
            </TabsContent>

            <TabsContent value="products">
              <AdminProductPageEditor />
            </TabsContent>

            <TabsContent value="contact">
              <AdminContactPageEditor />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Total Admins</h4>
                      <p className="text-2xl font-bold">{stats?.users.admins ?? "Loading..."}</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Total Customers</h4>
                      <p className="text-2xl font-bold">{stats?.users.customers ?? "Loading..."}</p>
                    </div>
                    <Badge variant="secondary">Registered</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">New This Month</h4>
                      <p className="text-2xl font-bold">{stats?.users.newThisMonth ?? "Loading..."}</p>
                    </div>
                    <Badge variant="outline">Recent</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Key className="w-4 h-4 mr-2" />
                    Reset User Passwords
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View User Activity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Settings
                </Button>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground mb-4">Enhance your account security with 2FA</p>
                  <Button variant="default" size="sm">
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Security Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.security.recentLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                      <div>
                        <p className="text-sm font-medium">{log.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={log.status === "SUCCESS" ? "default" : log.status === "FAILED" ? "destructive" : "secondary"}>
                        {log.status}
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center text-muted-foreground py-4">
                      Loading security logs...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Database className="w-4 h-4 mr-2" />
                  Backup Data
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  API Settings
                </Button>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">System Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Version:</span>
                      <span>{stats?.system.version || "1.0.0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Database:</span>
                      <span>{stats?.system.database || "MySQL"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage:</span>
                      <span>{stats?.system.storage || "Local"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Connection</span>
                    <Badge variant={stats?.system.health.database ? "default" : "destructive"}>
                      {stats?.system.health.database ? "Online" : "Offline"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Services</span>
                    <Badge variant={stats?.system.health.apiServices ? "default" : "destructive"}>
                      {stats?.system.health.apiServices ? "Running" : "Down"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">File Storage</span>
                    <Badge variant={stats?.system.health.fileStorage ? "default" : "destructive"}>
                      {stats?.system.health.fileStorage ? "Available" : "Unavailable"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cache System</span>
                    <Badge variant={stats?.system.health.cacheSystem ? "default" : "secondary"}>
                      {stats?.system.health.cacheSystem ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Theme Settings */}
        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Theme Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.primaryColor}
                      onChange={(e) => setThemeSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-12 h-10 border rounded"
                    />
                    <Input
                      value={themeSettings.primaryColor}
                      onChange={(e) => setThemeSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Secondary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.secondaryColor}
                      onChange={(e) => setThemeSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-12 h-10 border rounded"
                    />
                    <Input
                      value={themeSettings.secondaryColor}
                      onChange={(e) => setThemeSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      placeholder="#64748b"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.accentColor}
                      onChange={(e) => setThemeSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="w-12 h-10 border rounded"
                    />
                    <Input
                      value={themeSettings.accentColor}
                      onChange={(e) => setThemeSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                      placeholder="#8b5cf6"
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={themeSettings.darkMode}
                      onChange={(e) => setThemeSettings(prev => ({ ...prev, darkMode: e.target.checked }))}
                    />
                    <span className="text-sm font-medium">Enable Dark Mode by Default</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Custom CSS</label>
                  <Textarea
                    value={themeSettings.customCSS}
                    onChange={(e) => setThemeSettings(prev => ({ ...prev, customCSS: e.target.value }))}
                    placeholder="/* Add custom CSS here */"
                    rows={4}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <Button onClick={handleSaveTheme} className="w-full" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Theme"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
