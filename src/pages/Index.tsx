import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatPanel, Message } from "@/components/ChatPanel";
import { SpreadsheetPanel, JournalEntry } from "@/components/SpreadsheetPanel";
import { OpeningBalanceEntry } from "@/components/spreadsheet/OpeningBalance";
import { KnowledgeEntry } from "@/components/spreadsheet/KnowledgeBase";
import { ResizablePanel } from "@/components/ResizablePanel";
import { RestoreDialog } from "@/components/RestoreDialog";
import { toast } from "sonner";
import { generateSampleEntries, processDocumentToJournalEntry } from "@/utils/simulationData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useHistory, ActionType } from "@/hooks/useHistory";
import { useAutoBackup, BackupData } from "@/hooks/useAutoBackup";
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

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (file) {
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
    } else if (content.toLowerCase().includes("simulation")) {
      handleRunSimulation();
    } else {
      // General query response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I can help you with:\n\n• Document processing - Upload invoices, bills, or receipts\n• Running full simulations - Click 'Run Full Simulation' button\n• Explaining entries - Ask about any transaction\n• Validating balances - I'll check if books are balanced\n\nWhat would you like to do?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }

    setIsProcessing(false);
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    
    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "🚀 Running full Cynco simulation...\n\nProcessing sample documents:\n1. Capital investment\n2. Equipment purchase\n3. Client invoices\n4. Operating expenses\n5. Payments received\n\nGenerating complete accounting pipeline...",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const sampleEntries = generateSampleEntries();
    setJournalEntries(sampleEntries);

    const completeMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "✅ Simulation complete!\n\nGenerated:\n• Chart of Accounts\n• 14 journal entries\n• Complete ledger accounts\n• Balanced trial balance\n• P&L statement\n• Balance sheet\n\nYou can now:\n• Navigate between views using the sidebar\n• Edit any cell in the spreadsheet\n• Watch real-time recalculations\n• Upload more documents to add transactions",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, completeMessage]);
    toast.success("Simulation completed successfully!");
    setIsSimulating(false);
    setActiveView("coa");
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

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar 
          activeView={activeView} 
          onViewChange={setActiveView}
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
