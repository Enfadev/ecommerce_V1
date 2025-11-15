"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusVariant = "default" | "success" | "warning" | "danger" | "info" | "secondary";

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  default: "bg-gray-100 text-gray-800 border-gray-200",
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  danger: "bg-red-100 text-red-800 border-red-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  secondary: "bg-slate-100 text-slate-800 border-slate-200",
};

export function StatusBadge({ status, variant = "default", className }: StatusBadgeProps) {
  return <Badge className={cn(variantStyles[variant], "font-medium", className)}>{status}</Badge>;
}

// Auto-detect variant based on status text
export function getStatusVariant(status: string): StatusVariant {
  const statusLower = status.toLowerCase();

  if (["delivered", "completed", "success", "active", "verified", "paid", "approved"].includes(statusLower)) {
    return "success";
  }

  if (["pending", "processing", "in progress", "unverified"].includes(statusLower)) {
    return "warning";
  }

  if (["cancelled", "failed", "rejected", "inactive", "error"].includes(statusLower)) {
    return "danger";
  }

  if (["shipped", "info", "new"].includes(statusLower)) {
    return "info";
  }

  return "secondary";
}

// Smart StatusBadge that auto-detects variant
export function SmartStatusBadge({ status, className }: { status: string; className?: string }) {
  const variant = getStatusVariant(status);
  return <StatusBadge status={status} variant={variant} className={className} />;
}
