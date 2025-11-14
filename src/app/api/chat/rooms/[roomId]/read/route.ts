import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-utils";

export async function POST(request: NextRequest, context: { params: Promise<{ roomId: string }> }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await context.params;
    const roomId = parseInt(resolvedParams.roomId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chatRoom = await (prisma as any).chatRoom.findFirst({
      where: {
        id: roomId,
        OR: [{ userId: user.id }, { adminId: user.id }, { admin: null, ...(user.role === "ADMIN" && {}) }],
      },
    });

    if (!chatRoom) {
      return NextResponse.json({ error: "Chat room not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).chatMessage.updateMany({
      where: {
        chatRoomId: roomId,
        NOT: {
          senderId: user.id,
        },
      },
      data: {
        isRead: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).chatRoom.update({
      where: { id: roomId },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json({ error: "Failed to mark messages as read" }, { status: 500 });
  }
}
