"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TopProduct } from "@/types/analytics";

interface TopProductsListProps {
  products: TopProduct[];
}

export function TopProductsList({ products }: TopProductsListProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Top Products</h3>
          <p className="text-sm text-muted-foreground">Best performing products</p>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {products.slice(0, 5).map((product) => (
          <div key={product.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-sm font-medium">#</span>
              </div>
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.sales} sales</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">${product.revenue.toLocaleString()}</p>
              <div className="flex items-center gap-1">
                {product.growth >= 0 ? <ArrowUpRight className="w-3 h-3 text-green-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />}
                <span className={cn("text-xs", product.growth >= 0 ? "text-green-500" : "text-red-500")}>
                  {product.growth >= 0 ? "+" : ""}
                  {product.growth.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
