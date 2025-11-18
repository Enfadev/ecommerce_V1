"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Truck, Tag } from "lucide-react";
import Image from "next/image";

interface CartItem {
  id: string | number;
  productId: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  totalItems: number;
}

export function OrderSummary({ items, subtotal, shippingFee, tax, total, totalItems }: OrderSummaryProps) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              {item.image ? (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-muted-foreground">x{typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1}</span>
                  <span className="text-sm font-semibold">${typeof item.price === "number" && typeof item.quantity === "number" && item.price > 0 && item.quantity > 0 ? (item.price * item.quantity).toFixed(2) : "0.00"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              Subtotal ({totalItems} item{totalItems > 1 ? "s" : ""})
            </span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              Shipping Fee
              {shippingFee === 0 && (
                <Badge variant="secondary" className="text-xs">
                  FREE
                </Badge>
              )}
            </span>
            <span>${shippingFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          {subtotal < 250 && shippingFee > 0 && <p className="text-xs text-muted-foreground">Free shipping for orders over $250.00</p>}
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
