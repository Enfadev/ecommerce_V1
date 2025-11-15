import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

interface Product {
  name: string;
  sales: number;
  revenue: string;
}

interface TopProductsListProps {
  products: Product[];
}

export function TopProductsList({ products }: TopProductsListProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Top Products</h3>
          <p className="text-sm text-muted-foreground">Products with the highest sales</p>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.sales} sold</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">{product.revenue}</p>
              <p className="text-sm text-muted-foreground">Revenue</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
