import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductMessage } from "@/components/chat/ProductMessage";
import { MessageSquare, User, Send } from "lucide-react";

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

interface SelectedRoom {
  id: number;
  status: string;
  priority: string;
  subject: string;
  user: {
    name: string;
    email: string;
    image?: string;
  };
}

interface MessageThreadProps {
  selectedRoom: SelectedRoom | null;
  messages: Message[];
  newMessage: string;
  isLoading: boolean;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onStatusChange: (roomId: number, status: string) => void;
  onPriorityChange: (roomId: number, priority: string) => void;
}

export function MessageThread({ selectedRoom, messages, newMessage, isLoading, onNewMessageChange, onSendMessage, onStatusChange, onPriorityChange }: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!selectedRoom) {
    return (
      <Card className="h-full flex items-center justify-center border-0 shadow-sm bg-card">
        <CardContent className="text-center p-8">
          <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
            <MessageSquare className="h-16 w-16 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Select a chat to view conversation</h3>
          <p className="text-muted-foreground max-w-md">Choose a chat room from the list to start responding to customer inquiries and manage support conversations.</p>
        </CardContent>
      </Card>
    );
  }

  return (
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
            <Select value={selectedRoom.status} onValueChange={(value) => onStatusChange(selectedRoom.id, value)}>
              <SelectTrigger className="w-32 border-0 bg-background shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedRoom.priority} onValueChange={(value) => onPriorityChange(selectedRoom.id, value)}>
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
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender.role === "ADMIN" ? "justify-end" : "justify-start"}`}>
              {message.messageType === "PRODUCT" && message.product ? (
                <ProductMessage product={message.product} asBubble={true} isFromAdmin={message.sender.role === "ADMIN"} senderName={message.sender.name} timestamp={formatTime(message.createdAt)} showActions={true} />
              ) : (
                <div className="max-w-[240px]">
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${
                      message.sender.role === "ADMIN" ? "bg-slate-100 text-slate-900 border border-slate-200 ml-auto dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" : "bg-muted/50 text-foreground border border-border"
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

        <div className="border-t border-border/50 p-4 bg-background">
          <div className="flex space-x-3">
            <Input
              value={newMessage}
              onChange={(e) => onNewMessageChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
              placeholder="Type your reply..."
              className="flex-1 border-0 bg-muted/50 focus:bg-background transition-colors"
              disabled={isLoading || selectedRoom.status === "CLOSED"}
            />
            <Button onClick={onSendMessage} disabled={!newMessage.trim() || isLoading || selectedRoom.status === "CLOSED"} size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
