import { notFound } from "next/navigation";
import { prisma } from "@/lib/database";
import ProductImages from "./components/ProductImages";
import ProductInfo from "./components/ProductInfo";
import ProductDescription from "./components/ProductDescription";
import AddToCartSection from "./components/AddToCartSection";
import ProductActions from "./components/ProductActions";
import ProductTabs from "./components/ProductTabs";
import type { ProductDetail } from "./constants";

/**
 * Product Detail Page - Server Component
 * Fetches product data server-side for better SEO and performance
 * Metadata is handled by layout.tsx
 */

async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
      },
    });

    if (!product) return null;

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl || "/placeholder-product.svg",
      imageUrl: product.imageUrl || undefined,
      category: product.category?.name || "General",
      description: product.description || undefined,
      discountPrice: product.discountPrice,
      promoExpired: product.promoExpired,
      gallery: product.images.map((img) => img.url),
      stock: product.stock,
      sku: product.sku || undefined,
      brand: product.brand || undefined,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Product Main Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left: Images */}
          <ProductImages product={product} />

          {/* Right: Product Info & Actions */}
          <div className="flex flex-col justify-center space-y-8">
            <ProductInfo product={product} />

            <div className="space-y-4">
              <AddToCartSection product={product} />
              <ProductActions product={product} />
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && <ProductDescription description={product.description} />}

        {/* Reviews & Recommendations */}
        <div className="mt-8">
          <ProductTabs productId={product.id} />
        </div>
      </div>
    </div>
  );
}
