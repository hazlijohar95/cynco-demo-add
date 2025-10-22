import type { JournalEntry } from "../SpreadsheetPanel";
import type { OpeningBalanceEntry } from "./OpeningBalance";

interface BalanceSheetProps {
  journalEntries: JournalEntry[];
  openingBalances: OpeningBalanceEntry[];
}

export const BalanceSheet = ({ journalEntries, openingBalances }: BalanceSheetProps) => {
  const categorizeAccount = (accountStr: string) => {
    const accountCode = accountStr.split(" - ")[0];
    
    // Assets: 1000-1999
    if (accountCode >= "1000" && accountCode < "2000") {
      return "asset";
    }
    // Liabilities: 2000-2999
    else if (accountCode >= "2000" && accountCode < "3000") {
      return "liability";
    }
    // Equity: 3000-3999
    else if (accountCode >= "3000" && accountCode < "4000") {
      return "equity";
    }
    return "other";
  };

  const assetAccounts = new Map<string, number>();
  const liabilityAccounts = new Map<string, number>();
  const equityAccounts = new Map<string, number>();

  // First, process opening balances
  openingBalances.forEach((entry) => {
    const category = categorizeAccount(entry.account);
    const balance = entry.debit - entry.credit;

    if (category === "asset") {
      const current = assetAccounts.get(entry.account) || 0;
      assetAccounts.set(entry.account, current + balance);
    } else if (category === "liability") {
      const current = liabilityAccounts.get(entry.account) || 0;
      liabilityAccounts.set(entry.account, current - balance);
    } else if (category === "equity") {
      const current = equityAccounts.get(entry.account) || 0;
      equityAccounts.set(entry.account, current - balance);
    }
  });

  // Then, process current period journal entries
  journalEntries.forEach((entry) => {
    const category = categorizeAccount(entry.account);
    const balance = entry.debit - entry.credit;

    if (category === "asset") {
      const current = assetAccounts.get(entry.account) || 0;
      assetAccounts.set(entry.account, current + balance);
    } else if (category === "liability") {
      const current = liabilityAccounts.get(entry.account) || 0;
      liabilityAccounts.set(entry.account, current - balance);
    } else if (category === "equity") {
      const current = equityAccounts.get(entry.account) || 0;
      equityAccounts.set(entry.account, current - balance);
    }
  });

  const totalAssets = Array.from(assetAccounts.values()).reduce((sum, v) => sum + v, 0);
  const totalLiabilities = Array.from(liabilityAccounts.values()).reduce((sum, v) => sum + v, 0);
  const totalEquity = Array.from(equityAccounts.values()).reduce((sum, v) => sum + v, 0);

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
          <div className="border-b border-border pb-4 mb-8">
            <h2 className="text-2xl font-mono font-bold tracking-tight">Balance Sheet</h2>
            <p className="text-sm text-muted-foreground mt-1 font-mono">
              Financial position at period end
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Assets */}
            <div>
              <table className="w-full border-collapse">
                <thead className="border-b border-border">
                  <tr>
                    <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider" colSpan={2}>
                      Assets
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(assetAccounts.entries()).map(([account, amount]) => (
                    <tr key={account} className="border-b border-border hover:bg-gridHover transition-colors">
                      <td className="p-3 font-mono text-sm">{account}</td>
                      <td className="p-3 text-right font-mono text-sm tabular-nums">
                        {amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-foreground bg-muted">
                    <td className="p-3 text-right font-mono text-sm font-semibold">Total Assets:</td>
                    <td className="p-3 text-right font-mono text-sm font-semibold tabular-nums">
                      {totalAssets.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Liabilities & Equity */}
            <div className="space-y-8">
              <table className="w-full border-collapse">
                <thead className="border-b border-border">
                  <tr>
                    <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider" colSpan={2}>
                      Liabilities
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(liabilityAccounts.entries()).map(([account, amount]) => (
                    <tr key={account} className="border-b border-border hover:bg-gridHover transition-colors">
                      <td className="p-3 font-mono text-sm">{account}</td>
                      <td className="p-3 text-right font-mono text-sm tabular-nums">
                        {amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-foreground">
                    <td className="p-3 text-right font-mono text-sm font-semibold">Total Liabilities:</td>
                    <td className="p-3 text-right font-mono text-sm font-semibold tabular-nums">
                      {totalLiabilities.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="w-full border-collapse">
                <thead className="border-b border-border">
                  <tr>
                    <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider" colSpan={2}>
                      Equity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(equityAccounts.entries()).map(([account, amount]) => (
                    <tr key={account} className="border-b border-border hover:bg-gridHover transition-colors">
                      <td className="p-3 font-mono text-sm">{account}</td>
                      <td className="p-3 text-right font-mono text-sm tabular-nums">
                        {amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-foreground">
                    <td className="p-3 text-right font-mono text-sm font-semibold">Total Equity:</td>
                    <td className="p-3 text-right font-mono text-sm font-semibold tabular-nums">
                      {totalEquity.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-t-2 border-foreground bg-muted">
                    <td className="p-3 text-right font-mono text-sm font-semibold">Total L + E:</td>
                    <td className="p-3 text-right font-mono text-sm font-semibold tabular-nums">
                      {(totalLiabilities + totalEquity).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Accounting Equation Check */}
          <div className={`mt-8 p-4 border-2 text-center font-mono text-sm font-semibold ${
            Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01
              ? "border-foreground"
              : "border-foreground bg-muted"
          }`}>
            Assets = Liabilities + Equity: {totalAssets.toFixed(2)} = {(totalLiabilities + totalEquity).toFixed(2)}
            {Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01 ? " ✓" : " ✗"}
          </div>
        </div>
      </div>
    );
  };
