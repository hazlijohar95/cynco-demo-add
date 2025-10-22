import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Send, Loader2, Trash2, Download, Copy, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";
import { MessageContent } from "@/components/chat/MessageContent";
import { ContextIndicator } from "@/components/chat/ContextIndicator";

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
  onClearChat?: () => void;
  currentView: string;
  totalEntries: number;
  isBalanced: boolean;
}

export const ChatPanel = ({ 
  messages, 
  onSendMessage, 
  isProcessing, 
  onClearChat,
  currentView,
  totalEntries,
  isBalanced 
}: ChatPanelProps) => {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
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
    setShowSuggestions(false);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    onSendMessage(prompt);
    setShowSuggestions(false);
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

  const handleClearChat = () => {
    if (onClearChat) {
      onClearChat();
      setShowSuggestions(true);
      toast.success("Chat cleared");
    }
  };

  const handleExportChat = () => {
    const chatText = messages
      .map((m) => `[${m.timestamp.toLocaleString()}] ${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cynco-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Chat exported");
  };

  const handleCopyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      {/* Header */}
      <div className="border-b border-border p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-mono font-bold tracking-tight">Cynco AI</h2>
            <InfoTooltip 
              content="Your AI accounting assistant. Ask questions about balances, transactions, reports, or upload documents for processing."
              side="bottom"
            />
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleClearChat}
              className="h-7 px-2 text-[10px]"
              title="Clear chat history"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleExportChat}
              className="h-7 px-2 text-[10px]"
              title="Export chat"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Context Indicator */}
      <ContextIndicator 
        currentView={currentView}
        totalEntries={totalEntries}
        isBalanced={isBalanced}
      />

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {/* Show suggestions when chat is empty or just started */}
          {messages.length <= 1 && showSuggestions && (
            <div className="mb-6">
              <SuggestedPrompts 
                currentView={currentView}
                hasData={totalEntries > 0}
                onSelectPrompt={handleSuggestedPrompt}
              />
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2.5 group relative ${
                  message.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-muted border border-border"
                }`}
              >
                <MessageContent content={message.content} role={message.role} />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[10px] font-mono opacity-50">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyMessage(message.content, message.id)}
                    className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy message"
                  >
                    {copiedId === message.id ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-muted border border-border rounded-lg px-4 py-3 flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono text-muted-foreground">AI is thinking</span>
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse animation-delay-200">.</span>
                  <span className="animate-pulse animation-delay-400">.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-3 flex-shrink-0 bg-background">
        <form onSubmit={handleSubmit} className="flex gap-1.5">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your data..."
            disabled={isProcessing}
            className="flex-1 font-mono text-xs rounded h-9"
          />
          <Button 
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="rounded h-9 w-9 p-0"
            title="Upload document"
          >
            <Upload className="h-3.5 w-3.5" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.csv"
            onChange={handleFileUpload}
          />
          <Button 
            type="submit" 
            disabled={isProcessing || !input.trim()}
            className="rounded h-9 w-9 p-0"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
};
