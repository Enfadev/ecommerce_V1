import { NextRequest, NextResponse } from "next/server";

// Import the connections map from the SSE route
// We need to make it available across modules
let connectionsMap: Map<string, ReadableStreamDefaultController> | null = null;

export function setConnectionsMap(connections: Map<string, ReadableStreamDefaultController>) {
  connectionsMap = connections;
}

export async function POST(request: NextRequest) {
  try {
    const { roomId, data } = await request.json();
    
    if (!roomId || !data) {
      return NextResponse.json({ error: "Missing roomId or data" }, { status: 400 });
    }

    console.log(`📡 Broadcasting to room ${roomId}:`, data);

    // Since we can't easily share the connections map between files,
    // let's use a simpler approach - send the data directly via URL params
    // and handle it in the main SSE route file
    
    // For now, let's try a different approach using global variable
    const connections = global.sseConnections as Map<string, ReadableStreamDefaultController> || new Map();
    
    let broadcasted = 0;
    
    // Broadcast to all connections for this room
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
    
    return NextResponse.json({ 
      success: true, 
      broadcasted,
      message: `Broadcasted to ${broadcasted} connections`
    });
  } catch (error) {
    console.error("Error in broadcast:", error);
    return NextResponse.json(
      { error: "Failed to broadcast message" },
      { status: 500 }
    );
  }
}
