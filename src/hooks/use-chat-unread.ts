"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/components/contexts/auth-context";

// Extend Window interface
declare global {
  interface Window {
    resetChatUnreadCount?: (count: number) => void;
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
        
        console.log(`📊 Total unread count: ${totalUnread}`);
        setTotalUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error("Error fetching chat unread count:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      // Initial fetch
      fetchUnreadCount();

      // Setup global SSE for real-time updates
      console.log(`🔗 Sidebar: Setting up global SSE for total unread count`);
      const globalEventSource = new EventSource('/api/chat/sse?global=true');
      
      globalEventSource.onopen = () => {
        console.log(`✅ Sidebar: Global SSE connection opened`);
      };
      
      globalEventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Sidebar: Global SSE message received:', data);
          
          if (data.type === 'new_message' && data.message && data.roomId) {
            console.log(`📨 Sidebar: New message in room ${data.roomId}, updating total count`);
            // Increment total unread count
            setTotalUnreadCount(prev => {
              const newTotal = prev + 1;
              console.log(`📨 Sidebar: Total unread count updated from ${prev} to: ${newTotal}`);
              return newTotal;
            });
          }
        } catch (error) {
          console.error('❌ Sidebar: Error parsing global SSE message:', error);
        }
      };

      globalEventSource.onerror = (error) => {
        console.error('❌ Sidebar: Global SSE Error:', error);
      };

      eventSourceRef.current = globalEventSource;

      return () => {
        globalEventSource.close();
      };
    }
  }, [user, fetchUnreadCount]);

  // Create a global function to reset total count (called from chat dashboard)
  useEffect(() => {
    // Make the decrementUnreadCount function available globally
    window.resetChatUnreadCount = (count: number) => {
      console.log(`📨 Sidebar: Resetting ${count} unread messages`);
      setTotalUnreadCount(prev => Math.max(0, prev - count));
    };

    return () => {
      delete window.resetChatUnreadCount;
    };
  }, []);

  // Reset count when admin reads messages (can be called from outside)
  const decrementUnreadCount = (count: number = 1) => {
    setTotalUnreadCount(prev => Math.max(0, prev - count));
  };

  return { 
    totalUnreadCount, 
    decrementUnreadCount,
    refreshUnreadCount: fetchUnreadCount 
  };
}
