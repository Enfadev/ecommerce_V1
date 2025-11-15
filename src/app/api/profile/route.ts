import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/database';
import { verifyJWT } from "@/lib/auth";

export async function GET(request: NextRequest) {
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
    let userId = request.headers.get("x-user-id");

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
    }

    const body = await request.json();
    const { name, phoneNumber, address, dateOfBirth, image } = body;

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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
