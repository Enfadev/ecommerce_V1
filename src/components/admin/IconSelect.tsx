"use client";

import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Truck,
  CreditCard,
  Shield,
  Clock,
  Headphones,
  Box,
  CheckCircle,
  Zap,
  Gift,
  RefreshCw,
  ArrowRight,
  Heart,
  ShoppingCart,
  Package,
  Smartphone,
  Home,
  Star,
  Lock,
  DollarSign,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

interface IconSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Truck,
  CreditCard,
  Shield,
  Clock,
  Headphones,
  Box,
  CheckCircle,
  Zap,
  Gift,
  RefreshCw,
  ArrowRight,
  Heart,
  ShoppingCart,
  Package,
  Smartphone,
  Home,
  Star,
  Lock,
  DollarSign,
  TrendingUp,
};

const POPULAR_ICONS = Object.keys(ICON_MAP);

export function IconSelect({
  value,
  onChange,
  placeholder = "Select an icon",
}: IconSelectProps) {
  const displayIcon = useMemo(() => {
    if (!value) return null;

    const IconComponent = ICON_MAP[value];
    if (IconComponent) {
      return <IconComponent className="w-4 h-4" />;
    }
    return null;
  }, [value]);

  const getIconComponent = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName];
    if (IconComponent) {
      return <IconComponent className="w-4 h-4" />;
    }
    return null;
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          <div className="flex items-center gap-2">
            {displayIcon}
            <span>{value || placeholder}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {POPULAR_ICONS.map((iconName) => (
          <SelectItem key={iconName} value={iconName}>
            <div className="flex items-center gap-2">
              {getIconComponent(iconName)}
              <span>{iconName}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
