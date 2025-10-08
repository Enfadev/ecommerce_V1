import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { roomId, data } = await request.json();

    if (!roomId || !data) {
      return NextResponse.json({ error: "Missing roomId or data" }, { status: 400 });
    }

    console.log(`📡 Broadcasting to room ${roomId}:`, data);

    const connections = (global.sseConnections as Map<string, ReadableStreamDefaultController>) || new Map();

    let broadcasted = 0;

    for (const [connectionId, controller] of connections.entries()) {
      if (connectionId.endsWith(`-${roomId}`)) {
        try {
          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
          broadcasted++;
          console.log(`📡 Sent to connection: ${connectionId}`);
        } catch (error) {
          console.error(`Failed to send to connection ${connectionId}:`, error);
          connections.delete(connectionId);
        }
      }
    }

    console.log(`📡 Broadcasted to ${broadcasted} connections for room ${roomId}`);

    return NextResponse.json({
      success: true,
      broadcasted,
      message: `Broadcasted to ${broadcasted} connections`,
    });
  } catch (error) {
    console.error("Error in broadcast:", error);
    return NextResponse.json({ error: "Failed to broadcast message" }, { status: 500 });
  }
}
