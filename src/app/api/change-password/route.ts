import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function PUT(request: NextRequest) {
  try {
    let userId = request.headers.get("x-user-id");
    let userEmail = request.headers.get("x-user-email");

    if (!userId) {
      const token = request.cookies.get("auth-token")?.value;

      if (!token) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }

      const payload = await verifyJWT(token);

      if (!payload) {
        return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 });
      }

      userId = payload.id;
      userEmail = payload.email;
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "User not found or password not set" }, { status: 404 });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date(),
      },
    });

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
