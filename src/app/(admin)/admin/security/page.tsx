"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle, Lock, Key, Eye, Settings } from "lucide-react";
import AdminSecurityTest from "@/components/admin/AdminSecurityTest";
import AdminSecurityLogs from "@/components/admin/AdminSecurityLogs";

export default function AdminSecurityPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const securityFeatures = [
    {
      name: "JWT Token Authentication",
      status: "active",
      description: "Secure token-based authentication with HTTP-only cookies",
      icon: Key,
    },
    {
      name: "Role-Based Access Control",
      status: "active",
      description: "Admin role verification at middleware and component level",
      icon: Lock,
    },
    {
      name: "Route Protection",
      status: "active",
      description: "Middleware protection for all admin routes and APIs",
      icon: Shield,
    },
    {
      name: "Client-Side Guards",
      status: "active",
      description: "React components with authentication state checking",
      icon: Eye,
    },
    {
      name: "Security Logging",
      status: "active",
      description: "Comprehensive logging of admin access attempts",
      icon: Settings,
    },
  ];

  const securityChecklist = [
    {
      name: "Admin routes protected by middleware",
      checked: true,
      description: "All /admin/* routes require authentication and admin role",
    },
    {
      name: "API endpoints secured",
      checked: true,
      description: "All /api/admin/* endpoints require authentication and admin role",
    },
    {
      name: "Client-side protection",
      checked: true,
      description: "React components verify user authentication before rendering",
    },
    {
      name: "Proper logout functionality",
      checked: true,
      description: "Secure logout that clears tokens and redirects appropriately",
    },
    {
      name: "Session validation",
      checked: true,
      description: "JWT tokens are validated on every protected request",
    },
    {
      name: "Security monitoring",
      checked: true,
      description: "Failed access attempts are logged and monitored",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Center</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage admin security settings.</p>
        </div>
        <Badge variant="default" className="bg-green-500">
          <Shield className="h-3 w-3 mr-1" />
          Secure
        </Badge>
      </div>

      {/* Security Status Alert */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>All security measures are active. Admin access is properly protected with multiple layers of authentication and authorization.</AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="logs">Access Logs</TabsTrigger>
          <TabsTrigger value="test">Security Test</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Security Status
              </h3>
              <div className="space-y-3">
                {securityChecklist.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1 rounded-full ${item.checked ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{item.checked ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}</div>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-500" />
                Protection Layers
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-sm">Middleware Protection</h4>
                  <p className="text-xs text-muted-foreground mt-1">Server-side route protection before requests reach components</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-sm">Layout Guards</h4>
                  <p className="text-xs text-muted-foreground mt-1">Client-side authentication checks in admin layout</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-sm">Component Guards</h4>
                  <p className="text-xs text-muted-foreground mt-1">Individual component-level authentication verification</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-sm">{feature.name}</h4>
                        <Badge variant={feature.status === "active" ? "default" : "secondary"} className="text-xs">
                          {feature.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <AdminSecurityLogs />
        </TabsContent>

        <TabsContent value="test" className="mt-6">
          <AdminSecurityTest />
        </TabsContent>
      </Tabs>
    </div>
  );
}
