"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/components/contexts/auth-context";

declare global {
  interface Window {
    resetChatUnreadCount?: (count: number) => void;
    refreshChatUnreadCount?: () => void;
  }
}

export function useChatUnreadCount() {
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const { user } = useAuth();
  const eventSourceRef = useRef<EventSource | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    if (!user || user.role !== "ADMIN") return;

    try {
      const response = await fetch("/api/chat/rooms");
      if (response.ok) {
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const totalUnread = data.chatRooms?.reduce((total: number, room: any) => {
          return total + (room.unreadCount || 0);
        }, 0) || 0;
        
        setTotalUnreadCount(totalUnread);
        return totalUnread;
      }
    } catch (error) {
      console.error("Error fetching chat unread count:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      fetchUnreadCount();

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      const connectSSE = () => {
        const globalEventSource = new EventSource('/api/chat/sse?global=true');
        
        globalEventSource.onopen = () => {
        };
        
        globalEventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'new_message' && data.message && data.roomId) {
              fetchUnreadCount();
              
              setTotalUnreadCount(prev => prev + 1);
            }
          } catch (error) {
            console.error('Error parsing global SSE message:', error);
          }
        };

        globalEventSource.onerror = (error) => {
          console.error('SSE connection error:', error);
          setTimeout(() => {
            if (user && user.role === "ADMIN" && globalEventSource.readyState === EventSource.CLOSED) {
              connectSSE();
            }
          }, 3000);
        };

        eventSourceRef.current = globalEventSource;
        return globalEventSource;
      };

      const eventSource = connectSSE();

      return () => {
        if (eventSource) {
          eventSource.close();
        }
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
      };
    }
  }, [user, fetchUnreadCount]);

  useEffect(() => {
    window.resetChatUnreadCount = (count: number) => {
      setTotalUnreadCount(prev => Math.max(0, prev - count));
    };

    window.refreshChatUnreadCount = () => {
      fetchUnreadCount();
    };

    return () => {
      delete window.resetChatUnreadCount;
      delete window.refreshChatUnreadCount;
    };
  }, [fetchUnreadCount]);

  const decrementUnreadCount = (count: number = 1) => {
    setTotalUnreadCount(prev => Math.max(0, prev - count));
  };

  return { 
    totalUnreadCount, 
    decrementUnreadCount,
    refreshUnreadCount: fetchUnreadCount 
  };
}
