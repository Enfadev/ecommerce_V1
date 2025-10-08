import type { MetadataRoute } from "next";
import { getSystemSettingsWithFallback } from "@/lib/system-settings";

// Force dynamic rendering to avoid database requirement during build
export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSystemSettingsWithFallback();
  const allow = settings.enableIndexing !== false;
  const base = settings.canonicalBaseUrl || undefined;
  return {
    rules: {
      userAgent: "*",
      allow: allow ? "/" : undefined,
      disallow: allow ? undefined : "/",
    },
    sitemap: base ? [`${base.replace(/\/$/, "")}/sitemap.xml`] : undefined,
  };
}
