import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

interface SeoData {
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
  canonicalUrl?: string | null;
  noindex?: boolean | null;
}

interface GenerateMetadataOptions {
  pageData?: SeoData | null;
  fallbackTitle?: string;
  defaultPath?: string;
}

export async function generatePageMetadata({ pageData, fallbackTitle = "Page", defaultPath = "" }: GenerateMetadataOptions): Promise<Metadata> {
  try {
    const settings = await prisma.systemSettings.findFirst();

    const title = pageData?.metaTitle || settings?.defaultMetaTitle || fallbackTitle;
    const description = pageData?.metaDescription || settings?.defaultMetaDescription || "";
    const keywords = pageData?.metaKeywords || settings?.defaultMetaKeywords || "";
    const ogTitle = pageData?.ogTitle || title;
    const ogDescription = pageData?.ogDescription || description;
    const ogImage = pageData?.ogImageUrl || settings?.defaultOgImageUrl || "";
    const canonical = pageData?.canonicalUrl || (settings?.canonicalBaseUrl && defaultPath ? `${settings.canonicalBaseUrl}${defaultPath}` : "");

    return {
      title,
      description,
      keywords,
      robots: pageData?.noindex ? "noindex, nofollow" : "index, follow",
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        images: ogImage ? [{ url: ogImage }] : undefined,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        description: ogDescription,
        images: ogImage ? [ogImage] : undefined,
        creator: settings?.twitterHandle || undefined,
      },
      alternates: {
        canonical: canonical || undefined,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: fallbackTitle,
      description: "",
    };
  }
}

export async function getSystemSettings() {
  try {
    return await prisma.systemSettings.findFirst();
  } catch (error) {
    console.error("Error fetching system settings:", error);
    return null;
  }
}
