declare global {
  var sseConnections: Map<string, ReadableStreamDefaultController>;
}

if (!global.sseConnections) {
  global.sseConnections = new Map<string, ReadableStreamDefaultController>();
}

export function broadcastToRoom(roomId: string, data: Record<string, unknown>) {
  const connections = global.sseConnections;
  console.log(`📡 Broadcasting to room ${roomId}:`, data);
  let broadcasted = 0;
  let globalBroadcasted = 0;
  const staleConnections: string[] = [];

  for (const [connectionId, controller] of connections.entries()) {
    try {
      if (connectionId.endsWith(`-${roomId}`)) {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
        broadcasted++;
        console.log(`📡 Sent to room connection: ${connectionId}`);
      } else if (connectionId.endsWith("-global")) {
        const broadcastData = { ...data, roomId: parseInt(roomId) };
        controller.enqueue(`data: ${JSON.stringify(broadcastData)}\n\n`);
        globalBroadcasted++;
        console.log(`📡 Sent to global connection: ${connectionId}`);
      }
    } catch {
      console.log(`Connection ${connectionId} appears stale, marking for cleanup`);
      staleConnections.push(connectionId);
    }
  }

  staleConnections.forEach((connectionId) => {
    connections.delete(connectionId);
  });

  console.log(`📡 Broadcasted to ${broadcasted} room connections and ${globalBroadcasted} global connections for room ${roomId}`);
  if (staleConnections.length > 0) {
    console.log(`🧹 Cleaned up ${staleConnections.length} stale connections`);
  }

  return broadcasted + globalBroadcasted;
}

export function broadcastTyping(roomId: number, userId: number, isTyping: boolean) {
  const typingData = `data: ${JSON.stringify({
    type: "typing",
    data: { userId, isTyping },
    timestamp: new Date().toISOString(),
  })}\n\n`;

  global.sseConnections.forEach((controller: ReadableStreamDefaultController, connectionId: string) => {
    if (connectionId.endsWith(`-${roomId}`) && !connectionId.startsWith(`${userId}-`)) {
      try {
        controller.enqueue(typingData);
      } catch (error) {
        console.log("Failed to send typing indicator:", connectionId, error);
        global.sseConnections.delete(connectionId);
      }
    }
  });
}
