import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play, Download, FileText } from "lucide-react";
import { ChartOfAccounts } from "./spreadsheet/ChartOfAccounts";
import { JournalEntries } from "./spreadsheet/JournalEntries";
import { Ledger } from "./spreadsheet/Ledger";
import { TrialBalance } from "./spreadsheet/TrialBalance";
import { ProfitLoss } from "./spreadsheet/ProfitLoss";
import { BalanceSheet } from "./spreadsheet/BalanceSheet";
import { OpeningBalance, OpeningBalanceEntry } from "./spreadsheet/OpeningBalance";
import { KnowledgeBase, KnowledgeEntry } from "./spreadsheet/KnowledgeBase";
import { BankReconciliation } from "./spreadsheet/BankReconciliation";
import { JournalEntry } from "@/types";
import { exportToCSV } from "@/hooks/useLocalStorage";
import { exportToPDF } from "@/utils/pdfExport";
import { toast } from "sonner";
import { InfoTooltip } from "@/components/ui/info-tooltip";

export interface LedgerEntry {
  account: string;
  entries: {
    date: string;
    description: string;
    debit: number;
    credit: number;
    balance: number;
  }[];
}

interface SpreadsheetPanelProps {
  journalEntries: JournalEntry[];
  openingBalances: OpeningBalanceEntry[];
  knowledgeEntries: KnowledgeEntry[];
  onUpdateJournalEntry: (id: string, field: keyof JournalEntry, value: any) => void;
  onDeleteJournalEntry: (id: string) => void;
  onAddJournalEntry: () => void;
  onUpdateOpeningBalance: (id: string, field: keyof OpeningBalanceEntry, value: any) => void;
  onDeleteOpeningBalance: (id: string) => void;
  onAddOpeningBalance: () => void;
  onUploadOpeningBalanceCSV: (file: File) => void;
  onAddKnowledgeEntry: (entry: Omit<KnowledgeEntry, "id" | "createdAt">) => void;
  onDeleteKnowledgeEntry: (id: string) => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
  activeView: string;
}

export const SpreadsheetPanel = ({
  journalEntries,
  openingBalances,
  knowledgeEntries,
  onUpdateJournalEntry,
  onDeleteJournalEntry,
  onAddJournalEntry,
  onUpdateOpeningBalance,
  onDeleteOpeningBalance,
  onAddOpeningBalance,
  onUploadOpeningBalanceCSV,
  onAddKnowledgeEntry,
  onDeleteKnowledgeEntry,
  onRunSimulation,
  isSimulating,
  activeView,
}: SpreadsheetPanelProps) => {

  // Calculate ledger from journal entries
  const calculateLedger = (): LedgerEntry[] => {
    const ledgerMap = new Map<string, LedgerEntry>();

    journalEntries.forEach((entry) => {
      if (!ledgerMap.has(entry.account)) {
        ledgerMap.set(entry.account, { account: entry.account, entries: [] });
      }

      const ledger = ledgerMap.get(entry.account)!;
      const prevBalance = ledger.entries.length > 0 
        ? ledger.entries[ledger.entries.length - 1].balance 
        : 0;
      
      const balance = prevBalance + entry.debit - entry.credit;
      
      ledger.entries.push({
        date: entry.date,
        description: entry.description,
        debit: entry.debit,
        credit: entry.credit,
        balance,
      });
    });

    return Array.from(ledgerMap.values());
  };

  // Calculate trial balance
  const calculateTrialBalance = () => {
    const accounts = new Map<string, { debit: number; credit: number }>();

    journalEntries.forEach((entry) => {
      if (!accounts.has(entry.account)) {
        accounts.set(entry.account, { debit: 0, credit: 0 });
      }
      const account = accounts.get(entry.account)!;
      account.debit += entry.debit;
      account.credit += entry.credit;
    });

    return Array.from(accounts.entries()).map(([account, totals]) => ({
      account,
      debit: totals.debit,
      credit: totals.credit,
    }));
  };

  const handleExportCSV = () => {
    if (journalEntries.length === 0) {
      toast.error("No data to export");
      return;
    }
    exportToCSV(journalEntries, `cynco-journal-entries-${new Date().toISOString().split("T")[0]}.csv`);
    toast.success("Exported to CSV");
  };

  const handleExportPDF = () => {
    if (journalEntries.length === 0 && openingBalances.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    try {
      exportToPDF({
        journalEntries,
        openingBalances,
        activeView,
      });
      toast.success("PDF exported successfully!");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to export PDF';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header - Fixed */}
      <div className="border-b border-border px-3 md:px-6 py-3 md:py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-base md:text-xl font-mono font-bold tracking-tight">Financial Dashboard</h1>
          <InfoTooltip content="Real-time accounting data with automatic recalculation. All views update instantly when you edit any entry." />
        </div>
        <div className="flex gap-2 flex-wrap w-full md:w-auto">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="gap-1.5 rounded font-mono text-[10px] md:text-xs h-8 md:h-9 px-2 md:px-3 flex-1 md:flex-initial"
          >
            <Download className="h-3 w-3" />
            <span className="hidden sm:inline">Export </span>CSV
          </Button>
          <Button
            onClick={handleExportPDF}
            variant="default"
            size="sm"
            className="gap-1.5 rounded font-mono text-[10px] md:text-xs h-8 md:h-9 px-2 md:px-3 flex-1 md:flex-initial"
          >
            <FileText className="h-3 w-3" />
            <span className="hidden sm:inline">Export </span>PDF
          </Button>
          <Button
            onClick={onRunSimulation}
            disabled={isSimulating}
            variant="default"
            className="gap-1.5 rounded font-mono text-[10px] md:text-xs h-8 md:h-9 px-2 md:px-3 w-full md:w-auto"
          >
            {isSimulating ? (
              <>Processing...</>
            ) : (
              <>
                <Play className="h-3 w-3" />
                <span className="hidden sm:inline">Run Full </span>Simulation
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {activeView === "coa" && <ChartOfAccounts journalEntries={journalEntries} />}
        {activeView === "journal" && (
          <JournalEntries 
            entries={journalEntries} 
            onUpdate={onUpdateJournalEntry}
            onDelete={onDeleteJournalEntry}
            onAddNew={onAddJournalEntry}
          />
        )}
        {activeView === "opening" && (
          <OpeningBalance 
            entries={openingBalances}
            onUpdate={onUpdateOpeningBalance}
            onDelete={onDeleteOpeningBalance}
            onAddNew={onAddOpeningBalance}
            onUploadCSV={onUploadOpeningBalanceCSV}
          />
        )}
        {activeView === "knowledge" && (
          <KnowledgeBase 
            entries={knowledgeEntries}
            onAdd={onAddKnowledgeEntry}
            onDelete={onDeleteKnowledgeEntry}
          />
        )}
        {activeView === "ledger" && <Ledger ledger={calculateLedger()} />}
        {activeView === "trial" && <TrialBalance data={calculateTrialBalance()} />}
        {activeView === "pl" && <ProfitLoss journalEntries={journalEntries} />}
        {activeView === "balance" && <BalanceSheet journalEntries={journalEntries} openingBalances={openingBalances} />}
        {activeView === "reconciliation" && (
          <BankReconciliation 
            journalEntries={journalEntries}
            onAddJournalEntry={onAddJournalEntry}
          />
        )}
      </div>
    </div>
  );
};
