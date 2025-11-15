import { prisma } from '@/lib/database';
import type { Prisma } from "@prisma/client";

export interface SystemSettings {
  id: number;
  storeName: string;
  storeDescription: string;
  contactEmail: string;
  currency: string;
  timezone: string;
  language: string;
  logoUrl?: string | null;
  phoneNumber?: string | null;
  officeAddress?: string | null;
  enableTwoFactor: boolean;
  sessionTimeout: number;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  defaultMetaTitle?: string | null;
  defaultMetaDescription?: string | null;
  defaultMetaKeywords?: string | null;
  defaultOgImageUrl?: string | null;
  twitterHandle?: string | null;
  facebookPage?: string | null;
  canonicalBaseUrl?: string | null;
  enableIndexing?: boolean;
  robotsRules?: Prisma.JsonValue | null;
}

/**
 * Get system settings from database
 * Used in server components and API routes
 */
export async function getSystemSettings(): Promise<SystemSettings | null> {
  try {
    let settings = await prisma.systemSettings.findFirst();

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          storeName: "Brandify",
          storeDescription: "A trusted online shopping platform",
          contactEmail: "contact@brandify.com",
          currency: "USD",
          timezone: "Asia/Jakarta",
          language: "en",
          enableTwoFactor: false,
          sessionTimeout: 24,
          version: "1.0.0",
        },
      });
    }

    return settings;
  } catch (error) {
    console.error("Error fetching system settings:", error);
    return null;
  }
}

/**
 * Get system settings with fallback to default values
 */
export async function getSystemSettingsWithFallback(): Promise<SystemSettings> {
  const settings = await getSystemSettings();

  const fallbackTitle = "Brandify - Trusted Online Shopping";
  const fallbackDesc = "Shop quality products at Brandify with secure payment and fast shipping.";
  const fallbackKeywords = "ecommerce, shop, online store, brandify";

  const merged: SystemSettings = {
    id: settings?.id ?? 0,
    storeName: settings?.storeName ?? "Brandify",
    storeDescription: settings?.storeDescription ?? "A trusted online shopping platform",
    contactEmail: settings?.contactEmail ?? "contact@brandify.com",
    currency: settings?.currency ?? "USD",
    timezone: settings?.timezone ?? "Asia/Jakarta",
    language: settings?.language ?? "en",
    logoUrl: settings?.logoUrl ?? null,
    phoneNumber: settings?.phoneNumber ?? "+1 (555) 000-0000",
    officeAddress: settings?.officeAddress ?? "123 Business District, Suite 100, Jakarta, Indonesia",
    enableTwoFactor: settings?.enableTwoFactor ?? false,
    sessionTimeout: settings?.sessionTimeout ?? 24,
    version: settings?.version ?? "1.0.0",
    createdAt: settings?.createdAt ?? new Date(),
    updatedAt: settings?.updatedAt ?? new Date(),
    defaultMetaTitle: settings?.defaultMetaTitle ?? fallbackTitle,
    defaultMetaDescription: settings?.defaultMetaDescription ?? fallbackDesc,
    defaultMetaKeywords: settings?.defaultMetaKeywords ?? fallbackKeywords,
    defaultOgImageUrl: settings?.defaultOgImageUrl ?? null,
    twitterHandle: settings?.twitterHandle ?? null,
    facebookPage: settings?.facebookPage ?? null,
    canonicalBaseUrl: settings?.canonicalBaseUrl ?? null,
    enableIndexing: settings?.enableIndexing ?? true,
    robotsRules: (settings as unknown as { robotsRules?: Prisma.JsonValue | null })?.robotsRules ?? null,
  };

  return merged;
}
