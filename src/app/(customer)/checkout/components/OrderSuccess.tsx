"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Order } from "@/hooks/use-orders";

interface OrderSuccessProps {
  order: Order | null;
}

export function OrderSuccess({ order }: OrderSuccessProps) {
  return (
    <div className="bg-background">
      <div className="py-16">
        <Card className="text-center max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-6">Thank you for your order. We will process it and send confirmation to your email soon.</p>

            {order && (
              <div className="bg-muted/30 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold mb-2">Order Details</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Order Number:</span>
                    <span className="font-mono">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant="secondary">{order.status}</Badge>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/order-history">View Orders</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
