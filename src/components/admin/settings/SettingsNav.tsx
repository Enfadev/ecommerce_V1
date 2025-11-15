"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Settings, Globe, Shield, Users, Database, Layout } from "lucide-react";

const navItems = [
  {
    title: "General",
    href: "/admin/settings",
    icon: Settings,
    description: "Store information and basic settings",
  },
  {
    title: "Page Management",
    href: "/admin/settings/pages",
    icon: Layout,
    description: "Edit website page content",
  },
  {
    title: "SEO Defaults",
    href: "/admin/settings/seo",
    icon: Globe,
    description: "Default meta tags and SEO settings",
  },
  {
    title: "Users",
    href: "/admin/settings/users",
    icon: Users,
    description: "Manage user accounts and permissions",
  },
  {
    title: "Security",
    href: "/admin/settings/security",
    icon: Shield,
    description: "Security settings and logs",
  },
  {
    title: "System",
    href: "/admin/settings/system",
    icon: Database,
    description: "System information and status",
  },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link key={item.href} href={item.href} className={cn("flex items-start gap-3 rounded-lg px-3 py-2 transition-colors", isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
            <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium">{item.title}</div>
              <div className={cn("text-xs mt-0.5", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>{item.description}</div>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
