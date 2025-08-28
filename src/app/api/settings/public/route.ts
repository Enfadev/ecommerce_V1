import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.$queryRaw`SELECT * FROM system_settings LIMIT 1`;
    
    if (!settings || (Array.isArray(settings) && settings.length === 0)) {
      await prisma.$executeRaw`
        INSERT INTO system_settings (storeName, storeDescription, contactEmail, currency, timezone, language, enableTwoFactor, sessionTimeout, version, createdAt, updatedAt)
        VALUES ('ShopZone', 'A trusted online shopping platform', 'contact@shopzone.com', 'USD', 'Asia/Jakarta', 'en', false, 24, '1.0.0', NOW(), NOW())
      `;
      
      settings = await prisma.$queryRaw`SELECT * FROM system_settings LIMIT 1`;
    }

    const settingsData = Array.isArray(settings) ? settings[0] : settings;

    return NextResponse.json({
      success: true,
      settings: {
        storeName: settingsData?.storeName || "ShopZone",
        storeDescription: settingsData?.storeDescription || "A trusted online shopping platform",
        contactEmail: settingsData?.contactEmail || "contact@shopzone.com",
        currency: settingsData?.currency || "USD",
        language: settingsData?.language || "en"
      }
    });

  } catch (error) {
    console.error("Public settings GET error:", error);
    return NextResponse.json(
      { 
        success: true,
        settings: {
          storeName: "ShopZone",
          storeDescription: "A trusted online shopping platform",
          contactEmail: "contact@shopzone.com",
          currency: "USD",
          language: "en"
        }
      },
      { status: 200 }
    );
  }
}
