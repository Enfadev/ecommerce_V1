"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/contexts/auth-context";
import { useChatUnreadCount } from "@/hooks/use-chat-unread";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";

export function ChatDebugInfo() {
  const { user } = useAuth();
  const { totalUnreadCount, refreshUnreadCount } = useChatUnreadCount();
  const [sseStatus, setSseStatus] = useState<'connecting' | 'connected' | 'error' | 'closed'>('connecting');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      // Monitor SSE connection status
      const eventSource = new EventSource('/api/chat/sse?global=true');
      
      eventSource.onopen = () => {
        console.log('🔍 Debug: SSE connection opened');
        setSseStatus('connected');
        setLastUpdate(new Date());
      };
      
      eventSource.onmessage = (event) => {
        console.log('🔍 Debug: SSE message received:', event.data);
        setLastUpdate(new Date());
      };
      
      eventSource.onerror = () => {
        console.log('🔍 Debug: SSE connection error');
        setSseStatus('error');
      };

      return () => {
        eventSource.close();
        setSseStatus('closed');
      };
    }
  }, [user]);

  const handleManualRefresh = () => {
    console.log('🔍 Debug: Manual refresh triggered');
    if (refreshUnreadCount) {
      refreshUnreadCount();
      setLastUpdate(new Date());
    }
    
    // Also trigger global window refresh function
    if (window.refreshChatUnreadCount) {
      window.refreshChatUnreadCount();
    }
  };

  if (user?.role !== "ADMIN") return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-background/95 backdrop-blur-sm border shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <div className="flex items-center gap-2">
            {sseStatus === 'connected' ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            Chat Debug Info
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">SSE Status:</span>
          <Badge variant={sseStatus === 'connected' ? 'default' : 'destructive'}>
            {sseStatus}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Unread Count:</span>
          <Badge variant="outline" className="font-semibold">
            {totalUnreadCount}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Last Update:</span>
          <span className="text-xs text-muted-foreground">
            {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
          </span>
        </div>
        
        <Button 
          onClick={handleManualRefresh} 
          size="sm" 
          variant="outline" 
          className="w-full"
        >
          <RefreshCw className="h-3 w-3 mr-2" />
          Manual Refresh
        </Button>
      </CardContent>
    </Card>
  );
}
