import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, RotateCcw, User, Clock } from "lucide-react";
import { ChatFilters } from "./ChatFilters";

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
  _count: {
    messages: number;
  };
}

interface ChatRoomsListProps {
  chatRooms: ChatRoom[];
  selectedRoomId: number | null;
  searchTerm: string;
  statusFilter: string;
  priorityFilter: string;
  onRoomSelect: (room: ChatRoom) => void;
  onRefresh: () => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
}

export function ChatRoomsList({ chatRooms, selectedRoomId, searchTerm, statusFilter, priorityFilter, onRoomSelect, onRefresh, onSearchChange, onStatusChange, onPriorityChange }: ChatRoomsListProps) {
  const filteredChatRooms = chatRooms.filter((room) => {
    const matchesSearch = room.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || room.user.email.toLowerCase().includes(searchTerm.toLowerCase()) || room.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || room.status === statusFilter.toUpperCase();
    const matchesPriority = priorityFilter === "all" || room.priority === priorityFilter.toUpperCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "CLOSED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "RESOLVED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "HIGH":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "NORMAL":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "LOW":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-muted text-muted-foreground";
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

  return (
    <Card className="border-0 shadow-sm bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-foreground">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Chat Rooms
          </div>
          <Button onClick={onRefresh} variant="outline" size="sm" className="hover:bg-primary/5">
            <RotateCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>

        <ChatFilters searchTerm={searchTerm} statusFilter={statusFilter} priorityFilter={priorityFilter} onSearchChange={onSearchChange} onStatusChange={onStatusChange} onPriorityChange={onPriorityChange} />
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {filteredChatRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => onRoomSelect(room)}
              className={`p-4 border-b border-border/50 cursor-pointer hover:bg-muted/30 transition-all duration-200 ${
                selectedRoomId === room.id ? "bg-primary/5 border-l-4 border-l-primary" : "hover:border-l-4 hover:border-l-transparent"
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
                      <p className="text-sm font-semibold text-foreground truncate">{room.user.name}</p>
                      <div className="flex items-center space-x-2">
                        {room.unreadCount && room.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs min-w-[20px] h-5 flex items-center justify-center px-1.5 animate-pulse">
                            {room.unreadCount > 99 ? "99+" : room.unreadCount}
                          </Badge>
                        )}
                        {!room.isRead && <div className="flex items-center justify-center w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                      </div>
                    </div>

                    <p className="text-sm text-foreground/80 truncate font-medium mb-1">{room.subject}</p>

                    <p className="text-xs text-muted-foreground truncate mb-3 line-clamp-2">{room.lastMessage}</p>

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
  );
}
