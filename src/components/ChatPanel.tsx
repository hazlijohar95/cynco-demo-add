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

    // Determine file type for better messaging
    const fileType = file.name.toLowerCase().includes('invoice') ? 'Invoice' :
                     file.name.toLowerCase().includes('receipt') ? 'Receipt' :
                     file.name.toLowerCase().includes('bill') ? 'Bill' :
                     file.name.toLowerCase().includes('statement') ? 'Bank Statement' :
                     'Document';

    onSendMessage(`📄 Uploaded ${fileType}: ${file.name}`, file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      {/* Header */}
      <div className="border-b border-border p-4 flex-shrink-0">
        <h2 className="text-sm font-mono font-bold tracking-tight">Cynco AI</h2>
        <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">Accounting Assistant</p>
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
                className={`max-w-[80%] rounded px-3 py-2 ${
                  message.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-muted border border-border"
                }`}
              >
                <p className="text-xs font-mono whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <p className="text-[10px] font-mono opacity-50 mt-2">
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
      <div className="border-t border-border p-3 flex-shrink-0">
        <div className="mb-2">
          <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
            Quick Upload
          </p>
          <div className="grid grid-cols-2 gap-1.5">
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
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="rounded font-mono text-[9px] h-7 px-2"
            >
              Invoice
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="rounded font-mono text-[9px] h-7 px-2"
            >
              Receipt
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="rounded font-mono text-[9px] h-7 px-2"
            >
              Bill
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="rounded font-mono text-[9px] h-7 px-2"
            >
              Statement
            </Button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-1.5">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isProcessing}
            className="flex-1 font-mono text-xs rounded h-8"
          />
          <Button 
            type="submit" 
            disabled={isProcessing || !input.trim()}
            className="rounded h-8 w-8 p-0"
          >
            <Send className="h-3 w-3" />
          </Button>
        </form>
      </div>
    </div>
  );
};
