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
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000; // 1 second
  const heartbeatInterval = 30000; // 30 seconds

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
        // Close existing connection
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        // Clear existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }

        const globalEventSource = new EventSource('/api/chat/sse?global=true');
        
        globalEventSource.onopen = () => {
          // Reset reconnect attempts on successful connection
          reconnectAttemptsRef.current = 0;
          
          // Start heartbeat to keep connection alive
          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
          }
          
          heartbeatIntervalRef.current = setInterval(() => {
            // Simply check if connection is still alive
            if (globalEventSource.readyState !== EventSource.OPEN) {
              // Connection lost, attempt reconnect
              if (user && user.role === "ADMIN") {
                connectSSE();
              }
            }
          }, heartbeatInterval);
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
          
          // Clear heartbeat
          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
          }
          
          // Close the current connection
          globalEventSource.close();
          
          // Attempt to reconnect with exponential backoff
          if (user && user.role === "ADMIN" && reconnectAttemptsRef.current < maxReconnectAttempts) {
            const delay = baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
            reconnectAttemptsRef.current += 1;
            
            reconnectTimeoutRef.current = setTimeout(() => {
              if (user && user.role === "ADMIN") {
                connectSSE();
              }
            }, delay);
          }
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
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }
      };
    }
  }, [user, fetchUnreadCount]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (user && user.role === "ADMIN") {
        if (document.visibilityState === 'visible') {
          // Page is visible again, ensure SSE connection is active
          if (!eventSourceRef.current || eventSourceRef.current.readyState === EventSource.CLOSED) {
            // Refresh count and potentially reconnect SSE
            fetchUnreadCount();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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
