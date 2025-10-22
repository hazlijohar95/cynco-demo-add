import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { JournalEntries } from "./spreadsheet/JournalEntries";
import { Ledger } from "./spreadsheet/Ledger";
import { TrialBalance } from "./spreadsheet/TrialBalance";
import { ProfitLoss } from "./spreadsheet/ProfitLoss";
import { BalanceSheet } from "./spreadsheet/BalanceSheet";

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
  onUpdateJournalEntry: (id: string, field: keyof JournalEntry, value: any) => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
}

export const SpreadsheetPanel = ({
  journalEntries,
  onUpdateJournalEntry,
  onRunSimulation,
  isSimulating,
}: SpreadsheetPanelProps) => {
  const [activeTab, setActiveTab] = useState("journal");

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

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-gradient-to-r from-accent to-accent/90 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-accent-foreground">Smart Sheet</h2>
          <p className="text-sm text-accent-foreground/80">Live financial data</p>
        </div>
        <Button
          onClick={onRunSimulation}
          disabled={isSimulating}
          variant="secondary"
          className="gap-2"
        >
          {isSimulating ? (
            <>Processing...</>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Full Simulation
            </>
          )}
        </Button>
      </div>

      {/* Spreadsheet Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="border-b border-border rounded-none bg-gridHeader h-auto p-1">
          <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          <TabsTrigger value="ledger">Ledger</TabsTrigger>
          <TabsTrigger value="trial">Trial Balance</TabsTrigger>
          <TabsTrigger value="pl">P&L</TabsTrigger>
          <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
        </TabsList>

        <TabsContent value="journal" className="flex-1 m-0">
          <JournalEntries entries={journalEntries} onUpdate={onUpdateJournalEntry} />
        </TabsContent>

        <TabsContent value="ledger" className="flex-1 m-0">
          <Ledger ledger={calculateLedger()} />
        </TabsContent>

        <TabsContent value="trial" className="flex-1 m-0">
          <TrialBalance data={calculateTrialBalance()} />
        </TabsContent>

        <TabsContent value="pl" className="flex-1 m-0">
          <ProfitLoss journalEntries={journalEntries} />
        </TabsContent>

        <TabsContent value="balance" className="flex-1 m-0">
          <BalanceSheet journalEntries={journalEntries} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
