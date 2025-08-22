import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    console.log("📍 Profile API called");

    let userId = request.headers.get("x-user-id");
    let userEmail = request.headers.get("x-user-email");

    console.log("🔍 Middleware headers - User ID:", userId, "Email:", userEmail);

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

    console.log("👤 Getting profile for user ID:", userId);

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phoneNumber: true,
        address: true,
        dateOfBirth: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      console.log("❌ User not found in database:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("✅ Profile retrieved successfully for:", user.email);

    return NextResponse.json({
      user: {
        ...user,
        id: user.id.toString(),
      },
      debug: {
        fromMiddleware: !!request.headers.get("x-user-id"),
        userId: userId,
        userEmail: userEmail,
      },
    });
  } catch (error) {
    console.error("❌ Get profile error:", error);
    return NextResponse.json(
      {
        error: "Failed to get profile",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("📍 Profile Update API called");

    let userId = request.headers.get("x-user-id");
    let userEmail = request.headers.get("x-user-email");

    console.log("🔍 Middleware headers - User ID:", userId, "Email:", userEmail);

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
    const { name, phoneNumber, address, dateOfBirth, image } = body;

    console.log("👤 Updating profile for user ID:", userId);

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        ...(name && { name }),
        ...(phoneNumber && { phoneNumber }),
        ...(address && { address }),
        ...(dateOfBirth && { dateOfBirth }),
        ...(image && { image }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phoneNumber: true,
        address: true,
        dateOfBirth: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!updatedUser) {
      console.log("❌ User not found in database:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("✅ Profile updated successfully for:", updatedUser.email);

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        ...updatedUser,
        id: updatedUser.id.toString(),
      },
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);
    return NextResponse.json(
      {
        error: "Failed to update profile",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
