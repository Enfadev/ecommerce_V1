"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

interface Product {
  id: number;
  name: string;
  discountPrice?: number | null;
  promoExpired?: string;
  price: number;
}

interface ExpiringPromoAlertProps {
  products: Product[];
}

export function ExpiringPromoAlert({ products }: ExpiringPromoAlertProps) {
  const [dismissed, setDismissed] = useState(false);

  const expiringProducts = products.filter((product) => {
    if (!product.discountPrice || !product.promoExpired) return false;
    
    const expiryDate = new Date(product.promoExpired);
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    return (
      product.discountPrice > 0 &&
      product.discountPrice < product.price &&
      expiryDate > now &&
      expiryDate <= twentyFourHoursFromNow
    );
  });

  useEffect(() => {
    if (expiringProducts.length > 0) {
      setDismissed(false);
    }
  }, [expiringProducts.length]);

  if (dismissed || expiringProducts.length === 0) {
    return null;
  }

  return (
    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <div className="flex justify-between items-start w-full">
        <AlertDescription className="flex-1">
          <div className="space-y-2">
            <p className="font-medium text-orange-800 dark:text-orange-200">
              ⚠️ {expiringProducts.length} product{expiringProducts.length > 1 ? 's' : ''} with expiring promotions!
            </p>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              The following products have promotions expiring within 24 hours:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {expiringProducts.slice(0, 5).map((product) => (
                <Badge key={product.id} variant="outline" className="text-orange-700 border-orange-300">
                  {product.name}
                </Badge>
              ))}
              {expiringProducts.length > 5 && (
                <Badge variant="outline" className="text-orange-700 border-orange-300">
                  +{expiringProducts.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        </AlertDescription>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDismissed(true)}
          className="text-orange-600 hover:text-orange-800 p-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}
