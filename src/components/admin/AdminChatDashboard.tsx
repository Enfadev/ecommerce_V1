"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductMessage } from "@/components/chat/ProductMessage";
import { 
  MessageSquare, 
  Clock, 
  User, 
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  Send,
  RotateCcw
} from "lucide-react";

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
  const eventSourceRef = useRef<EventSource | null>(null);
  const globalEventSourceRef = useRef<EventSource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = useCallback(async (roomId: number) => {
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setTimeout(() => scrollToBottom(), 100);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  useEffect(() => {
    fetchChatRooms();
    
    const globalEventSource = new EventSource('/api/chat/sse?global=true');
    
    globalEventSource.onopen = () => {
    };
    
    globalEventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_message' && data.message && data.roomId) {
          setChatRooms(prev => prev.map(room => {
            if (room.id === data.roomId) {
              return {
                ...room,
                unreadCount: (room.unreadCount || 0) + 1,
                lastMessage: data.message.message,
                lastActivity: data.message.createdAt,
                isRead: false
              };
            }
            return room;
          }));
        }
      } catch (error) {
        console.error('Error parsing global SSE message:', error);
      }
    };
    
    globalEventSource.onerror = (error) => {
      console.error('Global SSE Error:', error);
    };
    
    globalEventSourceRef.current = globalEventSource;
    
    return () => {
      globalEventSource.close();
    };
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
    }
  }, [selectedRoom, fetchMessages]);

  useEffect(() => {
    if (selectedRoom) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const newEventSource = new EventSource(`/api/chat/sse?roomId=${selectedRoom.id}`);
      
      newEventSource.onopen = () => {
      };
      
      newEventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "new_message" && data.message) {
            setMessages(prevMessages => {
              const messageExists = prevMessages.some(msg => msg.id === data.message.id);
              if (!messageExists) {
                const newMessages = [...prevMessages, data.message];
                setTimeout(() => scrollToBottom(), 100);
                return newMessages;
              }
              return prevMessages;
            });
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
    }
  }, [selectedRoom]);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

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

  const handleRoomSelection = async (room: ChatRoom) => {
    setSelectedRoom(room);
    
    if (room.unreadCount && room.unreadCount > 0) {
      try {
        await fetch(`/api/chat/rooms/${room.id}/read`, {
          method: 'POST'
        });
        
        setChatRooms(prev => prev.map(r => 
          r.id === room.id 
            ? { ...r, unreadCount: 0, isRead: true }
            : r
        ));
        
        if (window.resetChatUnreadCount && room.unreadCount) {
          window.resetChatUnreadCount(room.unreadCount);
        }
        
        if (window.refreshChatUnreadCount) {
          setTimeout(() => {
            window.refreshChatUnreadCount?.();
          }, 100);
        }
      } catch (error) {
        console.error('Error marking room as read:', error);
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
          setSelectedRoom(prev => prev ? { ...prev, status } : null);
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
          setSelectedRoom(prev => prev ? { ...prev, priority } : null);
        }
      }
    } catch (error) {
      console.error("Error updating chat priority:", error);
    }
  };

  const filteredChatRooms = chatRooms.filter(room => {
    const matchesSearch = 
      room.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || room.status === statusFilter.toUpperCase();
    const matchesPriority = priorityFilter === "all" || room.priority === priorityFilter.toUpperCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "CLOSED": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "RESOLVED": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "HIGH": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "NORMAL": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "LOW": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStats = () => {
    return {
      total: chatRooms.length,
      open: chatRooms.filter(room => room.status === "OPEN").length,
      closed: chatRooms.filter(room => room.status === "CLOSED").length,
      resolved: chatRooms.filter(room => room.status === "RESOLVED").length,
      unread: chatRooms.filter(room => !room.isRead).length,
    };
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Modern Header */}
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

        {/* Modern Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Chats</p>
                  <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Open</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.open}</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Closed</p>
                  <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">{stats.closed}</p>
                </div>
                <div className="p-3 bg-gray-500/10 rounded-full">
                  <XCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.resolved}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Unread</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.unread}</p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Modern Chat Rooms List */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-foreground">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Chat Rooms
                </div>
                <Button onClick={fetchChatRooms} variant="outline" size="sm" className="hover:bg-primary/5">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardTitle>
              
              {/* Modern Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-0 bg-muted/50 focus:bg-background transition-colors"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="flex-1 border-0 bg-muted/50 focus:bg-background">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredChatRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => handleRoomSelection(room)}
                    className={`p-4 border-b border-border/50 cursor-pointer hover:bg-muted/30 transition-all duration-200 ${
                      selectedRoom?.id === room.id 
                        ? "bg-primary/5 border-l-4 border-l-primary" 
                        : "hover:border-l-4 hover:border-l-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                          <AvatarImage src={room.user.image} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {room.user.name}
                            </p>
                            <div className="flex items-center space-x-2">
                              {room.unreadCount && room.unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs min-w-[20px] h-5 flex items-center justify-center px-1.5 animate-pulse">
                                  {room.unreadCount > 99 ? '99+' : room.unreadCount}
                                </Badge>
                              )}
                              {!room.isRead && (
                                <div className="flex items-center justify-center w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-foreground/80 truncate font-medium mb-1">
                            {room.subject}
                          </p>
                          
                          <p className="text-xs text-muted-foreground truncate mb-3 line-clamp-2">
                            {room.lastMessage}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              <Badge variant="secondary" className={`text-xs ${getStatusColor(room.status)}`}>
                                {room.status}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${getPriorityColor(room.priority)}`}>
                                {room.priority}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTime(room.lastActivity)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredChatRooms.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p>No chat rooms found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Chat Details */}
        <div className="lg:col-span-2">
          {selectedRoom ? (
            <Card className="h-full border-0 shadow-sm bg-card">
              <CardHeader className="border-b border-border/50 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 ring-2 ring-background shadow-md">
                      <AvatarImage src={selectedRoom.user.image} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <CardTitle className="text-xl text-foreground">{selectedRoom.user.name}</CardTitle>
                      <p className="text-sm text-muted-foreground font-medium">{selectedRoom.user.email}</p>
                      <p className="text-xs text-primary font-semibold">{selectedRoom.subject}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Select
                      value={selectedRoom.status}
                      onValueChange={(value) => updateChatStatus(selectedRoom.id, value)}
                    >
                      <SelectTrigger className="w-32 border-0 bg-background shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">Open</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={selectedRoom.priority}
                      onValueChange={(value) => updateChatPriority(selectedRoom.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="NORMAL">Normal</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col h-96 p-0">
                {/* Modern Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender.role === "ADMIN" ? "justify-end" : "justify-start"}`}
                    >
                      {message.messageType === "PRODUCT" && message.product ? (
                        <ProductMessage
                          product={message.product}
                          asBubble={true}
                          isFromAdmin={message.sender.role === "ADMIN"}
                          senderName={message.sender.name}
                          timestamp={formatTime(message.createdAt)}
                          showActions={true}
                        />
                      ) : (
                        <div className="max-w-[240px]">
                          <div
                            className={`rounded-lg px-3 py-2 text-sm ${
                              message.sender.role === "ADMIN"
                                ? "bg-slate-100 text-slate-900 border border-slate-200 ml-auto dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
                                : "bg-muted/50 text-foreground border border-border"
                            }`}
                          >
                            <p className="leading-relaxed">{message.message}</p>
                            <div className="text-xs mt-1 flex justify-between items-center text-muted-foreground">
                              <span>{formatTime(message.createdAt)}</span>
                              <span className="text-xs font-medium">{message.sender.name}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Modern Message Input */}
                <div className="border-t border-border/50 p-4 bg-background">
                  <div className="flex space-x-3">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Type your reply..."
                      className="flex-1 border-0 bg-muted/50 focus:bg-background transition-colors"
                      disabled={isLoading || selectedRoom.status === "CLOSED"}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isLoading || selectedRoom.status === "CLOSED"}
                      size="icon"
                      className="shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center border-0 shadow-sm bg-card">
              <CardContent className="text-center p-8">
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <MessageSquare className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Select a chat to view conversation
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Choose a chat room from the list to start responding to customer inquiries and manage support conversations.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
