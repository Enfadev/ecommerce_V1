import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

// GET method to retrieve system settings
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get("auth-token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No auth token provided" },
        { status: 401 }
      );
    }

    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Get settings from database - trying different model name
    let settings = await prisma.$queryRaw`SELECT * FROM system_settings LIMIT 1`;
    
    // If no settings exist, create default settings
    if (!settings || (Array.isArray(settings) && settings.length === 0)) {
      // Create default settings using raw SQL
      await prisma.$executeRaw`
        INSERT INTO system_settings (storeName, storeDescription, contactEmail, currency, timezone, language, enableTwoFactor, sessionTimeout, version, createdAt, updatedAt)
        VALUES ('E-Commerce Store', 'Trusted online store', 'contact@store.com', 'USD', 'Asia/Jakarta', 'en', false, 24, '1.0.0', NOW(), NOW())
      `;
      
      settings = await prisma.$queryRaw`SELECT * FROM system_settings LIMIT 1`;
    }

    const settingsData = Array.isArray(settings) ? settings[0] : settings;

    return NextResponse.json({
      success: true,
      settings: {
        storeName: settingsData?.storeName || "E-Commerce Store",
        storeDescription: settingsData?.storeDescription || "Trusted online store", 
        contactEmail: settingsData?.contactEmail || "contact@store.com",
        currency: settingsData?.currency || "USD",
        timezone: settingsData?.timezone || "Asia/Jakarta",
        language: settingsData?.language || "en",
        enableTwoFactor: settingsData?.enableTwoFactor || false,
        sessionTimeout: settingsData?.sessionTimeout || 24,
        version: settingsData?.version || "1.0.0"
      }
    });

  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT method to update system settings
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get("auth-token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No auth token provided" },
        { status: 401 }
      );
    }

    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Check if settings exist
    let settings = await prisma.$queryRaw`SELECT * FROM system_settings LIMIT 1`;
    const settingsData = Array.isArray(settings) ? settings[0] : settings;

    if (settingsData && settingsData.id) {
      // Update existing settings
      await prisma.$executeRaw`
        UPDATE system_settings 
        SET storeName = ${body.storeName || settingsData.storeName},
            storeDescription = ${body.storeDescription || settingsData.storeDescription},
            contactEmail = ${body.contactEmail || settingsData.contactEmail},
            currency = ${body.currency || settingsData.currency},
            timezone = ${body.timezone || settingsData.timezone},
            language = ${body.language || settingsData.language},
            updatedAt = NOW()
        WHERE id = ${settingsData.id}
      `;
    } else {
      // Create new settings if none exist
      await prisma.$executeRaw`
        INSERT INTO system_settings (storeName, storeDescription, contactEmail, currency, timezone, language, enableTwoFactor, sessionTimeout, version, createdAt, updatedAt)
        VALUES (${body.storeName || 'E-Commerce Store'}, ${body.storeDescription || 'Trusted online store'}, ${body.contactEmail || 'contact@store.com'}, ${body.currency || 'USD'}, ${body.timezone || 'Asia/Jakarta'}, ${body.language || 'en'}, false, 24, '1.0.0', NOW(), NOW())
      `;
    }

    // Get updated settings
    settings = await prisma.$queryRaw`SELECT * FROM system_settings LIMIT 1`;
    const updatedSettings = Array.isArray(settings) ? settings[0] : settings;

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: {
        storeName: updatedSettings?.storeName || "E-Commerce Store",
        storeDescription: updatedSettings?.storeDescription || "Trusted online store",
        contactEmail: updatedSettings?.contactEmail || "contact@store.com", 
        currency: updatedSettings?.currency || "USD",
        timezone: updatedSettings?.timezone || "Asia/Jakarta",
        language: updatedSettings?.language || "en",
        enableTwoFactor: updatedSettings?.enableTwoFactor || false,
        sessionTimeout: updatedSettings?.sessionTimeout || 24,
        version: updatedSettings?.version || "1.0.0"
      }
    });

  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
