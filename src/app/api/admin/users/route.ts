import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "all";
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [{ name: { contains: search } }, { email: { contains: search } }];
    }

    if (role !== "all") {
      whereClause.role = role.toUpperCase();
    }

    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          image: true,
          phoneNumber: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ success: false, message: "User ID and role are required" }, { status: 400 });
    }

    if (!["ADMIN", "USER"].includes(role)) {
      return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
    }

    if (parseInt(session.user.id) === userId) {
      return NextResponse.json({ success: false, message: "Cannot change your own role" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    await prisma.securityLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: "USER_ROLE_CHANGED",
        description: `Changed user ${updatedUser.email} role to ${role}`,
        ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null,
        status: "SUCCESS",
      },
    });

    return NextResponse.json({
      success: true,
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user role error:", error);
    return NextResponse.json({ success: false, message: "Failed to update user role" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("userId") || "");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (parseInt(session.user.id) === userId) {
      return NextResponse.json({ success: false, message: "Cannot delete your own account" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    await prisma.securityLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: "USER_DELETED",
        description: `Deleted user ${user.email}`,
        ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null,
        status: "SUCCESS",
      },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 });
  }
}
