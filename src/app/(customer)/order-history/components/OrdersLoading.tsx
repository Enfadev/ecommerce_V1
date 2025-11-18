"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function OrdersLoading() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading orders...</span>
        </div>
      </CardContent>
    </Card>
  );
}
