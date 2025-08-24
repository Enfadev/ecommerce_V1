import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";

// Temporary in-memory storage for system settings (fallback approach)
let systemSettings = {
  storeName: "E-Commerce Store",
  storeDescription: "Trusted online store",
  contactEmail: "contact@store.com",
  currency: "USD",
  timezone: "Asia/Jakarta",
  language: "en"
};

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

    return NextResponse.json({
      success: true,
      settings: systemSettings
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

    // Update settings (in memory for now, should be in database)
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
    console.error("Settings PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update settings" },
      { status: 500 }
    );
  }
}
