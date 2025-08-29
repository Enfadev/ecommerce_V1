"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/components/contexts/auth-context";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // User not logged in, redirect to signin
        router.replace("/signin");
      } else if (user.role !== "ADMIN") {
        // User logged in but not admin, redirect to main page
        router.replace("/");
      }
    }
  }, [user, isLoading, router]);

  // Don't render anything while loading or if not admin
  if (isLoading || !user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </div>

      <Toaster />
    </div>
  );
}
