import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatPanel } from "@/components/ChatPanel";
import { SpreadsheetPanel } from "@/components/SpreadsheetPanel";
import { ResizablePanel } from "@/components/ResizablePanel";
import { RestoreDialog } from "@/components/RestoreDialog";
import { JournalEntry, OpeningBalanceEntry, KnowledgeEntry, Message } from "@/types";
import { toast } from "sonner";
import { generateSampleEntries, processDocumentToJournalEntry } from "@/utils/simulationData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useHistory, ActionType } from "@/hooks/useHistory";
import { useAutoBackup, BackupData } from "@/hooks/useAutoBackup";
import { generateFinancialContext } from "@/utils/aiContext";
import { Undo2, Redo2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your Cynco AI assistant. Upload accounting documents or ask me to run a full simulation to see the accounting pipeline in action.\n\nTry:\n• Upload an invoice, bill, or receipt\n• Type 'Run simulation' to process sample documents\n• Edit any cell in the spreadsheet and watch real-time recalculations",
      timestamp: new Date(),
    },
  ]);
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>("cynco-journal-entries", []);
  const [openingBalances, setOpeningBalances] = useLocalStorage<OpeningBalanceEntry[]>("cynco-opening-balances", []);
  const [knowledgeEntries, setKnowledgeEntries] = useLocalStorage<KnowledgeEntry[]>("cynco-knowledge-base", []);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeView, setActiveView] = useState("coa");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);

  const history = useHistory<any>();
  useAutoBackup(journalEntries, openingBalances, knowledgeEntries);

  useEffect(() => {
    if (journalEntries.length > 0 || openingBalances.length > 0 || knowledgeEntries.length > 0) {
      setIsSaving(true);
      const timer = setTimeout(() => {
        setLastSaved(new Date());
        setIsSaving(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [journalEntries, openingBalances, knowledgeEntries]);

  const handleUndo = () => {
    const action = history.undo();
    if (!action) {
      toast.error("Nothing to undo");
      return;
    }

    // Restore previous state based on action type
    if (action.type.includes("JOURNAL")) {
      setJournalEntries(action.inverseData || []);
    } else if (action.type.includes("OPENING")) {
      setOpeningBalances(action.inverseData || []);
    } else if (action.type.includes("KNOWLEDGE")) {
      setKnowledgeEntries(action.inverseData || []);
    }

    toast.success(`Undone: ${action.description}`);
  };

  const handleRedo = () => {
    const action = history.redo();
    if (!action) {
      toast.error("Nothing to redo");
      return;
    }

    // Restore next state based on action type
    if (action.type.includes("JOURNAL")) {
      setJournalEntries(action.data || []);
    } else if (action.type.includes("OPENING")) {
      setOpeningBalances(action.data || []);
    } else if (action.type.includes("KNOWLEDGE")) {
      setKnowledgeEntries(action.data || []);
    }

    toast.success(`Redone: ${action.description}`);
  };

  const handleRestore = (backup: BackupData) => {
    setJournalEntries(backup.journalEntries);
    setOpeningBalances(backup.openingBalances);
    setKnowledgeEntries(backup.knowledgeEntries);
    history.clear();
  };

  const handleSendMessage = async (content: string, file?: File) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    // Handle file uploads with mock processing
    if (file) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Process uploaded document
      const newEntries = processDocumentToJournalEntry(file.name, journalEntries.length);
      setJournalEntries((prev) => [...prev, ...newEntries]);

      // Determine document type
      const docType = file.name.toLowerCase().includes('invoice') ? 'invoice' :
                      file.name.toLowerCase().includes('receipt') ? 'receipt' :
                      file.name.toLowerCase().includes('bill') ? 'bill' :
                      file.name.toLowerCase().includes('statement') ? 'bank statement' : 'document';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `✓ Document Extracted Successfully\n\nType: ${docType.toUpperCase()}\nFile: ${file.name}\n\n📊 Extracted Data:\n• ${newEntries.length / 2} transaction(s) identified\n• Account: ${newEntries[0].account}\n• Amount: $${(newEntries[0].debit > 0 ? newEntries[0].debit : newEntries[0].credit).toFixed(2)}\n• Reference: ${newEntries[0].reference}\n\n✅ Processing Complete:\n→ Journal entries created\n→ Ledger updated\n→ Trial balance recalculated\n→ Financial statements refreshed\n\nNavigate to "Journal Entries" to view the details.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      toast.success(`Extracted ${newEntries.length / 2} transaction(s) from ${docType}`);
      setActiveView("journal");
      setIsProcessing(false);
      return;
    }

    // Handle simulation requests
    if (content.toLowerCase().includes("simulation")) {
      setIsProcessing(false);
      handleRunSimulation();
      return;
    }

    // Real AI chat for general queries
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
      let toolCalls: any[] = [];

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
        console.log('Executing tool calls:', toolCalls);
        
        for (const toolCall of toolCalls) {
          if (!toolCall || !toolCall.function?.name) {
            console.warn('Skipping invalid tool call:', toolCall);
            continue;
          }
          
          try {
            const args = JSON.parse(toolCall.function.arguments);
            const functionName = toolCall.function.name;
            
            console.log(`Executing ${functionName} with args:`, args);
            
            // Execute the appropriate function
            let result = '';
            switch (functionName) {
              case 'add_journal_entry':
                const newEntry: JournalEntry = {
                  id: Date.now().toString(),
                  date: args.date || new Date().toISOString().split('T')[0],
                  account: args.account,
                  debit: Number(args.debit) || 0,
                  credit: Number(args.credit) || 0,
                  description: args.description,
                  reference: args.reference || `REF-${Date.now()}`,
                };
                setJournalEntries((prev) => [...prev, newEntry]);
                // Switch to journal view to show the new entry
                setActiveView('journal');
                result = `Added journal entry: ${args.description}`;
                toast.success('✅ Journal entry added - View updated', { duration: 4000 });
                break;
                
              case 'update_journal_entry':
                setJournalEntries((prev) => 
                  prev.map((entry) => 
                    entry.id === args.entryId 
                      ? { ...entry, ...args }
                      : entry
                  )
                );
                setActiveView('journal');
                result = `Updated journal entry ${args.entryId}`;
                toast.success('✅ Journal entry updated - View refreshed', { duration: 4000 });
                break;
                
              case 'delete_journal_entry':
                setJournalEntries((prev) => 
                  prev.filter((entry) => entry.id !== args.entryId)
                );
                setActiveView('journal');
                result = `Deleted journal entry ${args.entryId}`;
                toast.success('✅ Journal entry deleted - View refreshed', { duration: 4000 });
                break;
                
              case 'add_opening_balance':
                const newBalance: OpeningBalanceEntry = {
                  id: Date.now().toString(),
                  account: args.account,
                  debit: Number(args.debit) || 0,
                  credit: Number(args.credit) || 0,
                  date: args.date || new Date().toISOString().split('T')[0],
                };
                setOpeningBalances((prev) => [...prev, newBalance]);
                // Switch to opening balance view
                setActiveView('opening');
                result = `Added opening balance for ${args.account}`;
                toast.success('✅ Opening balance added - View updated', { duration: 4000 });
                break;
                
              default:
                result = `Unknown function: ${functionName}`;
                console.warn('Unknown function called:', functionName);
            }
            
            // Update assistant message with confirmation
            if (result) {
              assistantContent += (assistantContent ? '\n\n' : '') + `✅ ${result}`;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: assistantContent }
                    : msg
                )
              );
            }
          } catch (e) {
            console.error('Error executing tool call:', e);
            const errorMsg = e instanceof Error ? e.message : 'Unknown error';
            toast.error(`Failed to execute action: ${errorMsg}`);
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

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    
    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "🚀 Running Complete Demo: TechConsult Solutions LLC\n\n📋 Loading Comprehensive Q1 2024 Demo:\n\n**What's being loaded:**\n• Opening Balances (Jan 1, 2024) - Starting financial position\n• Knowledge Base (8 entries) - Company documentation, policies, procedures\n• Journal Entries (3 months) - All Q1 transactions\n• Bank Reconciliation (March 31) - Realistic scenarios with timing differences\n• Financial Statements - Trial Balance, P&L, Balance Sheet\n\n**You'll learn:**\n✓ Complete accounting cycle from opening to closing\n✓ How knowledge base provides business context\n✓ Bank reconciliation with real-world discrepancies\n✓ Financial statement preparation\n\nCreating synchronized accounting records...",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // Import demo generators
      const { generateOpeningBalances } = await import('@/utils/simulationData');
      const { generateDemoKnowledge } = await import('@/utils/demoKnowledgeBase');
      
      // Save previous states for history
      const prevJournal = [...journalEntries];
      const prevOpening = [...openingBalances];
      const prevKnowledge = [...knowledgeEntries];
      
      // Step 1: Load opening balances (Jan 1, 2024)
      const openingBals = generateOpeningBalances();
      setOpeningBalances(openingBals);
      history.addAction({
        type: "LOAD_OPENING_BALANCES" as any,
        timestamp: new Date(),
        data: openingBals,
        inverseData: prevOpening,
        description: "Loaded opening balances",
      });
      
      // Step 2: Load knowledge base (company context)
      const demoKnowledge = generateDemoKnowledge();
      setKnowledgeEntries(demoKnowledge);
      history.addAction({
        type: "LOAD_KNOWLEDGE" as any,
        timestamp: new Date(),
        data: demoKnowledge,
        inverseData: prevKnowledge,
        description: "Loaded knowledge base",
      });
      
      // Step 3: Generate Q1 2024 journal entries
      const sampleEntries = generateSampleEntries();
      setJournalEntries(sampleEntries);
      history.addAction({
        type: "LOAD_JOURNAL_ENTRIES" as any,
        timestamp: new Date(),
        data: sampleEntries,
        inverseData: prevJournal,
        description: "Loaded Q1 2024 journal entries",
      });

      const completeMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `✅ Complete Demo Loaded: TechConsult Solutions LLC\n\n📊 **Generated Data (Q1 2024):**\n• Opening Balances: ${openingBals.length} accounts ($128,300 total)\n• Knowledge Base: ${demoKnowledge.length} comprehensive entries (company context, policies, and documentation)\n• Journal Entries: ${sampleEntries.length} transactions (Jan-Mar 2024)\n• Bank Reconciliation: Ready with realistic discrepancies (outstanding checks, bank fees, deposits in transit)\n• Revenue Generated: $138,500\n• Net Income: ~$38,920 (28% margin)\n\n💼 **Business Story:**\nTech consulting startup in 3rd month of operations. Started with $100K capital, now serving 5 clients with 3 employees. All financial data is synchronized and balanced.\n\n📚 **Knowledge Base Loaded:**\nThe Knowledge Base tab now contains ${demoKnowledge.length} entries with:\n• Company information and business context\n• Accounting policies and procedures  \n• Chart of accounts documentation\n• Revenue recognition rules\n• Employee information\n• Client contract details\n• Operational guidelines\n\n🎯 **Explore the Complete Accounting Cycle:**\n1️⃣ **Opening Balance** - Starting financial position (Jan 1)\n2️⃣ **Knowledge Base** - Company documentation & context (NEW!)\n3️⃣ **Chart of Accounts** - Account structure & classification\n4️⃣ **Journal Entries** - All Q1 transactions (${sampleEntries.length} entries)\n5️⃣ **General Ledger** - Detailed account activity\n6️⃣ **Bank Reconciliation** - Match books to bank (March 31) 🏦\n7️⃣ **Trial Balance** - Verify accounting equation balance\n8️⃣ **Profit & Loss** - Q1 revenue and expenses\n9️⃣ **Balance Sheet** - Current financial position\n\n💡 **Try asking:**\n• "Show me March revenue"\n• "Why is cash balance $47,850?"\n• "What are our outstanding receivables?"\n• "Explain the bank reconciliation"\n• "What's in the knowledge base?"`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, completeMessage]);
      
      // Show sequential toasts to guide users
      toast.success(
        `✨ Demo Loaded! Opening Balances: ${openingBals.length} accounts`,
        { duration: 3000 }
      );
      
      setTimeout(() => {
        toast.info(
          `📚 Knowledge Base: ${demoKnowledge.length} entries loaded with company context & policies`,
          { duration: 4000 }
        );
      }, 1000);
      
      setTimeout(() => {
        toast.info(
          `📝 Journal Entries: ${sampleEntries.length} transactions (Jan-Mar 2024)`,
          { duration: 4000 }
        );
      }, 2500);
      
      setTimeout(() => {
        toast.success(
          `🏦 Bank Reconciliation: Ready with realistic scenarios (outstanding checks, bank fees, deposits in transit)`,
          { duration: 5000 }
        );
      }, 4000);
      
      setTimeout(() => {
        toast.info(
          `👉 Navigate to "Bank Reconciliation" in the sidebar to practice matching transactions!`,
          { duration: 6000 }
        );
      }, 5500);
      
      // Switch to chart of accounts to start the journey
      setActiveView("coa");
    } catch (error) {
      toast.error("Failed to run simulation");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleUpdateJournalEntry = (
    id: string,
    field: keyof JournalEntry,
    value: any
  ) => {
    const previousState = [...journalEntries];
    setJournalEntries((prev) => {
      const updated = prev.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry));
      history.addAction({
        type: "EDIT_JOURNAL_ENTRY" as ActionType,
        timestamp: new Date(),
        data: updated,
        inverseData: previousState,
        description: `Updated ${field} in journal entry`,
      });
      return updated;
    });
  };

  const handleDeleteJournalEntry = (id: string) => {
    const previousState = [...journalEntries];
    setJournalEntries((prev) => {
      const updated = prev.filter((entry) => entry.id !== id);
      history.addAction({
        type: "DELETE_JOURNAL_ENTRY" as ActionType,
        timestamp: new Date(),
        data: updated,
        inverseData: previousState,
        description: "Deleted journal entry",
      });
      return updated;
    });
    toast.success("Entry deleted");
  };

  const handleAddJournalEntry = () => {
    const previousState = [...journalEntries];
    const today = new Date().toISOString().split("T")[0];
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: today,
      account: "",
      description: "",
      debit: 0,
      credit: 0,
      reference: "",
    };
    setJournalEntries((prev) => {
      const updated = [...prev, newEntry];
      history.addAction({
        type: "ADD_JOURNAL_ENTRY" as ActionType,
        timestamp: new Date(),
        data: updated,
        inverseData: previousState,
        description: "Added new journal entry",
      });
      return updated;
    });
    toast.success("New entry added");
  };

  const handleUpdateOpeningBalance = (
    id: string,
    field: keyof OpeningBalanceEntry,
    value: any
  ) => {
    const previousState = [...openingBalances];
    setOpeningBalances((prev) => {
      const updated = prev.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry));
      history.addAction({
        type: "EDIT_OPENING_BALANCE" as ActionType,
        timestamp: new Date(),
        data: updated,
        inverseData: previousState,
        description: "Updated opening balance",
      });
      return updated;
    });
  };

  const handleDeleteOpeningBalance = (id: string) => {
    setOpeningBalances((prev) => prev.filter((entry) => entry.id !== id));
    toast.success("Opening balance deleted", { duration: 1000 });
  };

  const handleAddOpeningBalance = () => {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    lastYear.setMonth(11, 31); // Dec 31 of previous year
    const defaultDate = lastYear.toISOString().split("T")[0];
    
    const newEntry: OpeningBalanceEntry = {
      id: Date.now().toString(),
      account: "",
      debit: 0,
      credit: 0,
      date: defaultDate,
    };
    setOpeningBalances((prev) => [...prev, newEntry]);
    toast.success("Opening balance entry added", { duration: 1000 });
  };

  const handleUploadOpeningBalanceCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error("CSV file must contain headers and data");
        return;
      }

      const headers = lines[0].toLowerCase().split(",").map(h => h.trim());
      const accountIndex = headers.findIndex(h => h.includes("account"));
      const debitIndex = headers.findIndex(h => h.includes("debit"));
      const creditIndex = headers.findIndex(h => h.includes("credit"));
      const dateIndex = headers.findIndex(h => h.includes("date"));

      if (accountIndex === -1 || (debitIndex === -1 && creditIndex === -1)) {
        toast.error("CSV must contain 'account' and 'debit' or 'credit' columns");
        return;
      }

      const newEntries: OpeningBalanceEntry[] = [];
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      lastYear.setMonth(11, 31);
      const defaultDate = lastYear.toISOString().split("T")[0];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map(v => v.trim());
        if (values.length < headers.length) continue;

        const account = values[accountIndex];
        const debit = parseFloat(values[debitIndex] || "0") || 0;
        const credit = parseFloat(values[creditIndex] || "0") || 0;
        const date = dateIndex !== -1 && values[dateIndex] ? values[dateIndex] : defaultDate;

        if (account) {
          newEntries.push({
            id: `${Date.now()}-${i}`,
            account,
            debit,
            credit,
            date,
          });
        }
      }

      setOpeningBalances(newEntries);
      toast.success(`Imported ${newEntries.length} opening balance entries`);
    };

    reader.onerror = () => {
      toast.error("Failed to read CSV file");
    };

    reader.readAsText(file);
  };

  const handleAddKnowledgeEntry = (entry: Omit<KnowledgeEntry, "id" | "createdAt">) => {
    const newEntry: KnowledgeEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setKnowledgeEntries((prev) => [...prev, newEntry]);
  };

  const handleDeleteKnowledgeEntry = (id: string) => {
    setKnowledgeEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleClearAllData = () => {
    setJournalEntries([]);
    setOpeningBalances([]);
    history.clear();
    setMessages([{
      id: "1",
      role: "assistant",
      content: "All accounting data has been cleared. You can start fresh by running a simulation or adding new entries.",
      timestamp: new Date(),
    }]);
    toast.success("All accounting data cleared successfully");
    setActiveView("coa");
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar 
          activeView={activeView} 
          onViewChange={setActiveView}
          onClearAllData={handleClearAllData}
          dataCounts={{
            journalEntries: journalEntries.length,
            openingBalances: openingBalances.length,
            knowledgeEntries: knowledgeEntries.length,
            isOpeningBalanced: Math.abs(
              openingBalances.reduce((sum, e) => sum + e.debit, 0) - 
              openingBalances.reduce((sum, e) => sum + e.credit, 0)
            ) < 0.01,
          }}
        />
        
        <div className="flex-1 flex flex-col h-screen min-w-0">
          <header className="h-12 border-b border-border flex items-center px-4 flex-shrink-0 gap-3">
            <SidebarTrigger className="mr-1" />
            <h1 className="text-xs font-mono font-semibold tracking-tight">Cynco Accounting Simulation</h1>
            
            <div className="flex items-center gap-2 ml-auto">
              <Button
                onClick={handleUndo}
                disabled={!history.canUndo}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                onClick={handleRedo}
                disabled={!history.canRedo}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                onClick={() => setRestoreDialogOpen(true)}
                variant="ghost"
                size="sm"
                className="h-8 px-2 gap-1.5"
                title="Backup & Restore"
              >
                <Save className="h-3.5 w-3.5" />
                <span className="text-[10px] font-mono">Backup</span>
              </Button>
              {isSaving ? (
                <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                  <span className="animate-pulse">●</span> Saving...
                </span>
              ) : lastSaved ? (
                <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                  <span className="text-green-600">●</span> Saved {lastSaved.toLocaleTimeString()}
                </span>
              ) : null}
            </div>
          </header>

          <RestoreDialog 
            open={restoreDialogOpen}
            onOpenChange={setRestoreDialogOpen}
            onRestore={handleRestore}
          />

          <ResizablePanel
            leftPanel={
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                isProcessing={isProcessing}
                currentView={activeView}
                totalEntries={journalEntries.length}
                isBalanced={Math.abs(
                  journalEntries.reduce((sum, e) => sum + e.debit, 0) - 
                  journalEntries.reduce((sum, e) => sum + e.credit, 0)
                ) < 0.01}
                onClearChat={() => setMessages([{
                  id: "1",
                  role: "assistant",
                  content: "Hello! I'm your Cynco AI assistant. I can help you understand your financial data, interpret reports, and answer accounting questions.\n\nTry asking:\n• 'What's my current cash balance?'\n• 'Is my trial balance correct?'\n• 'Explain my P&L statement'\n• Or upload documents for processing",
                  timestamp: new Date(),
                }])}
              />
            }
            rightPanel={
              <SpreadsheetPanel
                journalEntries={journalEntries}
                openingBalances={openingBalances}
                knowledgeEntries={knowledgeEntries}
                onUpdateJournalEntry={handleUpdateJournalEntry}
                onDeleteJournalEntry={handleDeleteJournalEntry}
                onAddJournalEntry={handleAddJournalEntry}
                onUpdateOpeningBalance={handleUpdateOpeningBalance}
                onDeleteOpeningBalance={handleDeleteOpeningBalance}
                onAddOpeningBalance={handleAddOpeningBalance}
                onUploadOpeningBalanceCSV={handleUploadOpeningBalanceCSV}
                onAddKnowledgeEntry={handleAddKnowledgeEntry}
                onDeleteKnowledgeEntry={handleDeleteKnowledgeEntry}
                onRunSimulation={handleRunSimulation}
                isSimulating={isSimulating}
                activeView={activeView}
              />
            }
            defaultWidth={380}
            minWidth={300}
            maxWidth={600}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
