import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatPanel, Message } from "@/components/ChatPanel";
import { SpreadsheetPanel, JournalEntry } from "@/components/SpreadsheetPanel";
import { ResizablePanel } from "@/components/ResizablePanel";
import { toast } from "sonner";
import { generateSampleEntries, processDocumentToJournalEntry } from "@/utils/simulationData";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeView, setActiveView] = useState("coa");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (journalEntries.length > 0) {
      setLastSaved(new Date());
    }
  }, [journalEntries]);

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
    setJournalEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
    );
    toast.success("Entry updated", { duration: 1000 });
  };

  const handleDeleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((entry) => entry.id !== id));
    toast.success("Entry deleted", { duration: 1000 });
  };

  const handleAddJournalEntry = () => {
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
    setJournalEntries((prev) => [...prev, newEntry]);
    toast.success("New entry added", { duration: 1000 });
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar activeView={activeView} onViewChange={setActiveView} />
        
        <div className="flex-1 flex flex-col h-screen min-w-0">
          <header className="h-12 border-b border-border flex items-center px-4 flex-shrink-0">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-xs font-mono font-semibold tracking-tight">Cynco Accounting Simulation</h1>
            {lastSaved && (
              <span className="ml-auto text-[10px] font-mono text-muted-foreground">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </header>

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
                onUpdateJournalEntry={handleUpdateJournalEntry}
                onDeleteJournalEntry={handleDeleteJournalEntry}
                onAddJournalEntry={handleAddJournalEntry}
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
