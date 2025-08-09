"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Info, Calendar, Package, Mail } from "lucide-react";
import AdminHomePageEditor from "./AdminHomePageEditor";
import AdminAboutPageEditor from "./AdminAboutPageEditor";
import AdminEventPageEditor from "./AdminEventPageEditor";
import AdminProductPageEditor from "./AdminProductPageEditor";
import AdminContactPageEditor from "./AdminContactPageEditor";

export default function AdminPageManager() {
  const [activeTab, setActiveTab] = useState("home");

  const pageTypes = [
    {
      id: "home",
      name: "Home Page",
      icon: Home,
      description: "Manage homepage content including hero section, features, and testimonials",
    },
    {
      id: "about",
      name: "About Page",
      icon: Info,
      description: "Edit company information, team members, and company story",
    },
    {
      id: "products",
      name: "Product Page",
      icon: Package,
      description: "Configure product listings, categories, and promotional banners",
    },
    {
      id: "events",
      name: "Event Page",
      icon: Calendar,
      description: "Manage events, promotions, and event categories",
    },
    {
      id: "contact",
      name: "Contact Page",
      icon: Mail,
      description: "Update contact information, office locations, and contact methods",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Page Content Manager</h1>
          <p className="text-muted-foreground">
            Manage and edit content for all pages of your website
          </p>
        </div>
      </div>

      {/* Page Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        {pageTypes.map((page) => {
          const IconComponent = page.icon;
          return (
            <Card
              key={page.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                activeTab === page.id ? "ring-2 ring-primary border-primary" : ""
              }`}
              onClick={() => setActiveTab(page.id)}
            >
              <CardContent className="p-4 text-center">
                <IconComponent className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold text-sm">{page.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {page.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Page Editor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {pageTypes.map((page) => {
            const IconComponent = page.icon;
            return (
              <TabsTrigger key={page.id} value={page.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{page.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="home" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Home Page Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdminHomePageEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                About Page Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdminAboutPageEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Page Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdminProductPageEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Page Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdminEventPageEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Page Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdminContactPageEditor />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
