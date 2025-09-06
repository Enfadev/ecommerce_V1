import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-utils";

interface PageParams {
  params: {
    roomId: string;
  };
}

export async function PATCH(
  request: NextRequest,
  { params }: PageParams
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const roomId = parseInt(params.roomId);
    const { status, priority, adminId } = await request.json();

    const updateData: {
      status?: string;
      priority?: string;
      adminId?: number;
    } = {};

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
    return NextResponse.json(
      { error: "Failed to update chat room" },
      { status: 500 }
    );
  }
}
