"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textClassName?: string;
}

interface BrandSettings {
  storeName: string;
  logoUrl?: string;
}

const sizeClasses = {
  sm: {
    image: "h-6 w-6",
    text: "text-lg"
  },
  md: {
    image: "h-8 w-8", 
    text: "text-xl"
  },
  lg: {
    image: "h-10 w-10",
    text: "text-2xl"
  },
  xl: {
    image: "h-12 w-12",
    text: "text-3xl"
  }
};

export function Logo({ 
  className, 
  size = "lg", 
  showText = true, 
  textClassName 
}: LogoProps) {
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({
    storeName: "Brandify",
    logoUrl: undefined
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
              storeName: data.settings.storeName || "Brandify",
              logoUrl: data.settings.logoUrl
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

  const storeName = loading ? "Brandify" : brandSettings.storeName;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Logo Image */}
      {brandSettings.logoUrl ? (
        <div className={cn("relative overflow-hidden rounded-lg", sizeClasses[size].image)}>
          <Image
            src={brandSettings.logoUrl}
            alt={`${storeName} Logo`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 32px, 40px"
            priority
          />
        </div>
      ) : (
        /* Default Logo Icon */
        <div className={cn(
          "flex items-center justify-center bg-primary text-primary-foreground rounded-lg font-bold",
          sizeClasses[size].image
        )}>
          <span className="text-xs">
            {storeName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      {/* Store Name */}
      {showText && (
        <span className={cn(
          "font-bold tracking-tight text-primary hover:text-primary/80 transition-colors",
          sizeClasses[size].text,
          textClassName
        )}>
          {storeName}
        </span>
      )}
    </div>
  );
}
