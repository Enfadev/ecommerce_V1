import { NextResponse } from "next/server";
import { getSystemSettingsWithFallback } from "@/lib/system-settings";

export async function GET() {
  try {
    const settings = await getSystemSettingsWithFallback();

    return NextResponse.json({
      success: true,
      settings: {
        storeName: settings.storeName,
        storeDescription: settings.storeDescription,
        contactEmail: settings.contactEmail,
        currency: settings.currency,
        language: settings.language,
        logoUrl: settings.logoUrl
      }
    });

  } catch (error) {
    console.error("Public settings GET error:", error);
    return NextResponse.json(
      { 
        success: true,
        settings: {
          storeName: "Brandify",
          storeDescription: "A trusted online shopping platform",
          contactEmail: "contact@brandify.com",
          currency: "USD",
          language: "en",
          logoUrl: undefined
        }
      },
      { status: 200 }
    );
  }
}
