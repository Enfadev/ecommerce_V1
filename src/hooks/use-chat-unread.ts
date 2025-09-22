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
  const fallbackPollingRef = useRef<NodeJS.Timeout | null>(null);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000; // 1 second
  const heartbeatInterval = 30000; // 30 seconds
  const fallbackPollingInterval = 15000; // 15 seconds fallback

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
          
          // Clear fallback polling if SSE reconnects successfully
          if (fallbackPollingRef.current) {
            clearInterval(fallbackPollingRef.current);
            fallbackPollingRef.current = null;
          }
          
          // Start heartbeat to keep connection alive
          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
          }
          
          heartbeatIntervalRef.current = setInterval(() => {
            // Check if connection is still alive and working
            if (globalEventSource.readyState !== EventSource.OPEN) {
              // Connection lost, clear interval and attempt reconnect
              if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
                heartbeatIntervalRef.current = null;
              }
              if (user && user.role === "ADMIN") {
                connectSSE();
              }
            }
          }, heartbeatInterval);
        };
        
        globalEventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Handle heartbeat messages
            if (data.type === 'heartbeat') {
              // Just acknowledge heartbeat, no action needed
              return;
            }
            
            if (data.type === 'new_message' && data.message && data.roomId) {
              fetchUnreadCount();
              
              setTotalUnreadCount(prev => prev + 1);
            }
          } catch (error) {
            console.error('Error parsing global SSE message:', error);
          }
        };

        globalEventSource.onerror = (error) => {
          // Only log meaningful errors, not connection timeout/idle errors
        const isConnectionTimeout = globalEventSource.readyState === EventSource.CLOSED;
        // Silent handling for connection timeout - ini adalah behavior normal
        if (!isConnectionTimeout) {
          // Log hanya untuk development debugging
          if (process.env.NODE_ENV === 'development') {
            console.warn('SSE connection error (non-timeout):', error);
          }
        }          // Clear heartbeat
          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
          }
          
          // Close the current connection gracefully
          try {
            if (globalEventSource.readyState !== EventSource.CLOSED) {
              globalEventSource.close();
            }
          } catch {
            // Ignore close errors - connection might already be closed
          }
          
          // Only attempt to reconnect if we're still in an active admin session
          // and the connection wasn't closed intentionally
          if (user && user.role === "ADMIN" && 
              document.visibilityState === 'visible' && 
              reconnectAttemptsRef.current < maxReconnectAttempts) {
            
            const delay = baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
            reconnectAttemptsRef.current += 1;
            
            reconnectTimeoutRef.current = setTimeout(() => {
              // Double-check we're still in an active admin session before reconnecting
              if (user && user.role === "ADMIN" && document.visibilityState === 'visible') {
                connectSSE();
              }
            }, delay);
          } else if (reconnectAttemptsRef.current >= maxReconnectAttempts && 
                     user && user.role === "ADMIN" && 
                     document.visibilityState === 'visible') {
            // SSE failed multiple times, fallback to polling only if page is visible
            fallbackPollingRef.current = setInterval(() => {
              if (user && user.role === "ADMIN" && document.visibilityState === 'visible') {
                fetchUnreadCount();
              }
            }, fallbackPollingInterval);
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
        if (fallbackPollingRef.current) {
          clearInterval(fallbackPollingRef.current);
          fallbackPollingRef.current = null;
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
            // Reset reconnect attempts when page becomes visible again
            reconnectAttemptsRef.current = 0;
            // Refresh count and potentially reconnect SSE
            fetchUnreadCount();
          }
        } else {
          // Page is hidden, stop reconnection attempts to prevent errors
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
          // Clear fallback polling when page is hidden
          if (fallbackPollingRef.current) {
            clearInterval(fallbackPollingRef.current);
            fallbackPollingRef.current = null;
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
