"use client";

import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface AdminBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function AdminBreadcrumb({ items }: AdminBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <Button variant="ghost" size="sm" className="p-1 h-auto text-muted-foreground hover:text-foreground">
        <Home className="w-4 h-4" />
      </Button>

      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-1" />
          {item.href && !item.active ? (
            <Button variant="ghost" size="sm" className="p-1 h-auto text-muted-foreground hover:text-foreground">
              {item.label}
            </Button>
          ) : (
            <span className={item.active ? "text-foreground font-medium" : "text-muted-foreground"}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
