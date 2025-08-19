import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/jwt";
import bcrypt from "bcryptjs";

// PUT /api/change-password - Change user password
export async function PUT(request: NextRequest) {
  try {
    console.log("📍 Change Password API called");

    // Try to get user info from middleware headers first
    let userId = request.headers.get("x-user-id");
    let userEmail = request.headers.get("x-user-email");

    console.log("🔍 Middleware headers - User ID:", userId, "Email:", userEmail);

    // If no user ID from middleware, try to get from JWT cookie directly
    if (!userId) {
      console.log("⚠️ No user ID from middleware, checking JWT directly...");

      const token = request.cookies.get("auth-token")?.value;
      console.log("🍪 Cookie token exists:", !!token);

      if (!token) {
        console.log("❌ No auth token found in cookies");
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }

      console.log("🔑 Verifying JWT token...");
      const payload = await verifyJWT(token);

      if (!payload) {
        console.log("❌ JWT verification failed");
        return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 });
      }

      console.log("✅ JWT verified successfully for user:", payload.email);
      userId = payload.id;
      userEmail = payload.email;
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 });
    }

    console.log("👤 Changing password for user ID:", userId);

    // Get current user to verify current password
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      console.log("❌ User not found or no password set:", userId);
      return NextResponse.json({ error: "User not found or password not set" }, { status: 404 });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      console.log("❌ Current password is incorrect for user:", userId);
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password in database
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date(),
      },
    });

    console.log("✅ Password changed successfully for:", userEmail);

    return NextResponse.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("❌ Change password error:", error);
    return NextResponse.json(
      {
        error: "Failed to change password",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
