import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "No auth token provided" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 });
    }

    let settings = await prisma.$queryRaw`SELECT * FROM system_settings LIMIT 1`;

    if (!settings || (Array.isArray(settings) && settings.length === 0)) {
      await prisma.$executeRaw`
        INSERT INTO system_settings (storeName, storeDescription, contactEmail, timezone, enableTwoFactor, sessionTimeout, version, createdAt, updatedAt)
        VALUES ('E-Commerce Store', 'Trusted online store', 'contact@store.com', 'Asia/Jakarta', false, 24, '1.0.0', NOW(), NOW())
      `;

      settings = await prisma.$queryRaw`SELECT * FROM system_settings LIMIT 1`;
    }

    const settingsData = Array.isArray(settings) ? settings[0] : settings;

    let logoUrl = settingsData?.logoUrl;
    if (logoUrl) {
      const logoPath = logoUrl.startsWith("/") ? logoUrl.substring(1) : logoUrl;
      const fullPath = path.join(process.cwd(), "public", logoPath);

      if (!fs.existsSync(fullPath)) {
        await prisma.$executeRaw`
          UPDATE system_settings 
          SET logoUrl = NULL,
              updatedAt = NOW()
          WHERE id = ${settingsData.id}
        `;
        logoUrl = null;
      }
    }

    return NextResponse.json({
      success: true,
      settings: {
        storeName: settingsData?.storeName || "E-Commerce Store",
        storeDescription: settingsData?.storeDescription || "Trusted online store",
        contactEmail: settingsData?.contactEmail || "contact@store.com",
        timezone: settingsData?.timezone || "Asia/Jakarta",
        logoUrl: logoUrl,
        enableTwoFactor: settingsData?.enableTwoFactor || false,
        sessionTimeout: settingsData?.sessionTimeout || 24,
        version: settingsData?.version || "1.0.0",
      },
    });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "No auth token provided" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 });
    }

    const body = await request.json();

    let settings = await prisma.$queryRaw`SELECT * FROM system_settings LIMIT 1`;
    const settingsData = Array.isArray(settings) ? settings[0] : settings;

    if (settingsData && settingsData.id) {
      await prisma.$executeRaw`
        UPDATE system_settings 
        SET storeName = ${body.storeName || settingsData.storeName},
            storeDescription = ${body.storeDescription || settingsData.storeDescription},
            contactEmail = ${body.contactEmail || settingsData.contactEmail},
            timezone = ${body.timezone || settingsData.timezone},
            logoUrl = ${body.logoUrl !== undefined ? body.logoUrl : settingsData.logoUrl},
            updatedAt = NOW()
        WHERE id = ${settingsData.id}
      `;
    } else {
      await prisma.$executeRaw`
        INSERT INTO system_settings (storeName, storeDescription, contactEmail, timezone, logoUrl, enableTwoFactor, sessionTimeout, version, createdAt, updatedAt)
        VALUES (${body.storeName || "E-Commerce Store"}, ${body.storeDescription || "Trusted online store"}, ${body.contactEmail || "contact@store.com"}, ${body.timezone || "Asia/Jakarta"}, ${
        body.logoUrl || null
      }, false, 24, '1.0.0', NOW(), NOW())
      `;
    }

    settings = await prisma.$queryRaw`SELECT * FROM system_settings LIMIT 1`;
    const updatedSettings = Array.isArray(settings) ? settings[0] : settings;

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: {
        storeName: updatedSettings?.storeName || "E-Commerce Store",
        storeDescription: updatedSettings?.storeDescription || "Trusted online store",
        contactEmail: updatedSettings?.contactEmail || "contact@store.com",
        timezone: updatedSettings?.timezone || "Asia/Jakarta",
        logoUrl: updatedSettings?.logoUrl || null,
        enableTwoFactor: updatedSettings?.enableTwoFactor || false,
        sessionTimeout: updatedSettings?.sessionTimeout || 24,
        version: updatedSettings?.version || "1.0.0",
      },
    });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
