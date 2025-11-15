import type { Metadata } from "next";
import { prisma } from "@/lib/database";
import { getSystemSettingsWithFallback } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  const global = await getSystemSettingsWithFallback();

  if (!product) {
    return {
      title: global.defaultMetaTitle || `${global.storeName} - Product`,
      description: global.defaultMetaDescription || global.storeDescription,
    };
  }

  const p = product as unknown as { [key: string]: unknown };
  const title = (p.metaTitle as string) || product.name || global.defaultMetaTitle || global.storeName;
  const description = (p.metaDescription as string) || global.defaultMetaDescription || global.storeDescription;
  const ogImage = (p.ogImageUrl as string) || product.imageUrl || global.defaultOgImageUrl || global.logoUrl || undefined;
  const canonicalBase = global.canonicalBaseUrl?.replace(/\/$/, "");
  const canonical = (p.canonicalUrl as string) || (canonicalBase ? `${canonicalBase}/product/${product.slug}` : undefined);

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: (p.noindex as boolean) ? { index: false, follow: false } : { index: global.enableIndexing !== false, follow: true },
    openGraph: {
      title: (p.ogTitle as string) || title,
      description: (p.ogDescription as string) || description,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: (p.ogTitle as string) || title,
      description: (p.ogDescription as string) || description,
      images: ogImage ? [ogImage] : undefined,
      creator: global.twitterHandle || undefined,
    },
  };
}

export default function ProductDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
