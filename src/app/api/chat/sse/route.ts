import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

const connections = new Map<string, ReadableStreamDefaultController>();

// Make connections available globally for broadcasting
declare global {
  var sseConnections: Map<string, ReadableStreamDefaultController>;
}
global.sseConnections = connections;

// Broadcasting function
export function broadcastToRoom(roomId: string, data: Record<string, unknown>) {
  console.log(`📡 Broadcasting to room ${roomId}:`, data);
  let broadcasted = 0;
  
  for (const [connectionId, controller] of connections.entries()) {
    // Connection ID format is "userId-roomId"
    if (connectionId.endsWith(`-${roomId}`)) {
      try {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
        broadcasted++;
        console.log(`📡 Sent to connection: ${connectionId}`);
      } catch (error) {
        console.error(`Failed to send to connection ${connectionId}:`, error);
        // Remove dead connection
        connections.delete(connectionId);
      }
    }
  }
  
  console.log(`📡 Broadcasted to ${broadcasted} connections for room ${roomId}`);
  return broadcasted;
}

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chatRoom = await (prisma as any).chatRoom.findFirst({
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

// POST method for broadcasting messages
export async function POST(request: NextRequest) {
  try {
    const { roomId, data } = await request.json();
    
    if (!roomId || !data) {
      return NextResponse.json({ error: "Missing roomId or data" }, { status: 400 });
    }

    const broadcasted = broadcastToRoom(roomId, data);
    
    return NextResponse.json({ 
      success: true, 
      broadcasted,
      message: `Broadcasted to ${broadcasted} connections`
    });
  } catch (error) {
    console.error("Error in broadcast POST:", error);
    return NextResponse.json(
      { error: "Failed to broadcast message" },
      { status: 500 }
    );
  }
}
