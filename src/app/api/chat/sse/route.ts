import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

const connections = new Map<string, ReadableStreamDefaultController>();

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      console.error("SSE: Unauthorized user");
      return new Response("Unauthorized", { status: 401 });
    }

    const roomId = request.nextUrl.searchParams.get("roomId");
    if (!roomId) {
      console.error("SSE: Missing roomId parameter");
      return new Response("Room ID required", { status: 400 });
    }

    const chatRoom = await prisma.chatRoom.findFirst({
      where: {
        id: parseInt(roomId),
        OR: [
          { userId: user.id },
          { adminId: user.id },
          { admin: null, ...(user.role === "ADMIN" && {}) },
        ],
      },
    });

    if (!chatRoom) {
      console.error(`SSE: Chat room ${roomId} not found for user ${user.id}`);
      return new Response("Chat room not found", { status: 404 });
    }

    console.log(`SSE: Establishing connection for user ${user.id} in room ${roomId}`);
    const connectionId = `${user.id}-${roomId}`;

    const stream = new ReadableStream({
      start(controller) {
        connections.set(connectionId, controller);

        controller.enqueue(
          `data: ${JSON.stringify({
            type: "connected",
            timestamp: new Date().toISOString(),
          })}\n\n`
        );

        request.signal.addEventListener("abort", () => {
          connections.delete(connectionId);
          try {
            controller.close();
          } catch (error) {
            console.log("Controller already closed:", error);
          }
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Cache-Control",
      },
    });
  } catch (error) {
    console.error("SSE connection error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export function broadcastToRoom(roomId: number, message: object) {
  const messageData = `data: ${JSON.stringify({
    type: "message",
    data: message,
    timestamp: new Date().toISOString(),
  })}\n\n`;

  connections.forEach((controller, connectionId) => {
    if (connectionId.endsWith(`-${roomId}`)) {
      try {
        controller.enqueue(messageData);
      } catch (error) {
        console.log("Failed to send message to connection:", connectionId, error);
        connections.delete(connectionId);
      }
    }
  });
}

export function broadcastTyping(roomId: number, userId: number, isTyping: boolean) {
  const typingData = `data: ${JSON.stringify({
    type: "typing",
    data: { userId, isTyping },
    timestamp: new Date().toISOString(),
  })}\n\n`;

  connections.forEach((controller, connectionId) => {
    if (connectionId.endsWith(`-${roomId}`) && !connectionId.startsWith(`${userId}-`)) {
      try {
        controller.enqueue(typingData);
      } catch (error) {
        console.log("Failed to send typing indicator:", connectionId, error);
        connections.delete(connectionId);
      }
    }
  });
}
