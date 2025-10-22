import { useState } from "react";
import { ChatPanel, Message } from "@/components/ChatPanel";
import { SpreadsheetPanel, JournalEntry } from "@/components/SpreadsheetPanel";
import { toast } from "sonner";
import { generateSampleEntries, processDocumentToJournalEntry } from "@/utils/simulationData";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your Cynco AI assistant. Upload accounting documents or ask me to run a full simulation to see the accounting pipeline in action.\n\nTry:\n• Upload an invoice, bill, or receipt\n• Type 'Run simulation' to process sample documents\n• Edit any cell in the spreadsheet and watch real-time recalculations",
      timestamp: new Date(),
    },
  ]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

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

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `✓ Processed ${file.name}\n\nExtracted ${newEntries.length / 2} transaction(s) and created journal entries. The data has been added to the spreadsheet on the right.\n\nKey details:\n• Account: ${newEntries[0].account}\n• Amount: ${newEntries[0].debit > 0 ? newEntries[0].debit : newEntries[0].credit}\n• Reference: ${newEntries[0].reference}\n\nAll ledgers, trial balance, and financial reports have been updated automatically.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      toast.success(`Processed ${file.name}`);
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
      content: "✅ Simulation complete!\n\nGenerated:\n• 14 journal entries\n• Complete ledger accounts\n• Balanced trial balance\n• P&L statement\n• Balance sheet\n\nYou can now:\n• Edit any cell in the spreadsheet\n• Watch real-time recalculations\n• Navigate between tabs to see different views\n• Upload more documents to add transactions",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, completeMessage]);
    toast.success("Simulation completed successfully!");
    setIsSimulating(false);
  };

  const handleUpdateJournalEntry = (
    id: string,
    field: keyof JournalEntry,
    value: any
  ) => {
    setJournalEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
    );
    toast.success("Entry updated - all views recalculated");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Panel - Chat */}
      <div className="w-[400px] border-r border-border flex-shrink-0">
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
        />
      </div>

      {/* Right Panel - Spreadsheet */}
      <div className="flex-1">
        <SpreadsheetPanel
          journalEntries={journalEntries}
          onUpdateJournalEntry={handleUpdateJournalEntry}
          onRunSimulation={handleRunSimulation}
          isSimulating={isSimulating}
        />
      </div>
    </div>
  );
};

export default Index;
