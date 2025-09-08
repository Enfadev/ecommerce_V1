'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sseReconnectAttempts, setSseReconnectAttempts] = useState(0);
  const [subject, setSubject] = useState("");
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const processedMessagesRef = useRef(new Set<number>());
  const stateRef = useRef({ isOpen: false, isMinimized: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const maxSseReconnectAttempts = 3;
  
  stateRef.current = { isOpen, isMinimized };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        
        if (data.chatRooms && data.chatRooms.length > 0) {
          const room = data.chatRooms[0];
          setChatRoom(room);
          setUnreadCount(room.unreadCount || 0);
          await loadMessages(room.id);
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

  useEffect(() => {
    if (user) {
      loadChatRoom();
    }
  }, [user, loadChatRoom]);

  useEffect(() => {
    if (chatRoom && user) {
      const eventSource = new EventSource(`/api/chat/sse?roomId=${chatRoom.id}`);
      
      eventSource.onopen = () => {
        // Reset reconnect attempts on successful connection
        setSseReconnectAttempts(0);
      };
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'new_message' && data.message) {
            const messageId = data.message.id;
            
            if (processedMessagesRef.current.has(messageId)) {
              return;
            }
            
            processedMessagesRef.current.add(messageId);
            
            setMessages(prev => {
              const messageExists = prev.some(msg => msg.id === messageId);
              if (messageExists) {
                return prev;
              }
              
              return [...prev, data.message];
            });
            
            const { isOpen: currentIsOpen, isMinimized: currentIsMinimized } = stateRef.current;
            
            if (currentIsOpen && !currentIsMinimized) {
              setTimeout(() => scrollToBottom(), 100);
              
              setTimeout(() => {
                fetch(`/api/chat/rooms/${chatRoom.id}/read`, {
                  method: 'POST'
                }).then(() => {
                  setUnreadCount(0);
                }).catch(error => {
                  console.error('Error marking messages as read:', error);
                });
              }, 200);
            } else {
              setUnreadCount(prev => prev + 1);
            }
          }
        } catch (error) {
          console.error('❌ User: Error parsing SSE message:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.warn('SSE connection failed:', error);
        eventSource.close();
        
        // Auto-reconnect with limited attempts
        if (sseReconnectAttempts < maxSseReconnectAttempts) {
          setSseReconnectAttempts(prev => prev + 1);
          setTimeout(() => {
            if (chatRoom && user) {
              // Force re-render to trigger useEffect again
              setChatRoom(prevRoom => ({ ...prevRoom! }));
            }
          }, 3000 * (sseReconnectAttempts + 1)); // Exponential backoff
        }
      };

      return () => {
        eventSource.close();
      };
    }
  }, [chatRoom, user, sseReconnectAttempts]);

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
          message: newMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.chatRoom) {
          setChatRoom(data.chatRoom);
          
          if (data.chatRoom.messages && data.chatRoom.messages.length > 0) {
            setMessages(data.chatRoom.messages);
            setTimeout(() => scrollToBottom(), 100);
          } else if (data.message) {
            setMessages([data.message]);
            setTimeout(() => scrollToBottom(), 100);
          } else {
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
        await response.json();
        console.log("Message sent successfully");
        
        
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
        const data = await response.json();
        console.log("Product shared successfully");
        
        if (data.message) {
          setMessages(prev => [...prev, data.message]);
          setTimeout(() => scrollToBottom(), 100);
        }
        
        setIsProductDialogOpen(false);
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
              onClick={() => {
                setIsOpen(true);
                if (unreadCount > 0) {
                  markMessagesAsRead();
                }
              }}
              className="h-12 w-12 rounded-full bg-card border border-border shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-foreground"
              variant="outline"
            >
              <MessageCircle className="h-5 w-5" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center">
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
                {/* Debug info - only show in development with specific flag */}
                {process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SHOW_CHAT_DEBUG && (
                  <div className="p-2 bg-muted/30 text-xs text-muted-foreground border-b border-border">
                    ChatRoom: {chatRoom ? 'Yes' : 'No'} | Messages: {messages.length}
                  </div>
                )}
                
                {chatRoom ? (
                  <>
                    {/* Chat Status */}
                    <div className="px-3 py-2 bg-muted/30 border-b border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {chatRoom.admin ? `Chatting with ${chatRoom.admin.name}` : 'Support Team'}
                          </span>
                        </div>
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
                            <ProductMessage 
                              product={message.product}
                              asBubble={true}
                              isFromAdmin={Number(message.sender.id) !== Number(user.id)}
                              senderName={message.sender.name}
                              timestamp={formatMessageTime(message.createdAt)}
                              showActions={true}
                            />
                          ) : (
                            <div className="max-w-[240px]">
                              <div
                                className={`rounded-lg px-3 py-2 text-sm ${
                                  Number(message.sender.id) === Number(user.id)
                                    ? "bg-slate-100 text-slate-900 border border-slate-200 ml-auto dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
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