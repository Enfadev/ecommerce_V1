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

    const resolvedParams = await params;
    const roomId = parseInt(resolvedParams.roomId);

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

    const messages = await (prisma as any).chatMessage.findMany({
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
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            discountPrice: true,
            imageUrl: true,
            stock: true,
            brand: true,
            sku: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
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

    const resolvedParams = await params;
    const roomId = parseInt(resolvedParams.roomId);
    const { message, messageType = "TEXT", productId } = await request.json();

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

    // Create message data
    const messageData = {
      chatRoomId: roomId,
      senderId: user.id,
      message,
      messageType,
      ...(productId && { productId: parseInt(productId) }),
    };

    const newMessage = await (prisma as any).chatMessage.create({
      data: messageData,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
            image: true,
          },
        },
        product: productId ? {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            discountPrice: true,
            imageUrl: true,
            stock: true,
            brand: true,
            sku: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        } : false,
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

    // Broadcast to SSE connections
    try {
      const broadcastUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/chat/sse`;
      await fetch(broadcastUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: roomId.toString(),
          data: {
            type: "new_message",
            message: newMessage,
          },
        }),
      });
      console.log(`📡 Broadcasting message for room ${roomId}`);
    } catch (broadcastError) {
      console.error("Failed to broadcast message:", broadcastError);
    }

    return NextResponse.json({ message: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
