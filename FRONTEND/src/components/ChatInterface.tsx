import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Send, Paperclip, Download, FileText, X, Smile, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  communication_id: number;
  sender_type: 'team' | 'mentor';
  message_text: string;
  file_url: string | null;
  file_name: string | null;
  created_at: string;
  reactions?: { [userId: string]: string }; // { "user_id": "emoji" }
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string, file: File | null) => Promise<void>;
  onReactToMessage?: (communicationId: number, emoji: string) => Promise<void>;
  onDeleteForMe?: (communicationId: number) => Promise<void>;
  onDeleteForEveryone?: (communicationId: number) => Promise<void>;
  currentUserType: 'team' | 'mentor';
  currentUserId?: number;
  otherPartyName: string;
  isLoading?: boolean;
  onRefresh?: () => Promise<void>;
  pollingInterval?: number; // in milliseconds, default 3000 (3 seconds)
}

const ChatInterface = ({ 
  messages, 
  onSendMessage,
  onReactToMessage,
  onDeleteForMe,
  onDeleteForEveryone,
  currentUserType,
  currentUserId,
  otherPartyName,
  isLoading = false,
  onRefresh,
  pollingInterval = 3000
}: ChatInterfaceProps) => {
  const [messageText, setMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Common emojis for quick reactions
  const quickEmojis = ['👍', '❤️', '😊', '😂', '😮', '😢', '🎉', '🔥'];

  // Sort messages in chronological order (oldest first, newest last)
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-refresh messages with polling
  useEffect(() => {
    if (!onRefresh) return;

    const interval = setInterval(() => {
      onRefresh().catch(err => {
        console.error('Auto-refresh error:', err);
      });
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [onRefresh, pollingInterval]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (max 1GB)
      if (file.size > 1024 * 1024 * 1024) {
        toast.error("File size must be less than 1GB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSend = async () => {
    if (!messageText.trim() && !selectedFile) {
      toast.error("Please enter a message or select a file");
      return;
    }

    setIsSending(true);
    try {
      await onSendMessage(messageText, selectedFile);
      setMessageText("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Message sent successfully");
    } catch (error: any) {
      console.error('Send message error:', error);
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReaction = async (communicationId: number, emoji: string) => {
    if (!onReactToMessage) {
      toast.error("Reaction feature not available");
      return;
    }

    try {
      await onReactToMessage(communicationId, emoji);
      // Refresh to show updated reactions
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error: any) {
      console.error('Reaction error:', error);
      toast.error("Failed to add reaction");
    }
  };

  const handleDeleteForMe = async () => {
    if (!messageToDelete || !onDeleteForMe) return;

    try {
      await onDeleteForMe(messageToDelete);
      toast.success("Message deleted");
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  };

  const handleDeleteForEveryone = async (communicationId: number) => {
    if (!onDeleteForEveryone) return;

    try {
      await onDeleteForEveryone(communicationId);
      toast.success("Message deleted for everyone");
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error: any) {
      console.error('Delete for everyone error:', error);
      toast.error(error.response?.data?.message || "Failed to delete message for everyone");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="flex flex-col h-full border rounded-lg bg-background overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-secondary/30 flex-shrink-0">
        <Avatar>
          <AvatarFallback className="bg-accent text-accent-foreground">
            {getInitials(otherPartyName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{otherPartyName}</h3>
          <p className="text-xs text-muted-foreground">
            {currentUserType === 'team' ? 'Mentor' : 'Team'}
          </p>
        </div>
      </div>

      {/* Messages Area - SCROLLABLE */}
      <div 
        className="flex-1 overflow-y-scroll p-4 space-y-4 scroll-smooth scrollbar-thin min-h-0" 
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: 'hsl(var(--secondary)) transparent'
        }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          sortedMessages.map((msg) => {
            const isSentByMe = msg.sender_type === currentUserType;
            const reactions = msg.reactions || {};
            const hasReactions = Object.keys(reactions).length > 0;
            const myReaction = currentUserId ? reactions[currentUserId.toString()] : null;
            
            return (
              <div
                key={msg.communication_id}
                className={`flex flex-col ${isSentByMe ? 'items-end' : 'items-start'}`}
              >
                <div className="group relative">
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isSentByMe
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-secondary'
                    }`}
                  >
                    {msg.message_text && (
                      <p className="whitespace-pre-wrap break-words mb-1">
                        {msg.message_text}
                      </p>
                    )}
                    
                    {msg.file_url && msg.file_name && (
                      <a
                        href={`http://localhost:5000${msg.file_url}`}
                        download={msg.file_name}
                        className={`flex items-center gap-2 mt-2 p-2 rounded ${
                          isSentByMe
                            ? 'bg-accent-foreground/10 hover:bg-accent-foreground/20'
                            : 'bg-primary/10 hover:bg-primary/20'
                        } transition-colors`}
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm flex-1 truncate">{msg.file_name}</span>
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                    
                    <p className={`text-xs mt-1 ${
                      isSentByMe ? 'text-accent-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {formatTime(msg.created_at)}
                    </p>
                  </div>

                  {/* Action Buttons - Show on hover */}
                  <div className={`absolute -top-2 ${isSentByMe ? 'right-0' : 'left-0'} opacity-0 group-hover:opacity-100 transition-opacity flex gap-1`}>
                    {/* Reaction Button */}
                    {onReactToMessage && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full bg-secondary hover:bg-secondary/80 shadow-md"
                          >
                            <Smile className="w-3 h-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2" align={isSentByMe ? "end" : "start"}>
                          <div className="flex gap-1">
                            {quickEmojis.map((emoji) => (
                              <Button
                                key={emoji}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-lg hover:scale-125 transition-transform"
                                onClick={() => handleReaction(msg.communication_id, emoji)}
                              >
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}

                    {/* Delete Menu */}
                    {(onDeleteForMe || onDeleteForEveryone) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full bg-secondary hover:bg-secondary/80 shadow-md"
                          >
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={isSentByMe ? "end" : "start"}>
                          {onDeleteForMe && (
                            <DropdownMenuItem
                              onClick={() => {
                                setMessageToDelete(msg.communication_id);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete for me
                            </DropdownMenuItem>
                          )}
                          {isSentByMe && onDeleteForEveryone && (
                            <DropdownMenuItem
                              onClick={() => handleDeleteForEveryone(msg.communication_id)}
                              className="text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete for everyone
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>

                {/* Display Reactions */}
                {hasReactions && (
                  <div className={`flex flex-wrap gap-1 mt-1 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                    {Object.entries(
                      Object.values(reactions).reduce((acc, emoji) => {
                        acc[emoji] = (acc[emoji] || 0) + 1;
                        return acc;
                      }, {} as { [emoji: string]: number })
                    ).map(([emoji, count]) => {
                      const isMyReaction = myReaction === emoji;
                      return (
                        <button
                          key={emoji}
                          onClick={() => onReactToMessage && handleReaction(msg.communication_id, emoji)}
                          disabled={!onReactToMessage}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all ${
                            isMyReaction 
                              ? 'bg-primary/20 border border-primary hover:bg-primary/30 cursor-pointer' 
                              : 'bg-secondary border border-border hover:bg-secondary/80 cursor-pointer'
                          } ${!onReactToMessage ? 'cursor-default' : ''}`}
                          title={isMyReaction ? 'Click to remove your reaction' : 'Click to add this reaction'}
                        >
                          <span>{emoji}</span>
                          {count > 1 && <span className="text-muted-foreground">{count}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - FIXED AT BOTTOM */}
      <div className="p-4 border-t bg-secondary/30 flex-shrink-0">
        {selectedFile && (
          <div className="mb-2 flex items-center gap-2 p-2 bg-secondary rounded">
            <FileText className="w-4 h-4" />
            <span className="text-sm flex-1 truncate">{selectedFile.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        <div className="flex gap-2 items-end">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.zip"
          />
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
            className="flex-shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <Textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 min-h-[40px] max-h-[100px] resize-none"
            disabled={isSending}
            rows={1}
          />
          
          <Button
            onClick={handleSend}
            disabled={isSending || (!messageText.trim() && !selectedFile)}
            size="icon"
            className="bg-accent hover:bg-accent/90 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMessageToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteForMe} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatInterface;
