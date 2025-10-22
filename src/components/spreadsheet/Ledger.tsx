import { ScrollArea } from "@/components/ui/scroll-area";
import type { LedgerEntry } from "../SpreadsheetPanel";

interface LedgerProps {
  ledger: LedgerEntry[];
}

export const Ledger = ({ ledger }: LedgerProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {ledger.map((account) => (
          <div key={account.account} className="border border-border rounded-lg overflow-hidden">
            <div className="bg-primary text-primary-foreground p-3 font-semibold">
              {account.account}
            </div>
            <table className="w-full border-collapse">
              <thead className="bg-gridHeader">
                <tr>
                  <th className="border border-gridBorder p-2 text-left text-sm font-semibold">Date</th>
                  <th className="border border-gridBorder p-2 text-left text-sm font-semibold">Description</th>
                  <th className="border border-gridBorder p-2 text-right text-sm font-semibold">Debit</th>
                  <th className="border border-gridBorder p-2 text-right text-sm font-semibold">Credit</th>
                  <th className="border border-gridBorder p-2 text-right text-sm font-semibold">Balance</th>
                </tr>
              </thead>
              <tbody>
                {account.entries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-gridHover transition-colors">
                    <td className="border border-gridBorder p-2 text-sm">{entry.date}</td>
                    <td className="border border-gridBorder p-2 text-sm">{entry.description}</td>
                    <td className="border border-gridBorder p-2 text-right text-sm text-debit">
                      {entry.debit > 0 ? entry.debit.toFixed(2) : ""}
                    </td>
                    <td className="border border-gridBorder p-2 text-right text-sm text-credit">
                      {entry.credit > 0 ? entry.credit.toFixed(2) : ""}
                    </td>
                    <td className="border border-gridBorder p-2 text-right text-sm font-medium">
                      {entry.balance.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
