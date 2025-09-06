import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-utils";

interface PageParams {
  params: {
    roomId: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: PageParams
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roomId = parseInt(params.roomId);

    const chatRoom = await prisma.chatRoom.findFirst({
      where: {
        id: roomId,
        OR: [
          { userId: user.id },
          { adminId: user.id },
          { admin: null, ...(user.role === "ADMIN" && {}) },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!chatRoom) {
      return NextResponse.json(
        { error: "Chat room not found" },
        { status: 404 }
      );
    }

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = 50;
    const skip = (page - 1) * limit;

    const messages = await prisma.chatMessage.findMany({
      where: { chatRoomId: roomId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
      skip,
      take: limit,
    });

    if (user.role === "ADMIN") {
      await prisma.chatMessage.updateMany({
        where: {
          chatRoomId: roomId,
          isRead: false,
          sender: {
            role: "USER",
          },
        },
        data: { isRead: true },
      });
    } else {
      await prisma.chatMessage.updateMany({
        where: {
          chatRoomId: roomId,
          isRead: false,
          sender: {
            role: "ADMIN",
          },
        },
        data: { isRead: true },
      });
    }

    return NextResponse.json({
      chatRoom,
      messages,
      hasMore: messages.length === limit,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
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

    const roomId = parseInt(params.roomId);
    const { message, messageType = "TEXT" } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const chatRoom = await prisma.chatRoom.findFirst({
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

    const newMessage = await prisma.chatMessage.create({
      data: {
        chatRoomId: roomId,
        senderId: user.id,
        message,
        messageType,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
            image: true,
          },
        },
      },
    });

    const updateData: any = {
      lastMessage: message,
      lastActivity: new Date(),
      isRead: false,
    };

    if (user.role === "ADMIN" && !chatRoom.adminId) {
      updateData.adminId = user.id;
    }

    await prisma.chatRoom.update({
      where: { id: roomId },
      data: updateData,
    });

    return NextResponse.json({ message: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
