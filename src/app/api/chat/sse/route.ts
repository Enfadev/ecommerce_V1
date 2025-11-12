import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { broadcastToRoom } from "@/lib/sse-utils";

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
          OR: [{ userId: user.id }, { adminId: user.id }, { admin: null, ...(user.role === "ADMIN" && {}) }],
        },
      });

      if (!chatRoom) {
        return new Response("Chat room not found", { status: 404 });
      }
    }

    const connectionType = isGlobal ? "global" : roomId;
    const connectionId = `${user.id}-${connectionType}`;

    const stream = new ReadableStream({
      start(controller) {
        global.sseConnections.set(connectionId, controller);

        controller.enqueue(
          `data: ${JSON.stringify({
            type: "connected",
            timestamp: new Date().toISOString(),
            isGlobal,
            roomId: isGlobal ? null : roomId,
          })}\n\n`
        );

        let heartbeatInterval: NodeJS.Timeout | null = null;
        if (isGlobal) {
          heartbeatInterval = setInterval(() => {
            try {
              if (global.sseConnections.has(connectionId)) {
                controller.enqueue(
                  `data: ${JSON.stringify({
                    type: "heartbeat",
                    timestamp: new Date().toISOString(),
                  })}\n\n`
                );
              } else {
                if (heartbeatInterval) {
                  clearInterval(heartbeatInterval);
                }
              }
            } catch {
              if (heartbeatInterval) {
                clearInterval(heartbeatInterval);
                heartbeatInterval = null;
              }
              global.sseConnections.delete(connectionId);
            }
          }, 25000);
        }

        const cleanup = () => {
          if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
          }
          global.sseConnections.delete(connectionId);
          try {
            controller.close();
          } catch {
          }
        };

        request.signal.addEventListener("abort", cleanup);

        if (typeof window === "undefined") {
          const timeoutCleanup = setTimeout(() => {
            if (global.sseConnections.has(connectionId)) {
              console.log(`Cleaning up stale SSE connection: ${connectionId}`);
              cleanup();
            }
          }, 300000);

          request.signal.addEventListener("abort", () => {
            clearTimeout(timeoutCleanup);
          });
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
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
      message: `Broadcasted to ${broadcasted} connections`,
    });
  } catch (error) {
    console.error("Error in broadcast POST:", error);
    return NextResponse.json({ error: "Failed to broadcast message" }, { status: 500 });
  }
}
