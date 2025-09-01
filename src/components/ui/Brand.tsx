"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

interface BrandProps {
  className?: string;
  as?: "div" | "h1" | "h2" | "h3" | "span";
  linkable?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showLogo?: boolean;
}

export function Brand({ 
  className, 
  as = "div", 
  linkable = false, 
  size = "lg",
  showLogo = true 
}: BrandProps) {
  const Component = as;

  const content = showLogo ? (
    <Logo 
      size={size} 
      className={className}
      textClassName={as !== "div" ? "" : undefined}
    />
  ) : (
    <Component className={cn(
      "font-bold tracking-tight text-primary hover:text-primary/80 transition-colors",
      className
    )}>
      Brandify
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

export const brandConfig = {
  name: "Brandify",
  tagline: "A trusted online shopping platform",
  website: "https://brandify.com",
  email: "hello@brandify.com"
};
