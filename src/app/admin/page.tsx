"use client";
import AdminProductPage from "@/components/AdminProductPage";
import { useAuth } from "@/components/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;
  if (user.role !== "ADMIN") return null;

  return <AdminProductPage />;
}
