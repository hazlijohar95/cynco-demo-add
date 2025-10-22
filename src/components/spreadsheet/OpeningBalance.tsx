import { useState } from "react";
import { Upload, Plus, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAccountOptions } from "@/utils/chartOfAccounts";
import { toast } from "sonner";

export interface OpeningBalanceEntry {
  id: string;
  account: string;
  debit: number;
  credit: number;
  date: string;
}

interface OpeningBalanceProps {
  entries: OpeningBalanceEntry[];
  onUpdate: (id: string, field: keyof OpeningBalanceEntry, value: any) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  onUploadCSV: (file: File) => void;
}

export const OpeningBalance = ({
  entries,
  onUpdate,
  onDelete,
  onAddNew,
  onUploadCSV,
}: OpeningBalanceProps) => {
  const [focusedCell, setFocusedCell] = useState<{ id: string; field: string } | null>(null);
  const accountOptions = getAccountOptions().filter(acc => {
    const code = acc.split(" - ")[0];
    // Only Balance Sheet accounts: Assets (1000-1999), Liabilities (2000-2999), Equity (3000-3999)
    return (code >= "1000" && code < "4000");
  });

  const totalDebits = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  const totalCredits = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.csv')) {
        onUploadCSV(file);
      } else {
        toast.error("Please upload a CSV file");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string, field: string, index: number) => {
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      const fields = ["account", "debit", "credit"];
      const currentFieldIndex = fields.indexOf(field);
      const nextFieldIndex = (currentFieldIndex + 1) % fields.length;
      
      if (nextFieldIndex === 0 && index < entries.length - 1) {
        // Move to next row
        setFocusedCell({ id: entries[index + 1].id, field: fields[0] });
      } else {
        setFocusedCell({ id, field: fields[nextFieldIndex] });
      }
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-b border-border pb-4 mb-6">
          <h2 className="text-2xl font-mono font-bold tracking-tight">Opening Balances</h2>
          <p className="text-sm text-muted-foreground mt-1 font-mono">
            Balance Sheet accounts at the beginning of the period
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-muted border border-border rounded p-4 mb-6 flex items-start gap-3">
          <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-xs font-mono space-y-1">
            <p className="font-semibold">Opening balances capture your financial position at the start of the period.</p>
            <p className="text-muted-foreground">
              • Only Balance Sheet accounts (Assets, Liabilities, Equity)
              <br />
              • Debits must equal Credits to maintain balance
              <br />
              • Upload a CSV or enter manually below
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button
              onClick={onAddNew}
              variant="default"
              size="sm"
              className="gap-2 rounded font-mono text-xs"
            >
              <Plus className="h-3 w-3" />
              Add Entry
            </Button>
            <label htmlFor="csv-upload">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded font-mono text-xs"
                asChild
              >
                <span>
                  <Upload className="h-3 w-3" />
                  Upload CSV
                </span>
              </Button>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
          <div className="text-xs font-mono">
            <span className={isBalanced ? "text-foreground" : "text-destructive font-semibold"}>
              Balance: {isBalanced ? "✓ Balanced" : "✗ Out of Balance"}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="border border-border rounded overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider w-[40%]">
                  Account
                </th>
                <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider w-[20%]">
                  Debit
                </th>
                <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider w-[20%]">
                  Credit
                </th>
                <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider w-[15%]">
                  Date
                </th>
                <th className="p-3 text-center text-[10px] font-mono font-semibold uppercase tracking-wider w-[5%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-muted-foreground font-mono">
                    No opening balances yet. Click "Add Entry" or upload a CSV to get started.
                  </td>
                </tr>
              ) : (
                entries.map((entry, index) => (
                  <tr key={entry.id} className="border-b border-border hover:bg-gridHover transition-colors">
                    <td className="p-2">
                      <Select
                        value={entry.account}
                        onValueChange={(value) => onUpdate(entry.id, "account", value)}
                      >
                        <SelectTrigger className="h-8 text-xs font-mono rounded border-border z-[100]">
                          <SelectValue placeholder="Select account..." />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-[100]">
                          {accountOptions.map((account) => (
                            <SelectItem key={account} value={account} className="text-xs font-mono">
                              {account}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={entry.debit || ""}
                        onChange={(e) => onUpdate(entry.id, "debit", parseFloat(e.target.value) || 0)}
                        onKeyDown={(e) => handleKeyDown(e, entry.id, "debit", index)}
                        onFocus={() => setFocusedCell({ id: entry.id, field: "debit" })}
                        className="h-8 text-xs font-mono rounded border-border tabular-nums text-right"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={entry.credit || ""}
                        onChange={(e) => onUpdate(entry.id, "credit", parseFloat(e.target.value) || 0)}
                        onKeyDown={(e) => handleKeyDown(e, entry.id, "credit", index)}
                        onFocus={() => setFocusedCell({ id: entry.id, field: "credit" })}
                        className="h-8 text-xs font-mono rounded border-border tabular-nums text-right"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="date"
                        value={entry.date}
                        onChange={(e) => onUpdate(entry.id, "date", e.target.value)}
                        className="h-8 text-xs font-mono rounded border-border"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <Button
                        onClick={() => onDelete(entry.id)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {entries.length > 0 && (
              <tfoot className="bg-muted border-t-2 border-foreground">
                <tr>
                  <td className="p-3 text-right font-mono text-sm font-semibold">Totals:</td>
                  <td className="p-3 text-right font-mono text-sm font-semibold tabular-nums">
                    {totalDebits.toFixed(2)}
                  </td>
                  <td className="p-3 text-right font-mono text-sm font-semibold tabular-nums">
                    {totalCredits.toFixed(2)}
                  </td>
                  <td colSpan={2} className="p-3"></td>
                </tr>
                <tr>
                  <td colSpan={2} className="p-3 text-right font-mono text-sm font-semibold">
                    Difference:
                  </td>
                  <td className="p-3 text-right font-mono text-sm font-semibold tabular-nums" colSpan={3}>
                    <span className={isBalanced ? "" : "text-destructive"}>
                      {Math.abs(totalDebits - totalCredits).toFixed(2)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Tips */}
        <div className="mt-6 text-xs text-muted-foreground font-mono space-y-1">
          <p>💡 Tips:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use Tab or Enter to navigate between cells</li>
            <li>Opening balances typically represent the closing balances from the previous fiscal year</li>
            <li>Total debits must equal total credits for proper accounting balance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
