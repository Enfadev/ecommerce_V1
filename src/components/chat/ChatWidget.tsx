"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  User, 
  Shield,
  Clock
  Paperclip
} from "lucide-react";
import { useAuth } from "@/components/contexts/auth-context";
import { ProductSearchDialog } from "./ProductSearchDialog";
import { ProductMessage } from "./ProductMessage";

interface Message {
  id: number;
  message: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
  productId?: number;
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
  sender: {
    id: number;
    name: string;
    role: string;
    image?: string;
  };
}

interface ChatRoom {
  id: number;
  status: string;
  subject: string;
  priority: string;
  lastMessage: string;
  lastActivity: string;
  isRead: boolean;
  admin?: {
    id: number;
    name: string;
    email: string;
  };
}

export function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatRooms = React.useCallback(async () => {
    try {
      const response = await fetch("/api/chat/rooms");
      if (response.ok) {
        const data = await response.json();
        if (data.chatRooms && data.chatRooms.length > 0) {
          const activeRoom = data.chatRooms.find((room: ChatRoom) => room.status === "OPEN") || data.chatRooms[0];
          setChatRoom(activeRoom);
          
          const unread = data.chatRooms.reduce((total: number, room: ChatRoom & { _count?: { messages: number } }) => {
            return total + (room._count?.messages || 0);
          }, 0);
          setUnreadCount(unread);
        }
      }
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  }, []);

  useEffect(() => {
    if (user && isOpen) {
      fetchChatRooms();
    }
  }, [user, isOpen, fetchChatRooms]);

  const setupSSEConnection = React.useCallback(() => {
    if (!chatRoom || eventSourceRef.current) return;

    const eventSource = new EventSource(`/api/chat/sse?roomId=${chatRoom.id}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "message":
          setMessages(prev => [...prev, data.data]);
          if (!isOpen || isMinimized) {
            setUnreadCount(prev => prev + 1);
          }
          break;
        case "typing":
          setIsTyping(data.data.isTyping);
          break;
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [chatRoom, isOpen, isMinimized]);

  const fetchMessages = React.useCallback(async () => {
    if (!chatRoom) return;

    try {
      const response = await fetch(`/api/chat/rooms/${chatRoom.id}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [chatRoom]);

  useEffect(() => {
    if (chatRoom && isOpen) {
      setupSSEConnection();
      fetchMessages();
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [chatRoom, isOpen, setupSSEConnection, fetchMessages]);

  const startNewChat = async () => {
    if (!newMessage.trim() || !user) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/chat/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject || "Customer Support",
          message: newMessage,
          priority: "NORMAL",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatRoom(data.chatRoom);
        setNewMessage("");
        setSubject("");
      } else {
        console.error("Failed to start chat");
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatRoom || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/chat/rooms/${chatRoom.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: newMessage,
          messageType: "TEXT",
        }),
      });

      if (response.ok) {
        setNewMessage("");
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendProductMessage = async (product: {
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
  }) => {
    if (!chatRoom) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/chat/rooms/${chatRoom.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Shared product: ${product.name}`,
          messageType: "PRODUCT",
          productId: product.id,
        }),
      });

      if (response.ok) {
        console.log("Product shared successfully");
      } else {
        console.error("Failed to share product");
      }
    } catch (error) {
      console.error("Error sharing product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (response.ok) {
        console.log("Product added to cart");
        // Optionally show toast notification
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        console.log("Product added to wishlist");
        // Optionally show toast notification
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const handleViewProduct = (productId: number) => {
    window.open(`/product/${productId}`, "_blank");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (chatRoom) {
        sendMessage();
      } else {
        startNewChat();
      }
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) return null;

  return (
    <>
      {/* Chat Widget Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-200"
            size="icon"
          >
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <Card className={`w-80 h-96 shadow-xl transition-all duration-200 ${isMinimized ? "h-14" : ""}`}>
            {/* Chat Header */}
            <CardHeader className="flex flex-row items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-lg font-semibold">
                {chatRoom ? "Customer Support" : "Start New Chat"}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-8 w-8 text-white hover:bg-blue-700"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsOpen(false);
                    setIsMinimized(false);
                  }}
                  className="h-8 w-8 text-white hover:bg-blue-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {!isMinimized && (
              <CardContent className="p-0 flex flex-col h-80">
                {chatRoom ? (
                  <>
                    {/* Chat Info */}
                    <div className="p-3 bg-gray-50 border-b">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={chatRoom.status === "OPEN" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {chatRoom.status}
                          </Badge>
                          {chatRoom.admin && (
                            <span className="text-gray-600">
                              with {chatRoom.admin.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${Number(message.sender.id) === Number(user.id) ? "justify-end" : "justify-start"}`}
                        >
                          {message.messageType === "PRODUCT" && message.product ? (
                            <div className="max-w-xs">
                              <div className="flex items-center gap-2 mb-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={message.sender.image} />
                                  <AvatarFallback className="text-xs">
                                    {message.sender.role === "ADMIN" ? (
                                      <Shield className="h-3 w-3" />
                                    ) : (
                                      <User className="h-3 w-3" />
                                    )}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-gray-600">
                                  {message.sender.name} shared a product
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatTime(message.createdAt)}
                                </span>
                              </div>
                              <ProductMessage 
                                product={message.product}
                                onAddToCart={handleAddToCart}
                                onAddToWishlist={handleAddToWishlist}
                                onViewProduct={handleViewProduct}
                                showActions={Number(message.sender.id) !== Number(user.id)}
                              />
                            </div>
                          ) : (
                            <div
                              className={`max-w-xs lg:max-w-md ${
                                Number(message.sender.id) === Number(user.id)
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-200 text-gray-800"
                              } rounded-lg px-3 py-2`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={message.sender.image} />
                                  <AvatarFallback className="text-xs">
                                    {message.sender.role === "ADMIN" ? (
                                      <Shield className="h-3 w-3" />
                                    ) : (
                                      <User className="h-3 w-3" />
                                    )}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs opacity-75">
                                  {message.sender.name}
                                </span>
                              </div>
                              <p className="text-sm">{message.message}</p>
                              <div className="flex items-center justify-end gap-1 mt-1">
                                <Clock className="h-3 w-3 opacity-50" />
                                <span className="text-xs opacity-75">
                                  {formatTime(message.createdAt)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-200 text-gray-800 rounded-lg px-3 py-2">
                            <div className="flex items-center gap-1">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                              </div>
                              <span className="text-xs text-gray-600 ml-2">Admin is typing...</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-3 border-t">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setIsProductDialogOpen(true)}
                          size="icon"
                          variant="outline"
                          className="shrink-0"
                          title="Share product"
                        >
                          <Package className="h-4 w-4" />
                        </Button>
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          className="flex-1"
                          disabled={isLoading}
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!newMessage.trim() || isLoading}
                          size="icon"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* New Chat Form */}
                    <div className="flex-1 p-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium">Subject (Optional)</label>
                        <Input
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="e.g., Product inquiry, Technical support"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Message</label>
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="How can we help you today?"
                          className="mt-1 resize-none"
                          rows={4}
                        />
                      </div>
                    </div>

                    {/* Send Button */}
                    <div className="p-4 border-t">
                      <Button
                        onClick={startNewChat}
                        disabled={!newMessage.trim() || isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        {isLoading ? "Starting..." : "Start Chat"}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            )}
          </Card>
        )}

        {/* Product Search Dialog */}
        <ProductSearchDialog
          isOpen={isProductDialogOpen}
          onClose={() => setIsProductDialogOpen(false)}
          onSelectProduct={sendProductMessage}
        />
      </div>
    </>
  );
}
