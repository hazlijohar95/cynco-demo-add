import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (content: string, file?: File) => void;
  isProcessing: boolean;
}

export const ChatPanel = ({ messages, onSendMessage, isProcessing }: ChatPanelProps) => {
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSendMessage(input);
    setInput("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    onSendMessage(`Uploaded: ${file.name}`, file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-gradient-to-r from-primary to-primary/90">
        <h2 className="text-lg font-semibold text-primary-foreground">Cynco AI Assistant</h2>
        <p className="text-sm text-primary-foreground/80">Your accounting co-pilot</p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-chatUser text-primary-foreground"
                    : "bg-chatAssistant border border-border"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-chatAssistant border border-border rounded-lg px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4 bg-muted/30">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.csv"
            onChange={handleFileUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about documents, transactions, or reports..."
            disabled={isProcessing}
            className="flex-1"
          />
          <Button type="submit" disabled={isProcessing || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
