"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import { useChatSSE } from "@/hooks/admin/useChatSSE";
import { ChatStatsCards } from "./ChatStatsCards";
import { ChatRoomsList } from "./ChatRoomsList";
import { MessageThread } from "./MessageThread";

interface ChatRoom {
  id: number;
  status: string;
  subject: string;
  priority: string;
  lastMessage: string;
  lastActivity: string;
  isRead: boolean;
  unreadCount?: number;
  user: {
    id: number;
    name: string;
    email: string;
    image?: string;
  };
  admin?: {
    id: number;
    name: string;
    email: string;
  };
  messages: Array<{
    id: number;
    message: string;
    createdAt: string;
    sender: {
      id: number;
      name: string;
      role: string;
    };
  }>;
  _count: {
    messages: number;
  };
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
  product?: {
    id: number;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    imageUrl?: string;
    stock: number;
    brand?: string;
    sku?: string;
    category?: {
      id: number;
      name: string;
    };
  };
}

export function AdminChatDashboard() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const handleNewMessage = useCallback((message: Message) => {
    setMessages((prevMessages) => {
      const messageExists = prevMessages.some((msg) => msg.id === message.id);
      if (!messageExists) {
        return [...prevMessages, message];
      }
      return prevMessages;
    });
  }, []);

  const handleRoomUpdate = useCallback((roomId: number, data: Partial<ChatRoom>) => {
    setChatRooms((prev) =>
      prev.map((room) => {
        if (room.id === roomId) {
          return { ...room, ...data };
        }
        return room;
      })
    );
  }, []);

  // Setup SSE connections
  useChatSSE({
    selectedRoom,
    onNewMessage: handleNewMessage,
    onRoomUpdate: handleRoomUpdate,
  });

  const fetchMessages = useCallback(async (roomId: number) => {
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
    }
  }, [selectedRoom, fetchMessages]);

  const fetchChatRooms = async () => {
    try {
      const response = await fetch("/api/chat/rooms");
      if (response.ok) {
        const data = await response.json();
        setChatRooms(data.chatRooms || []);
      }
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/chat/rooms/${selectedRoom.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: newMessage,
          messageType: "TEXT",
        }),
      });

      if (response.ok) {
        await response.json();
        setNewMessage("");

        fetchChatRooms();

        if (window.refreshChatUnreadCount) {
          setTimeout(() => {
            window.refreshChatUnreadCount?.();
          }, 200);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRoomSelection = async (room: any) => {
    setSelectedRoom(room);

    if (room.unreadCount && room.unreadCount > 0) {
      try {
        await fetch(`/api/chat/rooms/${room.id}/read`, {
          method: "POST",
        });

        setChatRooms((prev) => prev.map((r) => (r.id === room.id ? { ...r, unreadCount: 0, isRead: true } : r)));

        if (window.resetChatUnreadCount && room.unreadCount) {
          window.resetChatUnreadCount(room.unreadCount);
        }

        if (window.refreshChatUnreadCount) {
          setTimeout(() => {
            window.refreshChatUnreadCount?.();
          }, 100);
        }
      } catch (error) {
        console.error("Error marking room as read:", error);
      }
    }
  };

  const updateChatStatus = async (roomId: number, status: string) => {
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}/manage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchChatRooms();
        if (selectedRoom && selectedRoom.id === roomId) {
          setSelectedRoom((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch (error) {
      console.error("Error updating chat status:", error);
    }
  };

  const updateChatPriority = async (roomId: number, priority: string) => {
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}/manage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority }),
      });

      if (response.ok) {
        fetchChatRooms();
        if (selectedRoom && selectedRoom.id === roomId) {
          setSelectedRoom((prev) => (prev ? { ...prev, priority } : null));
        }
      }
    } catch (error) {
      console.error("Error updating chat priority:", error);
    }
  };

  const getStatusStats = () => {
    return {
      total: chatRooms.length,
      open: chatRooms.filter((room) => room.status === "OPEN").length,
      closed: chatRooms.filter((room) => room.status === "CLOSED").length,
      resolved: chatRooms.filter((room) => room.status === "RESOLVED").length,
      unread: chatRooms.filter((room) => !room.isRead).length,
    };
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Chat Management</h1>
              <p className="text-muted-foreground">Monitor and manage customer support conversations</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <ChatStatsCards stats={stats} />

        {/* Chat Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Rooms List */}
          <div className="lg:col-span-1">
            <ChatRoomsList
              chatRooms={chatRooms}
              selectedRoomId={selectedRoom?.id || null}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              onRoomSelect={handleRoomSelection}
              onRefresh={fetchChatRooms}
              onSearchChange={setSearchTerm}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
            />
          </div>

          {/* Message Thread */}
          <div className="lg:col-span-2">
            <MessageThread
              selectedRoom={selectedRoom}
              messages={messages}
              newMessage={newMessage}
              isLoading={isLoading}
              onNewMessageChange={setNewMessage}
              onSendMessage={sendMessage}
              onStatusChange={updateChatStatus}
              onPriorityChange={updateChatPriority}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
