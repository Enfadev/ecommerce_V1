import { prisma } from "@/lib/prisma";

export interface SystemSettings {
  id: number;
  storeName: string;
  storeDescription: string;
  contactEmail: string;
  currency: string;
  timezone: string;
  language: string;
  enableTwoFactor: boolean;
  sessionTimeout: number;
  version: string;
  createdAt: Date;
  updatedAt: Date;
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
          version: "1.0.0"
        }
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
  
  if (!settings) {
    return {
      id: 0,
      storeName: "Brandify",
      storeDescription: "A trusted online shopping platform",
      contactEmail: "contact@brandify.com",
      currency: "USD",
      timezone: "Asia/Jakarta",
      language: "en",
      enableTwoFactor: false,
      sessionTimeout: 24,
      version: "1.0.0",
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  return settings;
}
