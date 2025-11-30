import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    let userId = request.headers.get("x-user-id");

    if (!userId) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      userId = session.user.id;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, image: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.image && user.image.startsWith("/uploads/")) {
      const filename = user.image.replace("/uploads/", "");
      const filepath = join(process.cwd(), "public", "uploads", filename);

      if (existsSync(filepath)) {
        try {
          await unlink(filepath);
        } catch (fileError) {
          console.error("⚠️ Failed to delete file:", fileError);
        }
      }
    }

    const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=6366f1&color=fff&size=200`;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        image: defaultAvatarUrl,
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

    return NextResponse.json({
      success: true,
      message: "Avatar deleted successfully",
      user: {
        ...updatedUser,
        id: updatedUser.id,
      },
    });
  } catch (error) {
    console.error("❌ Delete avatar error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete avatar",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
