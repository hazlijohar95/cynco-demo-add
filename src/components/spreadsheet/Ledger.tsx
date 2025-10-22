import type { LedgerEntry } from "../SpreadsheetPanel";

interface LedgerProps {
  ledger: LedgerEntry[];
}

export const Ledger = ({ ledger }: LedgerProps) => {
  return (
    <div className="p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
          {ledger.map((account) => (
            <div key={account.account} className="border border-border">
              <div className="bg-foreground text-background px-4 py-3">
                <h3 className="font-mono text-sm font-semibold tracking-tight">{account.account}</h3>
              </div>
              <table className="w-full border-collapse">
                <thead className="border-b border-border">
                  <tr>
                    <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider">Date</th>
                    <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider">Description</th>
                    <th className="p-3 text-right text-[10px] font-mono font-semibold uppercase tracking-wider">Debit</th>
                    <th className="p-3 text-right text-[10px] font-mono font-semibold uppercase tracking-wider">Credit</th>
                    <th className="p-3 text-right text-[10px] font-mono font-semibold uppercase tracking-wider">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {account.entries.map((entry, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-gridHover transition-colors">
                      <td className="p-3 font-mono text-xs">{entry.date}</td>
                      <td className="p-3 font-mono text-xs">{entry.description}</td>
                      <td className="p-3 text-right font-mono text-xs tabular-nums">
                        {entry.debit > 0 ? entry.debit.toFixed(2) : "—"}
                      </td>
                      <td className="p-3 text-right font-mono text-xs tabular-nums">
                        {entry.credit > 0 ? entry.credit.toFixed(2) : "—"}
                      </td>
                      <td className="p-3 text-right font-mono text-xs font-semibold tabular-nums">
                        {entry.balance.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    );
  };
