"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Info, Package, Calendar, Mail, Settings, ArrowRight } from "lucide-react";

export default function AdminSettings() {
  const router = useRouter();

  const settingsOptions = [
    {
      id: "edit-home",
      title: "Edit Home Page",
      description: "Manage homepage content, hero sections, and featured products",
      icon: Home,
      href: "/admin/settings/edit-home",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      id: "edit-about",
      title: "Edit About Page",
      description: "Update company information, team members, and company story",
      icon: Info,
      href: "/admin/settings/edit-about",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      id: "edit-products",
      title: "Edit Products Page",
      description: "Configure product categories, filters, and promotional banners",
      icon: Package,
      href: "/admin/settings/edit-products",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      id: "edit-events",
      title: "Edit Events Page",
      description: "Manage events, promotions, and event categories",
      icon: Calendar,
      href: "/admin/settings/edit-events",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      id: "edit-contact",
      title: "Edit Contact Page",
      description: "Update contact information, office locations, and business hours",
      icon: Mail,
      href: "/admin/settings/edit-contact",
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      id: "general",
      title: "General Settings",
      description: "Configure general website settings and preferences",
      icon: Settings,
      href: "/admin/settings/general",
      color: "text-gray-600",
      bgColor: "bg-gray-100"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings & Page Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your website content and configure system settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsOptions.map((option) => {
          const IconComponent = option.icon;
          
          return (
            <Card 
              key={option.id} 
              className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20"
              onClick={() => router.push(option.href)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${option.bgColor}`}>
                    <IconComponent className={`h-5 w-5 ${option.color}`} />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {option.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  {option.description}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  <span>Configure</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-blue-600">5</h3>
            <p className="text-sm text-muted-foreground">Editable Pages</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-green-600">✓</h3>
            <p className="text-sm text-muted-foreground">All Pages Configured</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-purple-600">Live</h3>
            <p className="text-sm text-muted-foreground">Real-time Updates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-orange-600">Easy</h3>
            <p className="text-sm text-muted-foreground">User-friendly Interface</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
