import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSystemSettingsWithFallback } from "@/lib/system-settings";

// Force dynamic rendering to avoid database requirement during build
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSystemSettingsWithFallback();
  const base = (settings.canonicalBaseUrl || "").replace(/\/$/, "");
  const urls: MetadataRoute.Sitemap = [];

  const staticPaths = ["/", "/about", "/contact", "/product"];
  for (const p of staticPaths) {
    urls.push({ url: base ? `${base}${p}` : p, changeFrequency: "weekly", priority: p === "/" ? 1 : 0.7 });
  }

  try {
    type ProductLite = { id: number; updatedAt: Date; status: string; noindex?: boolean };
    const products = await prisma.product.findMany({ select: { id: true, updatedAt: true, status: true } });
    const extended = products as unknown as ProductLite[];
    for (const prod of extended) {
      if (prod.status !== "active" || prod.noindex) continue;
      urls.push({ url: base ? `${base}/product/${prod.id}` : `/product/${prod.id}`, lastModified: prod.updatedAt, changeFrequency: "weekly", priority: 0.8 });
    }
  } catch {}

  return urls;
}
