"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Settings, 
  Globe, 
  Shield, 
  Users, 
  Database,
  Bell,
  Eye,
  Save,
  Key,
  Palette,
  Home,
  Info,
  Package,
  MessageCircle
} from "lucide-react";
import AdminContactPageEditor from "./AdminContactPageEditor";
import AdminHomePageEditor from "./AdminHomePageEditor";
import AdminAboutPageEditor from "./AdminAboutPageEditor";
import AdminProductPageEditor from "./AdminProductPageEditor";

export default function AdminSettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "E-Commerce Store",
    storeDescription: "Trusted online store",
    contactEmail: "contact@store.com",
    currency: "IDR",
    timezone: "Asia/Jakarta",
    language: "id"
  });

  const [themeSettings, setThemeSettings] = useState({
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    accentColor: "#8b5cf6",
    darkMode: false,
    customCSS: ""
  });

  const handleSaveGeneral = async () => {
    console.log("Saving general settings:", generalSettings);
  };

  const handleSaveTheme = async () => {
    console.log("Saving theme settings:", themeSettings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage store and system settings</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
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
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, storeName: e.target.value }))}
                  placeholder="Enter store name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={generalSettings.storeDescription}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, storeDescription: e.target.value }))}
                  placeholder="Enter store description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact Email</label>
                <Input
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="contact@store.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select
                    value={generalSettings.currency}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="IDR">Indonesian Rupiah (IDR)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select
                    value={generalSettings.language}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              <Button onClick={handleSaveGeneral} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
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

          <Tabs defaultValue="home" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
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
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Total Customers</h4>
                      <p className="text-2xl font-bold">1,234</p>
                    </div>
                    <Badge variant="secondary">Registered</Badge>
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
                  <p className="text-sm text-muted-foreground mb-4">
                    Enhance your account security with 2FA
                  </p>
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
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                    <div>
                      <p className="text-sm font-medium">Login from Jakarta</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                    <Badge variant="default">Success</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                    <div>
                      <p className="text-sm font-medium">Password change</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                    <Badge variant="secondary">Activity</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                    <div>
                      <p className="text-sm font-medium">Failed login attempt</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                    <Badge variant="destructive">Failed</Badge>
                  </div>
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
                      <span>1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Database:</span>
                      <span>MySQL</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage:</span>
                      <span>Local</span>
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
                    <Badge variant="default">Online</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Services</span>
                    <Badge variant="default">Running</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">File Storage</span>
                    <Badge variant="default">Available</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cache System</span>
                    <Badge variant="secondary">Disabled</Badge>
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
              <Button onClick={handleSaveTheme} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Theme
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
