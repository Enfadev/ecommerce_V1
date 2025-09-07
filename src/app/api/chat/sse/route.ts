import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

const connections = new Map<string, ReadableStreamDefaultController>();

declare global {
  var sseConnections: Map<string, ReadableStreamDefaultController>;
}
global.sseConnections = connections;

export function broadcastToRoom(roomId: string, data: Record<string, unknown>) {
  console.log(`📡 Broadcasting to room ${roomId}:`, data);
  let broadcasted = 0;
  let globalBroadcasted = 0;
  
  for (const [connectionId, controller] of connections.entries()) {
    try {
      if (connectionId.endsWith(`-${roomId}`)) {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
        broadcasted++;
        console.log(`📡 Sent to room connection: ${connectionId}`);
      } else if (connectionId.endsWith('-global')) {
        const broadcastData = { ...data, roomId: parseInt(roomId) };
        controller.enqueue(`data: ${JSON.stringify(broadcastData)}\n\n`);
        globalBroadcasted++;
        console.log(`📡 Sent to global connection: ${connectionId}`);
      }
    } catch (error) {
      console.error(`Failed to send to connection ${connectionId}:`, error);
      connections.delete(connectionId);
    }
  }
  
  console.log(`📡 Broadcasted to ${broadcasted} room connections and ${globalBroadcasted} global connections for room ${roomId}`);
  return broadcasted + globalBroadcasted;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      console.error("SSE: Unauthorized user");
      return new Response("Unauthorized", { status: 401 });
    }

    const roomId = request.nextUrl.searchParams.get("roomId");
    const isGlobal = request.nextUrl.searchParams.get("global") === "true";
    
    if (!roomId && !isGlobal) {
      console.error("SSE: Missing roomId parameter or global flag");
      return new Response("Room ID required or set global=true", { status: 400 });
    }

    if (!isGlobal) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const chatRoom = await (prisma as any).chatRoom.findFirst({
        where: {
          id: parseInt(roomId!),
          OR: [
            { userId: user.id },
            { adminId: user.id },
            { admin: null, ...(user.role === "ADMIN" && {}) },
          ],
        },
      });

      if (!chatRoom) {
        return new Response("Chat room not found", { status: 404 });
      }
    }

    const connectionType = isGlobal ? 'global' : roomId;
    const connectionId = `${user.id}-${connectionType}`;

    const stream = new ReadableStream({
      start(controller) {
        connections.set(connectionId, controller);

        controller.enqueue(
          `data: ${JSON.stringify({
            type: "connected",
            timestamp: new Date().toISOString(),
            isGlobal,
            roomId: isGlobal ? null : roomId
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
