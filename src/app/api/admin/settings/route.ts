import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";

// Temporary storage for settings (in production, this should be in database)
let systemSettings = {
  storeName: "E-Commerce Store",
  storeDescription: "Trusted online store",
  contactEmail: "contact@store.com",
  currency: "USD",
  timezone: "Asia/Jakarta",
  language: "en",
  primaryColor: "#3b82f6",
  secondaryColor: "#64748b",
  accentColor: "#8b5cf6",
  darkMode: false,
  customCSS: ""
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      settings: systemSettings
    });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Update settings
    systemSettings = {
      ...systemSettings,
      ...body
    };

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: systemSettings
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update settings" },
      { status: 500 }
    );
  }
}
