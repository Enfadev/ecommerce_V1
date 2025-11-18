import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";
import { prisma } from "@/lib/database";
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

    let settings = await prisma.systemSettings.findFirst();

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          storeName: "E-Commerce Store",
          storeDescription: "Trusted online store",
          contactEmail: "contact@store.com",
          phoneNumber: "",
          officeAddress: "",
          timezone: "Asia/Jakarta",
          enableTwoFactor: false,
          sessionTimeout: 24,
          version: "1.0.0",
        },
      });
    }

    let logoUrl = settings.logoUrl;
    if (logoUrl) {
      const logoPath = logoUrl.startsWith("/") ? logoUrl.substring(1) : logoUrl;
      const fullPath = path.join(process.cwd(), "public", logoPath);

      if (!fs.existsSync(fullPath)) {
        settings = await prisma.systemSettings.update({
          where: { id: settings.id },
          data: {
            logoUrl: null,
            updatedAt: new Date(),
          },
        });
        logoUrl = null;
      }
    }

    return NextResponse.json({
      success: true,
      settings: {
        storeName: settings?.storeName || "E-Commerce Store",
        storeDescription: settings?.storeDescription || "Trusted online store",
        contactEmail: settings?.contactEmail || "contact@store.com",
        phoneNumber: settings?.phoneNumber || "",
        officeAddress: settings?.officeAddress || "",
        timezone: settings?.timezone || "Asia/Jakarta",
        logoUrl: logoUrl,
        enableTwoFactor: settings?.enableTwoFactor || false,
        sessionTimeout: settings?.sessionTimeout || 24,
        version: settings?.version || "1.0.0",
        defaultMetaTitle: settings?.defaultMetaTitle || null,
        defaultMetaDescription: settings?.defaultMetaDescription || null,
        defaultMetaKeywords: settings?.defaultMetaKeywords || null,
        defaultOgImageUrl: settings?.defaultOgImageUrl || null,
        twitterHandle: settings?.twitterHandle || null,
        facebookPage: settings?.facebookPage || null,
        canonicalBaseUrl: settings?.canonicalBaseUrl || null,
        enableIndexing: settings?.enableIndexing ?? true,
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

    let settings = await prisma.systemSettings.findFirst();

    if (settings) {
      settings = await prisma.systemSettings.update({
        where: { id: settings.id },
        data: {
          storeName: body.storeName !== undefined ? body.storeName : settings.storeName,
          storeDescription: body.storeDescription !== undefined ? body.storeDescription : settings.storeDescription,
          contactEmail: body.contactEmail !== undefined ? body.contactEmail : settings.contactEmail,
          phoneNumber: body.phoneNumber !== undefined ? body.phoneNumber : settings.phoneNumber,
          officeAddress: body.officeAddress !== undefined ? body.officeAddress : settings.officeAddress,
          timezone: body.timezone !== undefined ? body.timezone : settings.timezone,
          logoUrl: body.logoUrl !== undefined ? body.logoUrl : settings.logoUrl,
          defaultMetaTitle: body.defaultMetaTitle !== undefined ? body.defaultMetaTitle : settings.defaultMetaTitle,
          defaultMetaDescription: body.defaultMetaDescription !== undefined ? body.defaultMetaDescription : settings.defaultMetaDescription,
          defaultMetaKeywords: body.defaultMetaKeywords !== undefined ? body.defaultMetaKeywords : settings.defaultMetaKeywords,
          defaultOgImageUrl: body.defaultOgImageUrl !== undefined ? body.defaultOgImageUrl : settings.defaultOgImageUrl,
          twitterHandle: body.twitterHandle !== undefined ? body.twitterHandle : settings.twitterHandle,
          facebookPage: body.facebookPage !== undefined ? body.facebookPage : settings.facebookPage,
          canonicalBaseUrl: body.canonicalBaseUrl !== undefined ? body.canonicalBaseUrl : settings.canonicalBaseUrl,
          enableIndexing: body.enableIndexing !== undefined ? body.enableIndexing : settings.enableIndexing,
          updatedAt: new Date(),
        },
      });
    } else {
      settings = await prisma.systemSettings.create({
        data: {
          storeName: body.storeName || "E-Commerce Store",
          storeDescription: body.storeDescription || "Trusted online store",
          contactEmail: body.contactEmail || "contact@store.com",
          phoneNumber: body.phoneNumber || "",
          officeAddress: body.officeAddress || "",
          timezone: body.timezone || "Asia/Jakarta",
          logoUrl: body.logoUrl || null,
          enableTwoFactor: false,
          sessionTimeout: 24,
          version: "1.0.0",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: {
        storeName: settings?.storeName || "E-Commerce Store",
        storeDescription: settings?.storeDescription || "Trusted online store",
        contactEmail: settings?.contactEmail || "contact@store.com",
        phoneNumber: settings?.phoneNumber || "",
        officeAddress: settings?.officeAddress || "",
        timezone: settings?.timezone || "Asia/Jakarta",
        logoUrl: settings?.logoUrl || null,
        enableTwoFactor: settings?.enableTwoFactor || false,
        sessionTimeout: settings?.sessionTimeout || 24,
        version: settings?.version || "1.0.0",
        defaultMetaTitle: settings?.defaultMetaTitle || null,
        defaultMetaDescription: settings?.defaultMetaDescription || null,
        defaultMetaKeywords: settings?.defaultMetaKeywords || null,
        defaultOgImageUrl: settings?.defaultOgImageUrl || null,
        twitterHandle: settings?.twitterHandle || null,
        facebookPage: settings?.facebookPage || null,
        canonicalBaseUrl: settings?.canonicalBaseUrl || null,
        enableIndexing: settings?.enableIndexing ?? true,
      },
    });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
