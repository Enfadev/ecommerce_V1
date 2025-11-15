import { useEffect, useRef } from "react";

interface ChatRoom {
  id: number;
  status: string;
  unreadCount?: number;
  lastMessage: string;
  lastActivity: string;
  isRead: boolean;
}

interface Message {
  id: number;
  message: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: number;
    name: string;
    role: string;
    image?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product?: any;
}

interface UseChatSSEProps {
  selectedRoom: ChatRoom | null;
  onNewMessage: (message: Message) => void;
  onRoomUpdate: (roomId: number, data: Partial<ChatRoom>) => void;
}

export function useChatSSE({ selectedRoom, onNewMessage, onRoomUpdate }: UseChatSSEProps) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const globalEventSourceRef = useRef<EventSource | null>(null);

  // Setup global event source for all rooms
  useEffect(() => {
    const globalEventSource = new EventSource("/api/chat/sse?global=true");

    globalEventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "new_message" && data.message && data.roomId) {
          onRoomUpdate(data.roomId, {
            unreadCount: data.unreadCount,
            lastMessage: data.message.message,
            lastActivity: data.message.createdAt,
            isRead: false,
          });
        }
      } catch (error) {
        console.error("Error parsing global SSE message:", error);
      }
    };

    globalEventSource.onerror = (error) => {
      console.error("Global SSE Error:", error);
    };

    globalEventSourceRef.current = globalEventSource;

    return () => {
      globalEventSource.close();
    };
  }, [onRoomUpdate]);

  // Setup room-specific event source
  useEffect(() => {
    if (!selectedRoom) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const newEventSource = new EventSource(`/api/chat/sse?roomId=${selectedRoom.id}`);

    newEventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "new_message" && data.message) {
          onNewMessage(data.message);
        }
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };

    newEventSource.onerror = (error) => {
      console.error("SSE Error:", error);
    };

    eventSourceRef.current = newEventSource;

    return () => {
      newEventSource.close();
    };
  }, [selectedRoom, onNewMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (globalEventSourceRef.current) {
        globalEventSourceRef.current.close();
      }
    };
  }, []);

  return {
    isConnected: Boolean(eventSourceRef.current || globalEventSourceRef.current),
  };
}
