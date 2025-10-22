import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play, Download } from "lucide-react";
import { ChartOfAccounts } from "./spreadsheet/ChartOfAccounts";
import { JournalEntries } from "./spreadsheet/JournalEntries";
import { Ledger } from "./spreadsheet/Ledger";
import { TrialBalance } from "./spreadsheet/TrialBalance";
import { ProfitLoss } from "./spreadsheet/ProfitLoss";
import { BalanceSheet } from "./spreadsheet/BalanceSheet";
import { OpeningBalance, OpeningBalanceEntry } from "./spreadsheet/OpeningBalance";
import { exportToCSV, exportToJSON } from "@/hooks/useLocalStorage";
import { toast } from "sonner";

export interface JournalEntry {
  id: string;
  date: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
  reference: string;
}

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
  onUpdateJournalEntry: (id: string, field: keyof JournalEntry, value: any) => void;
  onDeleteJournalEntry: (id: string) => void;
  onAddJournalEntry: () => void;
  onUpdateOpeningBalance: (id: string, field: keyof OpeningBalanceEntry, value: any) => void;
  onDeleteOpeningBalance: (id: string) => void;
  onAddOpeningBalance: () => void;
  onUploadOpeningBalanceCSV: (file: File) => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
  activeView: string;
}

export const SpreadsheetPanel = ({
  journalEntries,
  openingBalances,
  onUpdateJournalEntry,
  onDeleteJournalEntry,
  onAddJournalEntry,
  onUpdateOpeningBalance,
  onDeleteOpeningBalance,
  onAddOpeningBalance,
  onUploadOpeningBalanceCSV,
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
    exportToCSV(journalEntries, `cynco-journal-entries-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success("Exported to CSV");
  };

  const handleExportJSON = () => {
    if (journalEntries.length === 0) {
      toast.error("No data to export");
      return;
    }
    exportToJSON(journalEntries, `cynco-journal-entries-${new Date().toISOString().split('T')[0]}.json`);
    toast.success("Exported to JSON");
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header - Fixed */}
      <div className="border-b border-border px-6 py-4 flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-xl font-mono font-bold tracking-tight">Financial Dashboard</h1>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">Real-time accounting data</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="gap-2 rounded font-mono text-xs"
          >
            <Download className="h-3 w-3" />
            Export CSV
          </Button>
          <Button
            onClick={handleExportJSON}
            variant="outline"
            size="sm"
            className="gap-2 rounded font-mono text-xs"
          >
            <Download className="h-3 w-3" />
            Export JSON
          </Button>
          <Button
            onClick={onRunSimulation}
            disabled={isSimulating}
            variant="default"
            className="gap-2 rounded font-mono text-xs"
          >
            {isSimulating ? (
              <>Processing...</>
            ) : (
              <>
                <Play className="h-3 w-3" />
                Run Full Simulation
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
        {activeView === "ledger" && <Ledger ledger={calculateLedger()} />}
        {activeView === "trial" && <TrialBalance data={calculateTrialBalance()} />}
        {activeView === "pl" && <ProfitLoss journalEntries={journalEntries} />}
        {activeView === "balance" && <BalanceSheet journalEntries={journalEntries} openingBalances={openingBalances} />}
      </div>
    </div>
  );
};
