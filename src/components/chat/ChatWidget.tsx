'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Package, 
  Shield,
  CheckCheck
} from "lucide-react";
import { useAuth } from "@/components/contexts/auth-context";
import { ProductSearchDialog } from "./ProductSearchDialog";
import { ProductMessage } from "./ProductMessage";

interface ChatRoom {
  id: number;
  subject?: string;
  status: "OPEN" | "CLOSED";
  createdAt: string;
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
    image?: string;
  };
  _count: {
    messages: number;
  };
  unreadCount?: number;
}

interface ChatMessage {
  id: number;
  message: string;
  messageType: "TEXT" | "IMAGE" | "FILE" | "PRODUCT";
  createdAt: string;
  sender: {
    id: number;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
    image?: string;
  };
  product?: {
    id: number;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    image?: string;
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

export function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format time utility
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const loadMessages = useCallback(async (roomId: number) => {
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Load messages response:", data); // Debug log
        setMessages(data.messages || []);
      } else {
        console.error("Failed to load messages:", response.status);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);

  const loadChatRoom = useCallback(async () => {
    try {
      const response = await fetch('/api/chat/rooms');
      if (response.ok) {
        const data = await response.json();
        console.log("Load chat room response:", data); // Debug log
        
        if (data.chatRooms && data.chatRooms.length > 0) {
          const room = data.chatRooms[0];
          setChatRoom(room);
          setUnreadCount(room.unreadCount || 0);
          await loadMessages(room.id);
        } else {
          console.log("No existing chat rooms found");
        }
      } else {
        console.error("Failed to load chat rooms:", response.status);
      }
    } catch (error) {
      console.error('Error loading chat room:', error);
    }
  }, [loadMessages]);

  const markMessagesAsRead = useCallback(async () => {
    if (!chatRoom) return;
    
    try {
      await fetch(`/api/chat/rooms/${chatRoom.id}/read`, {
        method: 'POST'
      });
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [chatRoom]);

  // Load chat room when component mounts
  useEffect(() => {
    if (user) {
      loadChatRoom();
    }
  }, [user, loadChatRoom]);

  // Setup SSE for real-time messages
  useEffect(() => {
    // Only setup SSE if we have a chat room and chat is open
    if (chatRoom && user && isOpen) {
      const eventSource = new EventSource(`/api/chat/sse?userId=${user.id}`);
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'NEW_MESSAGE' && data.roomId === chatRoom.id) {
            setMessages(prev => [...prev, data.message]);
            // Mark message as read if chat is open
            if (isOpen && !isMinimized) {
              markMessagesAsRead();
            }
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      eventSource.onerror = () => {
        console.warn('SSE connection failed, chat will work without real-time updates');
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [chatRoom, user, isOpen, isMinimized, markMessagesAsRead]);

  // Mark messages as read when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && chatRoom && unreadCount > 0) {
      markMessagesAsRead();
    }
  }, [isOpen, isMinimized, chatRoom, unreadCount, markMessagesAsRead]);

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

  const startNewChat = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/chat/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim() || undefined,
          message: newMessage, // Changed from initialMessage to message
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data); // Debug log
        
        // Handle both new chat room and existing room scenarios
        if (data.chatRoom) {
          setChatRoom(data.chatRoom);
          
          // Set messages from the chat room data
          if (data.chatRoom.messages && data.chatRoom.messages.length > 0) {
            setMessages(data.chatRoom.messages);
            console.log("Messages set from chatRoom.messages:", data.chatRoom.messages);
          } else if (data.message) {
            // If there's a separate message object (for existing rooms)
            setMessages([data.message]);
            console.log("Messages set from data.message:", data.message);
          } else {
            // Fallback: load messages separately
            console.log("Loading messages separately for room:", data.chatRoom.id);
            await loadMessages(data.chatRoom.id);
          }
          
          setNewMessage("");
          setSubject("");
        } else {
          console.error("No chatRoom in response:", data);
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to create chat room:", errorData);
      }
    } catch (error) {
      console.error("Error creating chat room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatRoom) return;

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

  if (!user) return null;

  return (
    <>
      {/* Chat Widget Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <div className="relative group">
            <Button
              onClick={() => setIsOpen(true)}
              className="h-12 w-12 rounded-full bg-card border border-border shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-foreground"
              variant="outline"
            >
              <MessageCircle className="h-5 w-5" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </div>
              )}
            </Button>
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-sm border border-border">
              Need help? Chat with us
              <div className="absolute top-full right-3 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-border"></div>
            </div>
          </div>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div className={`bg-card rounded-lg shadow-lg transition-all duration-300 ${
            isMinimized ? "h-12 w-80" : "h-[480px] w-80"
          } border border-border overflow-hidden`}>
            {/* Chat Header */}
            <div className="bg-muted/50 text-foreground p-3 rounded-t-lg border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Avatar className="h-7 w-7 border border-border">
                      <AvatarImage src="/logo.svg" />
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                        <Shield className="h-3.5 w-3.5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 rounded-full border border-card"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-foreground">
                      {chatRoom ? "Customer Support" : "Start New Chat"}
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      {chatRoom ? "We're here to help" : "How can we assist you?"}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  >
                    <Minimize2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsOpen(false);
                      setIsMinimized(false);
                    }}
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <div className="flex flex-col h-[406px]">
                {/* Debug info */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="p-2 bg-yellow-100 text-xs">
                    ChatRoom: {chatRoom ? 'Yes' : 'No'} | Messages: {messages.length}
                  </div>
                )}
                
                {chatRoom ? (
                  <>
                    {/* Chat Info */}
                    <div className="px-3 py-2 bg-muted/30 border-b border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                          <Badge 
                            variant={chatRoom.status === "OPEN" ? "secondary" : "outline"}
                            className="text-xs h-5"
                          >
                            {chatRoom.status}
                          </Badge>
                          {chatRoom.admin && (
                            <span className="text-xs text-muted-foreground">
                              with {chatRoom.admin.name}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">Online</span>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-background/50">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${Number(message.sender.id) === Number(user.id) ? "justify-end" : "justify-start"}`}
                        >
                          {message.messageType === "PRODUCT" && message.product ? (
                            <div className="max-w-[240px]">
                              <div className="flex items-center gap-2 mb-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarImage src={message.sender.image} />
                                  <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                                    {message.sender.name?.charAt(0) || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">
                                  {message.sender.name}
                                </span>
                              </div>
                              <div className="bg-card border border-border rounded-lg p-2 shadow-sm">
                                <ProductMessage product={message.product} />
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 ml-6">
                                {formatMessageTime(message.createdAt)}
                              </div>
                            </div>
                          ) : (
                            <div className="max-w-[240px]">
                              <div
                                className={`rounded-lg px-3 py-2 text-sm ${
                                  Number(message.sender.id) === Number(user.id)
                                    ? "bg-primary/10 text-foreground border border-primary/20 ml-auto"
                                    : "bg-muted/50 text-foreground border border-border"
                                }`}
                              >
                                <p>{message.message}</p>
                                <div className={`text-xs mt-1 flex justify-between items-center text-muted-foreground`}>
                                  <span>{formatMessageTime(message.createdAt)}</span>
                                  {Number(message.sender.id) === Number(user.id) && (
                                    <CheckCheck className="h-3 w-3 text-primary/60" />
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* Typing indicator */}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg px-3 py-2 max-w-[200px]">
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                              <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-3 border-t border-border bg-card/50">
                      <div className="flex gap-2 items-center">
                        <Button
                          onClick={() => setIsProductDialogOpen(true)}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                          title="Share product"
                        >
                          <Package className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex-1 relative">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="pr-10 h-8 text-sm border-muted-foreground/20"
                            disabled={isLoading}
                          />
                          <Button
                            onClick={sendMessage}
                            disabled={!newMessage.trim() || isLoading}
                            size="icon"
                            variant="ghost"
                            className="absolute right-1 top-0.5 h-7 w-7 text-muted-foreground hover:text-foreground"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* New Chat Form */}
                    <div className="flex-1 p-4 space-y-4 bg-background/30">
                      <div className="text-center space-y-2">
                        <div className="mx-auto h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                          <MessageCircle className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground text-sm">Start a conversation</h3>
                          <p className="text-xs text-muted-foreground">We typically respond within a few minutes</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-foreground block mb-1">Subject (Optional)</label>
                          <Input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g., Product inquiry"
                            className="text-sm h-8"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-foreground block mb-1">Message</label>
                          <Textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="How can we help you today?"
                            className="resize-none text-sm"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Send Button */}
                    <div className="p-3 border-t border-border bg-card/50">
                      <Button
                        onClick={startNewChat}
                        disabled={!newMessage.trim() || isLoading}
                        className="w-full h-8 text-sm"
                        variant="default"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin"></div>
                            Starting...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Send className="h-3.5 w-3.5" />
                            Start Chat
                          </div>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
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