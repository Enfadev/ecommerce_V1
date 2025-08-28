import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandProps {
  className?: string;
  as?: "div" | "h1" | "h2" | "h3" | "span";
  linkable?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

// Brand configuration - easy to change for different businesses
const BRAND_CONFIG = {
  name: "ShopZone",
  tagline: "A trusted online shopping platform",
  website: "https://shopzone.com",
  email: "hello@shopzone.com"
};

const sizeClasses = {
  sm: "text-lg",
  md: "text-xl", 
  lg: "text-2xl",
  xl: "text-3xl"
};

export function Brand({ className, as = "div", linkable = false, size = "lg" }: BrandProps) {
  const Component = as;
  const brandClasses = cn(
    "font-bold tracking-tight text-primary hover:text-primary/80 transition-colors",
    sizeClasses[size],
    className
  );

  const content = (
    <Component className={brandClasses}>
      {BRAND_CONFIG.name}
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

// Export brand config for use in other places
export const brandConfig = BRAND_CONFIG;
