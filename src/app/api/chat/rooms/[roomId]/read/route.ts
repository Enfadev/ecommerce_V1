import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-utils";

interface PageParams {
  params: {
    roomId: string;
  };
}

export async function POST(
  request: NextRequest,
  { params }: PageParams
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const roomId = parseInt(resolvedParams.roomId);

    // Verify user has access to this room
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chatRoom = await (prisma as any).chatRoom.findFirst({
      where: {
        id: roomId,
        OR: [
          { userId: user.id },
          { adminId: user.id },
          { admin: null, ...(user.role === "ADMIN" && {}) },
        ],
      },
    });

    if (!chatRoom) {
      return NextResponse.json(
        { error: "Chat room not found" },
        { status: 404 }
      );
    }

    // Mark all messages in this room as read for the current user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).chatMessage.updateMany({
      where: {
        chatRoomId: roomId,
        NOT: {
          senderId: user.id, // Don't mark own messages as read
        },
      },
      data: {
        isRead: true,
      },
    });

    // Update the chat room's isRead status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).chatRoom.update({
      where: { id: roomId },
      data: {
        isRead: true,
      },
    });

    console.log(`✅ Marked messages as read for user ${user.id} in room ${roomId}`);

    return NextResponse.json({ 
      success: true,
      message: "Messages marked as read"
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    );
  }
}
