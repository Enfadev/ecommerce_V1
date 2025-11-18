import { Suspense } from "react";
import ProductReviewSection from "@/components/product/ProductReviewSection";
import ProductRecommendation from "@/components/product/ProductRecommendation";

interface ProductTabsProps {
  productId: number;
}

export default function ProductTabs({ productId }: ProductTabsProps) {
  return (
    <div className="space-y-8">
      <Suspense
        fallback={
          <div className="bg-card rounded-2xl shadow-sm border p-8 text-center">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
              Loading reviews...
            </div>
          </div>
        }
      >
        <div className="bg-card rounded-2xl shadow-sm border overflow-hidden">
          <ProductReviewSection productId={productId} />
        </div>
      </Suspense>

      <Suspense
        fallback={
          <div className="bg-card rounded-2xl shadow-sm border p-8 text-center">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
              Loading recommendations...
            </div>
          </div>
        }
      >
        <div className="bg-card rounded-2xl shadow-sm border overflow-hidden">
          <ProductRecommendation currentProductId={productId.toString()} maxItems={6} />
        </div>
      </Suspense>
    </div>
  );
}
