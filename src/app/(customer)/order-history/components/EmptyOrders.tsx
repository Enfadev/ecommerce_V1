"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

interface EmptyOrdersProps {
  hasFilters: boolean;
}

export function EmptyOrders({ hasFilters }: EmptyOrdersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-8">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
          <p className="text-muted-foreground mb-4">{hasFilters ? "No orders match your current filters." : "You haven't placed any orders yet."}</p>
          <Button asChild>
            <Link href="/product">Start Shopping</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
