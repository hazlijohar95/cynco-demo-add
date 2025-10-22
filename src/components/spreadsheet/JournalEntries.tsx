import { Input } from "@/components/ui/input";
import type { JournalEntry } from "../SpreadsheetPanel";

interface JournalEntriesProps {
  entries: JournalEntry[];
  onUpdate: (id: string, field: keyof JournalEntry, value: any) => void;
}

export const JournalEntries = ({ entries, onUpdate }: JournalEntriesProps) => {
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

  const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = entries.reduce((sum, e) => sum + e.credit, 0);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-background z-10">
              <tr className="border-b border-border">
                <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider">Date</th>
                <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider">Account</th>
                <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider">Description</th>
                <th className="p-3 text-right text-[10px] font-mono font-semibold uppercase tracking-wider">Debit</th>
                <th className="p-3 text-right text-[10px] font-mono font-semibold uppercase tracking-wider">Credit</th>
                <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider">Reference</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-border hover:bg-gridHover transition-colors">
                  <td className="p-0">
                    <Input
                      type="date"
                      value={entry.date}
                      onChange={(e) => handleCellChange(entry.id, "date", e.target.value)}
                      className="border-0 rounded-none h-10 font-mono text-xs"
                    />
                  </td>
                  <td className="p-0">
                    <Input
                      value={entry.account}
                      onChange={(e) => handleCellChange(entry.id, "account", e.target.value)}
                      className="border-0 rounded-none h-10 font-mono text-xs"
                    />
                  </td>
                  <td className="p-0">
                    <Input
                      value={entry.description}
                      onChange={(e) => handleCellChange(entry.id, "description", e.target.value)}
                      className="border-0 rounded-none h-10 font-mono text-xs"
                    />
                  </td>
                  <td className="p-0">
                    <Input
                      type="number"
                      step="0.01"
                      value={formatCurrency(entry.debit)}
                      onChange={(e) => handleCellChange(entry.id, "debit", e.target.value)}
                      className="border-0 rounded-none h-10 text-right font-mono text-xs tabular-nums"
                    />
                  </td>
                  <td className="p-0">
                    <Input
                      type="number"
                      step="0.01"
                      value={formatCurrency(entry.credit)}
                      onChange={(e) => handleCellChange(entry.id, "credit", e.target.value)}
                      className="border-0 rounded-none h-10 text-right font-mono text-xs tabular-nums"
                    />
                  </td>
                  <td className="p-0">
                    <Input
                      value={entry.reference}
                      onChange={(e) => handleCellChange(entry.id, "reference", e.target.value)}
                      className="border-0 rounded-none h-10 font-mono text-xs"
                    />
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-foreground">
                <td colSpan={3} className="p-3 text-right font-mono text-xs font-semibold">Total:</td>
                <td className="p-3 text-right font-mono text-xs font-semibold tabular-nums">
                  {totalDebit.toFixed(2)}
                </td>
                <td className="p-3 text-right font-mono text-xs font-semibold tabular-nums">
                  {totalCredit.toFixed(2)}
                </td>
                <td className="p-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };
