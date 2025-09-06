import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let chatRooms;

    if (user.role === "ADMIN") {
      chatRooms = await (prisma as any).chatRoom.findMany({
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
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  role: true,
                },
              },
            },
          },
          _count: {
            select: {
              messages: {
                where: {
                  isRead: false,
                  sender: {
                    role: "USER",
                  },
                },
              },
            },
          },
        },
        orderBy: { lastActivity: "desc" },
      });
    } else {
      chatRooms = await (prisma as any).chatRoom.findMany({
        where: { userId: user.id },
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  role: true,
                },
              },
            },
          },
          _count: {
            select: {
              messages: {
                where: {
                  isRead: false,
                  sender: {
                    role: "ADMIN",
                  },
                },
              },
            },
          },
        },
        orderBy: { lastActivity: "desc" },
      });
    }

    // Format the response to include unreadCount
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedChatRooms = chatRooms.map((room: any) => ({
      ...room,
      unreadCount: room._count.messages,
    }));

    return NextResponse.json({ chatRooms: formattedChatRooms });
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat rooms" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, message, priority = "NORMAL" } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingRoom = await (prisma as any).chatRoom.findFirst({
      where: {
        userId: user.id,
        status: "OPEN",
      },
    });

    if (existingRoom) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newMessage = await (prisma as any).chatMessage.create({
        data: {
          chatRoomId: existingRoom.id,
          senderId: user.id,
          message,
          messageType: "TEXT",
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (prisma as any).chatRoom.update({
        where: { id: existingRoom.id },
        data: {
          lastMessage: message,
          lastActivity: new Date(),
          isRead: false,
        },
      });

      return NextResponse.json({
        chatRoom: existingRoom,
        message: newMessage,
        success: true,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chatRoom = await (prisma as any).chatRoom.create({
      data: {
        userId: user.id,
        subject: subject || "Customer Support",
        priority,
        lastMessage: message,
        lastActivity: new Date(),
        isRead: false,
        messages: {
          create: {
            senderId: user.id,
            message,
            messageType: "TEXT",
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ 
      chatRoom,
      success: true,
    });
  } catch (error) {
    console.error("Error creating chat room:", error);
    return NextResponse.json(
      { error: "Failed to create chat room" },
      { status: 500 }
    );
  }
}
