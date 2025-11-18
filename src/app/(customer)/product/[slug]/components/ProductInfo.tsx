import type { ProductDetail } from "../constants";
import { hasActiveDiscount, getDiscountPercentage, getSavingsAmount, formatCurrency, formatDate } from "../constants";

interface ProductInfoProps {
  product: ProductDetail;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const showDiscount = hasActiveDiscount(product);
  const discountPercent = getDiscountPercentage(product);
  const savings = getSavingsAmount(product);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="px-4 py-2 bg-foreground/5 text-foreground text-sm font-medium rounded-full border border-border/30">{product.category || "General"}</span>
        {showDiscount && <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">-{discountPercent}% OFF</span>}
      </div>

      <h1 className="text-4xl lg:text-5xl font-light text-foreground leading-tight">{product.name}</h1>

      <div className="space-y-2">
        {showDiscount && product.discountPrice ? (
          <>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-semibold text-red-600">{formatCurrency(product.discountPrice)}</span>
              <span className="text-muted-foreground text-lg">USD</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl text-muted-foreground line-through">{formatCurrency(product.price)}</span>
              <span className="text-sm text-red-600 font-medium">Save {formatCurrency(savings)}</span>
            </div>
            {product.promoExpired && <p className="text-sm text-orange-600 font-medium">🔥 Sale ends: {formatDate(product.promoExpired)}</p>}
          </>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold text-foreground">{formatCurrency(product.price)}</span>
            <span className="text-muted-foreground text-lg">USD</span>
          </div>
        )}
      </div>
    </div>
  );
}
