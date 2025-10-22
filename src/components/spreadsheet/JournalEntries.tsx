import { ScrollArea } from "@/components/ui/scroll-area";
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
    <ScrollArea className="h-full">
      <div className="min-w-max">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-gridHeader z-10">
            <tr>
              <th className="border border-gridBorder p-2 text-left text-sm font-semibold min-w-[100px]">Date</th>
              <th className="border border-gridBorder p-2 text-left text-sm font-semibold min-w-[150px]">Account</th>
              <th className="border border-gridBorder p-2 text-left text-sm font-semibold min-w-[200px]">Description</th>
              <th className="border border-gridBorder p-2 text-right text-sm font-semibold min-w-[120px]">Debit</th>
              <th className="border border-gridBorder p-2 text-right text-sm font-semibold min-w-[120px]">Credit</th>
              <th className="border border-gridBorder p-2 text-left text-sm font-semibold min-w-[100px]">Reference</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gridHover transition-colors">
                <td className="border border-gridBorder p-0">
                  <Input
                    type="date"
                    value={entry.date}
                    onChange={(e) => handleCellChange(entry.id, "date", e.target.value)}
                    className="border-0 rounded-none h-9 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </td>
                <td className="border border-gridBorder p-0">
                  <Input
                    value={entry.account}
                    onChange={(e) => handleCellChange(entry.id, "account", e.target.value)}
                    className="border-0 rounded-none h-9 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </td>
                <td className="border border-gridBorder p-0">
                  <Input
                    value={entry.description}
                    onChange={(e) => handleCellChange(entry.id, "description", e.target.value)}
                    className="border-0 rounded-none h-9 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </td>
                <td className="border border-gridBorder p-0">
                  <Input
                    type="number"
                    step="0.01"
                    value={formatCurrency(entry.debit)}
                    onChange={(e) => handleCellChange(entry.id, "debit", e.target.value)}
                    className="border-0 rounded-none h-9 text-right focus-visible:ring-1 focus-visible:ring-primary text-debit"
                  />
                </td>
                <td className="border border-gridBorder p-0">
                  <Input
                    type="number"
                    step="0.01"
                    value={formatCurrency(entry.credit)}
                    onChange={(e) => handleCellChange(entry.id, "credit", e.target.value)}
                    className="border-0 rounded-none h-9 text-right focus-visible:ring-1 focus-visible:ring-primary text-credit"
                  />
                </td>
                <td className="border border-gridBorder p-0">
                  <Input
                    value={entry.reference}
                    onChange={(e) => handleCellChange(entry.id, "reference", e.target.value)}
                    className="border-0 rounded-none h-9 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </td>
              </tr>
            ))}
            <tr className="bg-gridHeader font-semibold">
              <td colSpan={3} className="border border-gridBorder p-2 text-right">Total:</td>
              <td className="border border-gridBorder p-2 text-right text-debit">
                {totalDebit.toFixed(2)}
              </td>
              <td className="border border-gridBorder p-2 text-right text-credit">
                {totalCredit.toFixed(2)}
              </td>
              <td className="border border-gridBorder p-2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </ScrollArea>
  );
};
