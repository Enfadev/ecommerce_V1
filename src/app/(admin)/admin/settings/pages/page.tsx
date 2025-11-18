"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Info, Package, MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic imports for page editors
const AdminHomePageEditor = dynamic(() => import("@/components/admin/page-editors/HomePageEditor"), {
  loading: () => <div className="p-8 text-center text-muted-foreground">Loading editor...</div>,
});

const AdminAboutPageEditor = dynamic(() => import("@/components/admin/page-editors/AboutPageEditor"), {
  loading: () => <div className="p-8 text-center text-muted-foreground">Loading editor...</div>,
});

const AdminProductPageEditor = dynamic(() => import("@/components/admin/page-editors/ProductPageEditor"), {
  loading: () => <div className="p-8 text-center text-muted-foreground">Loading editor...</div>,
});

const AdminContactPageEditor = dynamic(() => import("@/components/admin/page-editors/ContactPageEditor"), {
  loading: () => <div className="p-8 text-center text-muted-foreground">Loading editor...</div>,
});

type PageTab = "home" | "about" | "products" | "contact";

export default function PageManagementPage() {
  const [activeTab, setActiveTab] = useState<PageTab>("home");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Page Management</h2>
        <p className="text-muted-foreground mt-1">Manage and edit your website pages content</p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PageTab)}>
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

        <TabsContent value="home" className="mt-6">
          <AdminHomePageEditor />
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <AdminAboutPageEditor />
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <AdminProductPageEditor />
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <AdminContactPageEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
