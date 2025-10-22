import { useState } from "react";
import { Message, JournalEntry, OpeningBalanceEntry, KnowledgeEntry, ToolCall } from "@/types";
import { generateFinancialContext } from "@/utils/aiContext";
import { AIToolExecutor } from "@/services/aiTools";
import { toast } from "sonner";

interface UseAIChatProps {
  journalEntries: JournalEntry[];
  openingBalances: OpeningBalanceEntry[];
  knowledgeEntries: KnowledgeEntry[];
  activeView: string;
  setJournalEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  setOpeningBalances: React.Dispatch<React.SetStateAction<OpeningBalanceEntry[]>>;
  setActiveView: React.Dispatch<React.SetStateAction<string>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const useAIChat = ({
  journalEntries,
  openingBalances,
  knowledgeEntries,
  activeView,
  setJournalEntries,
  setOpeningBalances,
  setActiveView,
  messages,
  setMessages,
}: UseAIChatProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async (content: string) => {
    setIsProcessing(true);

    try {
      // Generate financial context
      const financialContext = generateFinancialContext(
        journalEntries,
        openingBalances,
        knowledgeEntries,
        activeView
      );

      // Call edge function with streaming
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            message: content,
            context: financialContext,
            conversationHistory: messages.slice(-10).map(m => ({
              role: m.role,
              content: m.content
            })),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to connect to AI`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let assistantContent = "";
      const assistantMessageId = (Date.now() + 1).toString();
      let toolCalls: ToolCall[] = [];

      // Add empty assistant message for streaming
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);

      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });
        
        // Process line by line (SSE format)
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta;
            
            // Handle tool calls - accumulate them properly
            if (delta?.tool_calls) {
              for (const tc of delta.tool_calls) {
                const idx = tc.index ?? 0;
                
                // Initialize tool call if needed
                if (!toolCalls[idx]) {
                  toolCalls[idx] = {
                    id: tc.id || '',
                    type: 'function',
                    function: { name: '', arguments: '' }
                  };
                }
                
                // Accumulate function name
                if (tc.function?.name) {
                  toolCalls[idx].function.name += tc.function.name;
                }
                
                // Accumulate function arguments
                if (tc.function?.arguments) {
                  toolCalls[idx].function.arguments += tc.function.arguments;
                }
                
                // Set ID if provided
                if (tc.id) {
                  toolCalls[idx].id = tc.id;
                }
              }
            }
            
            // Handle regular content
            if (delta?.content) {
              assistantContent += delta.content;
              
              // Update message in real-time
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: assistantContent }
                    : msg
                )
              );
            }
          } catch (e) {
            console.error('Error parsing stream chunk:', e);
          }
        }
      }

      // Execute tool calls if any
      if (toolCalls.length > 0) {
        const toolExecutor = new AIToolExecutor(
          setJournalEntries,
          setOpeningBalances,
          setActiveView
        );

        console.log('Executing tool calls:', toolCalls);
        
        for (const toolCall of toolCalls) {
          if (!toolCall || !toolCall.function?.name) {
            console.warn('Skipping invalid tool call:', toolCall);
            continue;
          }
          
          const args = JSON.parse(toolCall.function.arguments);
          const result = await toolExecutor.executeTool(toolCall.function.name, args);
          
          // Update assistant message with confirmation
          if (result.message) {
            assistantContent += (assistantContent ? '\n\n' : '') + `✅ ${result.message}`;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: assistantContent }
                  : msg
              )
            );
          }
        }
      }

      // If no content was streamed and no tool calls, show error
      if (!assistantContent && toolCalls.length === 0) {
        throw new Error('No response from AI');
      }

    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to AI assistant';
      
      toast.error(errorMessage);
      
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I'm having trouble connecting right now. ${errorMessage}\n\nPlease try again in a moment.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    sendMessage,
    isProcessing,
  };
};
