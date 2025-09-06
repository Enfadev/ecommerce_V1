"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, 
  Clock, 
  User, 
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  Send
} from "lucide-react";

interface ChatRoom {
  id: number;
  status: string;
  subject: string;
  priority: string;
  lastMessage: string;
  lastActivity: string;
  isRead: boolean;
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

  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
    }
  }, [selectedRoom]);

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

  const fetchMessages = async (roomId: number) => {
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
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
        const data = await response.json();
        setMessages(prev => [...prev, data.message]);
        setNewMessage("");
        
        fetchChatRooms();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
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
      case "OPEN": return "bg-green-100 text-green-800";
      case "CLOSED": return "bg-gray-100 text-gray-800";
      case "RESOLVED": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT": return "bg-red-100 text-red-800";
      case "HIGH": return "bg-orange-100 text-orange-800";
      case "NORMAL": return "bg-yellow-100 text-yellow-800";
      case "LOW": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
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
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chat Management</h1>
        <p className="text-gray-600">Manage customer support conversations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Chats</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open</p>
                <p className="text-2xl font-bold text-green-600">{stats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Closed</p>
                <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-blue-600">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Rooms List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Chat Rooms
                <Button onClick={fetchChatRooms} variant="outline" size="sm">
                  Refresh
                </Button>
              </CardTitle>
              
              {/* Filters */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="flex-1">
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
                    onClick={() => setSelectedRoom(room)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedRoom?.id === room.id ? "bg-blue-50 border-blue-200" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={room.user.image} />
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {room.user.name}
                            </p>
                            {!room.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 truncate">
                            {room.subject}
                          </p>
                          
                          <p className="text-xs text-gray-500 truncate">
                            {room.lastMessage}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex space-x-2">
                              <Badge className={`text-xs ${getStatusColor(room.status)}`}>
                                {room.status}
                              </Badge>
                              <Badge className={`text-xs ${getPriorityColor(room.priority)}`}>
                                {room.priority}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center text-xs text-gray-500">
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

        {/* Chat Details */}
        <div className="lg:col-span-2">
          {selectedRoom ? (
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={selectedRoom.user.image} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedRoom.user.name}</CardTitle>
                      <p className="text-sm text-gray-600">{selectedRoom.user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Select
                      value={selectedRoom.status}
                      onValueChange={(value) => updateChatStatus(selectedRoom.id, value)}
                    >
                      <SelectTrigger className="w-32">
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

              <CardContent className="flex flex-col h-96">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender.role === "ADMIN" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md ${
                          message.sender.role === "ADMIN"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        } rounded-lg px-4 py-2`}
                      >
                        <div className="flex items-center mb-1">
                          <span className="text-xs font-medium">
                            {message.sender.name}
                          </span>
                          <span className="text-xs opacity-75 ml-2">
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex space-x-2">
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
                    className="flex-1"
                    disabled={isLoading || selectedRoom.status === "CLOSED"}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isLoading || selectedRoom.status === "CLOSED"}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a chat to view conversation
                </h3>
                <p className="text-gray-600">
                  Choose a chat room from the list to start responding to customer inquiries.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
