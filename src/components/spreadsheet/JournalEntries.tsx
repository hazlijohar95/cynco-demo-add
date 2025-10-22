import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { JournalEntry } from "../SpreadsheetPanel";
import { CHART_OF_ACCOUNTS } from "@/utils/chartOfAccounts";
import { useState, useRef, useEffect } from "react";

interface JournalEntriesProps {
  entries: JournalEntry[];
  onUpdate: (id: string, field: keyof JournalEntry, value: any) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export const JournalEntries = ({ entries, onUpdate, onDelete, onAddNew }: JournalEntriesProps) => {
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [accountSearchMap, setAccountSearchMap] = useState<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCellChange = (id: string, field: keyof JournalEntry, value: string) => {
    if (field === "debit" || field === "credit") {
      const numValue = value === "" ? 0 : parseFloat(value);
      if (!isNaN(numValue)) {
        onUpdate(id, field, numValue);
      }
    } else {
      onUpdate(id, field, value);
    }
  };

  const handleAccountSearch = (id: string, value: string) => {
    setAccountSearchMap(prev => ({ ...prev, [id]: value }));
    handleCellChange(id, "account", value);
  };

  const selectAccount = (id: string, account: string) => {
    handleCellChange(id, "account", account);
    setEditingAccountId(null);
    setAccountSearchMap(prev => ({ ...prev, [id]: account }));
  };

  const getFilteredAccounts = (searchTerm: string) => {
    if (!searchTerm) return CHART_OF_ACCOUNTS.filter(acc => !acc.isParent);
    return CHART_OF_ACCOUNTS.filter(acc => 
      !acc.isParent && (
        acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.code.includes(searchTerm)
      )
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setEditingAccountId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = entries.reduce((sum, e) => sum + e.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-4">
              <div className={`text-xs font-mono ${isBalanced ? 'text-foreground' : 'text-destructive'}`}>
                Balance: {isBalanced ? '✓ Balanced' : `✗ Out by ${Math.abs(totalDebit - totalCredit).toFixed(2)}`}
              </div>
            </div>
          </div>
          <Button
            onClick={onAddNew}
            size="sm"
            variant="outline"
            className="gap-2 font-mono text-xs"
          >
            <Plus className="h-3 w-3" />
            Add Entry
          </Button>
        </div>

        <table className="w-full border-collapse border border-border">
          <thead className="sticky top-0 bg-background z-10">
            <tr className="border-b-2 border-foreground">
              <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider border-r border-border w-[110px]">Date</th>
              <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider border-r border-border w-[220px]">Account</th>
              <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider border-r border-border">Description</th>
              <th className="p-3 text-right text-[10px] font-mono font-semibold uppercase tracking-wider border-r border-border w-[120px]">Debit</th>
              <th className="p-3 text-right text-[10px] font-mono font-semibold uppercase tracking-wider border-r border-border w-[120px]">Credit</th>
              <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider border-r border-border w-[100px]">Reference</th>
              <th className="p-3 w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const searchTerm = accountSearchMap[entry.id] ?? entry.account;
              const filteredAccounts = getFilteredAccounts(searchTerm);
              
              return (
                <tr key={entry.id} className={`border-b border-border hover:bg-gridHover transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                  <td className="p-0 border-r border-border">
                    <Input
                      type="date"
                      value={entry.date}
                      onChange={(e) => handleCellChange(entry.id, "date", e.target.value)}
                      className="border-0 rounded-none h-10 font-mono text-xs bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-gridSelected"
                    />
                  </td>
                  <td className="p-0 border-r border-border relative">
                    <Input
                      value={searchTerm}
                      onChange={(e) => handleAccountSearch(entry.id, e.target.value)}
                      onFocus={() => setEditingAccountId(entry.id)}
                      className="border-0 rounded-none h-10 font-mono text-xs bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-gridSelected"
                      placeholder="Select account..."
                    />
                    {editingAccountId === entry.id && filteredAccounts.length > 0 && (
                      <div 
                        ref={dropdownRef}
                        className="absolute top-full left-0 w-[400px] max-h-[300px] overflow-y-auto bg-background border border-border shadow-lg z-50"
                      >
                        {filteredAccounts.map((acc) => (
                          <div
                            key={acc.code}
                            onClick={() => selectAccount(entry.id, `${acc.code} - ${acc.name}`)}
                            className="p-2 hover:bg-gridHover cursor-pointer border-b border-border"
                          >
                            <div className="font-mono text-xs font-semibold">{acc.code} - {acc.name}</div>
                            {acc.description && (
                              <div className="font-mono text-[10px] text-muted-foreground">{acc.description}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-0 border-r border-border">
                    <Input
                      value={entry.description}
                      onChange={(e) => handleCellChange(entry.id, "description", e.target.value)}
                      className="border-0 rounded-none h-10 font-mono text-xs bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-gridSelected"
                      placeholder="Enter description..."
                    />
                  </td>
                  <td className="p-0 border-r border-border">
                    <Input
                      type="number"
                      step="0.01"
                      value={entry.debit === 0 ? "" : entry.debit}
                      onChange={(e) => handleCellChange(entry.id, "debit", e.target.value)}
                      className="border-0 rounded-none h-10 text-right font-mono text-xs tabular-nums bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-gridSelected"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="p-0 border-r border-border">
                    <Input
                      type="number"
                      step="0.01"
                      value={entry.credit === 0 ? "" : entry.credit}
                      onChange={(e) => handleCellChange(entry.id, "credit", e.target.value)}
                      className="border-0 rounded-none h-10 text-right font-mono text-xs tabular-nums bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-gridSelected"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="p-0 border-r border-border">
                    <Input
                      value={entry.reference}
                      onChange={(e) => handleCellChange(entry.id, "reference", e.target.value)}
                      className="border-0 rounded-none h-10 font-mono text-xs bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-gridSelected"
                      placeholder="REF-000"
                    />
                  </td>
                  <td className="p-0">
                    <Button
                      onClick={() => onDelete(entry.id)}
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              );
            })}
            <tr className="border-t-2 border-foreground bg-gridHeader font-semibold">
              <td colSpan={3} className="p-3 text-right font-mono text-xs border-r border-border">Total:</td>
              <td className={`p-3 text-right font-mono text-xs tabular-nums border-r border-border ${!isBalanced && totalDebit > totalCredit ? 'text-destructive' : ''}`}>
                {totalDebit.toFixed(2)}
              </td>
              <td className={`p-3 text-right font-mono text-xs tabular-nums border-r border-border ${!isBalanced && totalCredit > totalDebit ? 'text-destructive' : ''}`}>
                {totalCredit.toFixed(2)}
              </td>
              <td colSpan={2} className="p-3"></td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 p-3 bg-muted/30 border border-border">
          <p className="font-mono text-[10px] text-muted-foreground">
            <strong>Tip:</strong> Click any cell to edit • Click account field to see dropdown • All views update automatically when you make changes
          </p>
        </div>
      </div>
    </div>
  );
};