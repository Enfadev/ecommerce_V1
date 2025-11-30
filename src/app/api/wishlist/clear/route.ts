import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth-utils";
import { isAdminRequest } from "@/lib/admin-utils";

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await isAdminRequest(request);
    if (isAdmin) {
      return NextResponse.json(
        { success: false, message: "Wishlist feature is not available for admin users" },
        { status: 403 }
      );
    }

    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      return NextResponse.json(
        { success: false, message: "Wishlist not found" },
        { status: 404 }
      );
    }

    await prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id },
    });

    return NextResponse.json({
      success: true,
      message: "Wishlist cleared successfully",
    });
  } catch (error) {
    console.error("Wishlist clear error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to clear wishlist" },
      { status: 500 }
    );
  }
}
