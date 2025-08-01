"use client";
import { Header } from "../components/Header";
import { FloatingCartButton } from "../components/FloatingCartButton";
import { Toaster } from "../components/ui/sonner";
import { AuthProvider } from "../components/auth-context";
import React from "react";

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      {children}
      <FloatingCartButton />
      <Toaster />
    </AuthProvider>
  );
}
