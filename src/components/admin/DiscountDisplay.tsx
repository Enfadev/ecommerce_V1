"use client";

import { Badge } from "@/components/ui/badge";

interface DiscountDisplayProps {
  originalPrice: number;
  discountPrice?: number | null;
  promoExpired?: string;
  showPercentage?: boolean;
  showExpiry?: boolean;
  compact?: boolean;
}

export function DiscountDisplay({ 
  originalPrice, 
  discountPrice, 
  promoExpired, 
  showPercentage = true, 
  showExpiry = true,
  compact = false 
}: DiscountDisplayProps) {
  // Check if discount is valid and not expired
  const isValidDiscount = discountPrice && 
                         discountPrice > 0 && 
                         discountPrice < originalPrice &&
                         (!promoExpired || new Date(promoExpired) > new Date());

  if (!isValidDiscount) {
    return (
      <div className={`${compact ? 'text-sm' : 'text-base'} font-semibold`}>
        ${originalPrice.toFixed(2)}
      </div>
    );
  }

  const discountPercentage = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  const isExpiringSoon = promoExpired && new Date(promoExpired) <= new Date(Date.now() + 24 * 60 * 60 * 1000); // expires in 24h

  if (compact) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-red-600 font-semibold text-sm">
            ${discountPrice.toFixed(2)}
          </span>
          {showPercentage && (
            <Badge variant="destructive" className="text-xs px-1 py-0">
              -{discountPercentage}%
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground line-through">
          ${originalPrice.toFixed(2)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-red-600 font-semibold text-base">
          ${discountPrice.toFixed(2)}
        </span>
        {showPercentage && (
          <Badge variant="destructive" className="text-xs">
            -{discountPercentage}% OFF
          </Badge>
        )}
        {isExpiringSoon && (
          <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 bg-orange-50">
            ⚠️ Expiring Soon
          </Badge>
        )}
      </div>
      <div className="text-sm text-muted-foreground">
        <span className="line-through">Original: ${originalPrice.toFixed(2)}</span>
        <span className="ml-2 text-green-600 font-medium">
          Save: ${(originalPrice - discountPrice).toFixed(2)}
        </span>
      </div>
      {showExpiry && promoExpired && (
        <div className="text-xs text-muted-foreground">
          Expires: {new Date(promoExpired).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
