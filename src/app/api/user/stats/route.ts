import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Get total orders count
    const totalOrders = await prisma.order.count({
      where: {
        userId: userId
      }
    });

    // For wishlist, since it's using context (localStorage), we'll return 0 for now
    // In a real app, you might want to create a SavedItem model or use the current wishlist context
    const wishlistItems = 0; // Will be updated from frontend context

    return NextResponse.json({
      totalOrders,
      wishlistItems
    });

  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 }
    );
  }
}
