"use client";

import { useCart } from "../contexts/cart-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Package, Clock } from "lucide-react";

export function CartSummaryWidget() {
  const { getTotalItems, getTotalPrice } = useCart();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (totalItems === 0) return null;

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Ringkasan Keranjang
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Total Item</span>
          </div>
          <Badge variant="secondary">{totalItems}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Estimasi Sampai</span>
          </div>
          <span className="text-sm font-medium">
            {estimatedDelivery.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-lg text-primary">Rp {totalPrice.toLocaleString()}</span>
        </div>

        {totalPrice >= 250000 && (
          <div className="text-center">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">🎉 Gratis Ongkir!</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
