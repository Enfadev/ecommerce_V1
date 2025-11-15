import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/database';
import { getUserFromRequest } from "@/lib/auth";

export async function PATCH(request: NextRequest, context: { params: Promise<{ roomId: string }> }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const resolvedParams = await context.params;
    const roomId = parseInt(resolvedParams.roomId);
    const { status, priority, adminId } = await request.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (adminId !== undefined) updateData.adminId = adminId;

    const updatedRoom = await prisma.chatRoom.update({
      where: { id: roomId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });

    return NextResponse.json({ chatRoom: updatedRoom });
  } catch (error) {
    console.error("Error updating chat room:", error);
    return NextResponse.json({ error: "Failed to update chat room" }, { status: 500 });
  }
}
