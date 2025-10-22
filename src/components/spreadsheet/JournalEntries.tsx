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
  const [focusedCell, setFocusedCell] = useState<string | null>(null);
  const [showAccountDropdown, setShowAccountDropdown] = useState<string | null>(null);
  const [accountSearch, setAccountSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (value: number) => {
    return value === 0 ? "" : value.toFixed(2);
  };

  const handleCellChange = (id: string, field: keyof JournalEntry, value: string) => {
    if (field === "debit" || field === "credit") {
      const numValue = parseFloat(value) || 0;
      onUpdate(id, field, numValue);
    } else {
      onUpdate(id, field, value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string, field: keyof JournalEntry) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Move to next row, same column
      const currentIndex = entries.findIndex(entry => entry.id === id);
      if (currentIndex < entries.length - 1) {
        const nextId = entries[currentIndex + 1].id;
        setFocusedCell(`${nextId}-${field}`);
      } else {
        // Add new row if at the end
        onAddNew();
      }
    }
  };

  const filteredAccounts = CHART_OF_ACCOUNTS.filter(acc => 
    !acc.isParent && (
      acc.name.toLowerCase().includes(accountSearch.toLowerCase()) ||
      acc.code.includes(accountSearch)
    )
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(null);
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
            {entries.map((entry, index) => (
              <tr key={entry.id} className={`border-b border-border hover:bg-gridHover transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                <td className="p-0 border-r border-border">
                  <Input
                    type="date"
                    value={entry.date}
                    onChange={(e) => handleCellChange(entry.id, "date", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, entry.id, "date")}
                    className="border-0 rounded-none h-10 font-mono text-xs bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-gridSelected"
                  />
                </td>
                <td className="p-0 border-r border-border relative">
                  <Input
                    value={entry.account}
                    onChange={(e) => {
                      handleCellChange(entry.id, "account", e.target.value);
                      setAccountSearch(e.target.value);
                    }}
                    onFocus={() => {
                      setShowAccountDropdown(entry.id);
                      setAccountSearch(entry.account);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, entry.id, "account")}
                    className="border-0 rounded-none h-10 font-mono text-xs bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-gridSelected"
                    placeholder="Select account..."
                  />
                  {showAccountDropdown === entry.id && (
                    <div 
                      ref={dropdownRef}
                      className="absolute top-full left-0 w-[400px] max-h-[300px] overflow-y-auto bg-background border border-border shadow-lg z-50"
                    >
                      {filteredAccounts.map((acc) => (
                        <div
                          key={acc.code}
                          onClick={() => {
                            handleCellChange(entry.id, "account", `${acc.code} - ${acc.name}`);
                            setShowAccountDropdown(null);
                          }}
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
                    onKeyDown={(e) => handleKeyDown(e, entry.id, "description")}
                    className="border-0 rounded-none h-10 font-mono text-xs bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-gridSelected"
                    placeholder="Enter description..."
                  />
                </td>
                <td className="p-0 border-r border-border">
                  <Input
                    type="number"
                    step="0.01"
                    value={formatCurrency(entry.debit)}
                    onChange={(e) => handleCellChange(entry.id, "debit", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, entry.id, "debit")}
                    className="border-0 rounded-none h-10 text-right font-mono text-xs tabular-nums bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-gridSelected"
                    placeholder="0.00"
                  />
                </td>
                <td className="p-0 border-r border-border">
                  <Input
                    type="number"
                    step="0.01"
                    value={formatCurrency(entry.credit)}
                    onChange={(e) => handleCellChange(entry.id, "credit", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, entry.id, "credit")}
                    className="border-0 rounded-none h-10 text-right font-mono text-xs tabular-nums bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-gridSelected"
                    placeholder="0.00"
                  />
                </td>
                <td className="p-0 border-r border-border">
                  <Input
                    value={entry.reference}
                    onChange={(e) => handleCellChange(entry.id, "reference", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, entry.id, "reference")}
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
            ))}
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
            <strong>Tip:</strong> Click any cell to edit • Press Enter to move to next row • Use account dropdown for quick selection • Click + to add new entries
          </p>
        </div>
      </div>
    </div>
  );
};
