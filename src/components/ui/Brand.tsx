"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandProps {
  className?: string;
  as?: "div" | "h1" | "h2" | "h3" | "span";
  linkable?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

interface BrandSettings {
  storeName: string;
  storeDescription: string;
}

const sizeClasses = {
  sm: "text-lg",
  md: "text-xl", 
  lg: "text-2xl",
  xl: "text-3xl"
};

export function Brand({ className, as = "div", linkable = false, size = "lg" }: BrandProps) {
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({
    storeName: "ShopZone",
    storeDescription: "A trusted online shopping platform"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandSettings = async () => {
      try {
        const response = await fetch('/api/settings/public');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.settings) {
            setBrandSettings({
              storeName: data.settings.storeName || "ShopZone",
              storeDescription: data.settings.storeDescription || "A trusted online shopping platform"
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch brand settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandSettings();
  }, []);

  const Component = as;
  const brandClasses = cn(
    "font-bold tracking-tight text-primary hover:text-primary/80 transition-colors",
    sizeClasses[size],
    className
  );

  const content = (
    <Component className={brandClasses}>
      {loading ? "ShopZone" : brandSettings.storeName}
    </Component>
  );

  if (linkable) {
    return (
      <Link href="/" className="hover:scale-105 transition-transform duration-200">
        {content}
      </Link>
    );
  }

  return content;
}

// Export brand config for backward compatibility
export const brandConfig = {
  name: "ShopZone",
  tagline: "A trusted online shopping platform",
  website: "https://shopzone.com",
  email: "hello@shopzone.com"
};
