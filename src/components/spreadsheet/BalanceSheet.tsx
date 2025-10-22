import type { JournalEntry } from "../SpreadsheetPanel";
import type { OpeningBalanceEntry } from "./OpeningBalance";
import { Wallet, CreditCard, PiggyBank, Scale } from "lucide-react";

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
  const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01;

  return (
    <div className="p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-mono font-bold tracking-tight mb-2">Balance Sheet</h2>
          <p className="text-sm text-muted-foreground font-mono">
            Financial position at period end
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="group bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-mono font-bold tabular-nums mb-1">{totalAssets.toFixed(2)}</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Total Assets</div>
          </div>

          <div className="group bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                <CreditCard className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="text-2xl font-mono font-bold tabular-nums mb-1">{totalLiabilities.toFixed(2)}</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Total Liabilities</div>
          </div>

          <div className="group bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                <PiggyBank className="h-5 w-5 text-accent" />
              </div>
            </div>
            <div className="text-2xl font-mono font-bold tabular-nums mb-1">{totalEquity.toFixed(2)}</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Total Equity</div>
          </div>

          <div className={`group bg-gradient-to-br border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 ${
            isBalanced 
              ? "from-green-500/10 to-green-500/5 border-green-500/20" 
              : "from-red-500/10 to-red-500/5 border-red-500/20"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg transition-colors ${
                isBalanced 
                  ? "bg-green-500/10 group-hover:bg-green-500/20" 
                  : "bg-red-500/10 group-hover:bg-red-500/20"
              }`}>
                <Scale className={`h-5 w-5 ${isBalanced ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`} />
              </div>
            </div>
            <div className={`text-2xl font-mono font-bold mb-1 ${
              isBalanced ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}>
              {isBalanced ? "BALANCED" : "UNBALANCED"}
            </div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Equation Status</div>
          </div>
        </div>

        {/* Financial Position Tables */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Assets */}
          <div className="border border-border rounded-lg overflow-hidden shadow-lg animate-scale-in">
            <div className="bg-primary/10 border-b-2 border-primary/20 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-mono font-bold text-lg uppercase tracking-wider">Assets</h3>
              </div>
            </div>
            <table className="w-full border-collapse">
              <thead className="bg-muted/30">
                <tr>
                  <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider">
                    Account
                  </th>
                  <th className="p-3 text-right text-[10px] font-mono font-semibold uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {assetAccounts.size === 0 ? (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-sm text-muted-foreground font-mono">
                      No asset accounts
                    </td>
                  </tr>
                ) : (
                  Array.from(assetAccounts.entries()).map(([account, amount]) => (
                    <tr key={account} className="border-b border-border hover:bg-primary/5 transition-colors group">
                      <td className="p-3 font-mono text-sm">{account}</td>
                      <td className="p-3 text-right font-mono text-sm tabular-nums group-hover:font-semibold transition-all">
                        {amount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
                <tr className="bg-primary/10 border-t-2 border-primary/30">
                  <td className="p-4 text-right font-mono font-bold">Total Assets:</td>
                  <td className="p-4 text-right font-mono font-bold tabular-nums text-primary text-lg">
                    {totalAssets.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Liabilities & Equity */}
          <div className="space-y-6">
            {/* Liabilities */}
            <div className="border border-border rounded-lg overflow-hidden shadow-lg animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <div className="bg-red-500/10 border-b-2 border-red-500/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <CreditCard className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-mono font-bold text-lg uppercase tracking-wider">Liabilities</h3>
                </div>
              </div>
              <table className="w-full border-collapse">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider">
                      Account
                    </th>
                    <th className="p-3 text-right text-[10px] font-mono font-semibold uppercase tracking-wider">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {liabilityAccounts.size === 0 ? (
                    <tr>
                      <td colSpan={2} className="p-6 text-center text-sm text-muted-foreground font-mono">
                        No liability accounts
                      </td>
                    </tr>
                  ) : (
                    Array.from(liabilityAccounts.entries()).map(([account, amount]) => (
                      <tr key={account} className="border-b border-border hover:bg-red-500/5 transition-colors group">
                        <td className="p-3 font-mono text-sm">{account}</td>
                        <td className="p-3 text-right font-mono text-sm tabular-nums group-hover:font-semibold transition-all">
                          {amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                  <tr className="bg-red-500/10 border-t border-red-500/30">
                    <td className="p-3 text-right font-mono font-semibold">Total Liabilities:</td>
                    <td className="p-3 text-right font-mono font-semibold tabular-nums text-red-600 dark:text-red-400">
                      {totalLiabilities.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Equity */}
            <div className="border border-border rounded-lg overflow-hidden shadow-lg animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="bg-accent/10 border-b-2 border-accent/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <PiggyBank className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-mono font-bold text-lg uppercase tracking-wider">Equity</h3>
                </div>
              </div>
              <table className="w-full border-collapse">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider">
                      Account
                    </th>
                    <th className="p-3 text-right text-[10px] font-mono font-semibold uppercase tracking-wider">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {equityAccounts.size === 0 ? (
                    <tr>
                      <td colSpan={2} className="p-6 text-center text-sm text-muted-foreground font-mono">
                        No equity accounts
                      </td>
                    </tr>
                  ) : (
                    Array.from(equityAccounts.entries()).map(([account, amount]) => (
                      <tr key={account} className="border-b border-border hover:bg-accent/5 transition-colors group">
                        <td className="p-3 font-mono text-sm">{account}</td>
                        <td className="p-3 text-right font-mono text-sm tabular-nums group-hover:font-semibold transition-all">
                          {amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                  <tr className="bg-accent/10 border-t border-accent/30">
                    <td className="p-3 text-right font-mono font-semibold">Total Equity:</td>
                    <td className="p-3 text-right font-mono font-semibold tabular-nums text-accent">
                      {totalEquity.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="bg-muted/50 border-t-2 border-border">
                    <td className="p-4 text-right font-mono font-bold">Total L + E:</td>
                    <td className="p-4 text-right font-mono font-bold tabular-nums text-lg">
                      {(totalLiabilities + totalEquity).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Accounting Equation Validation */}
        <div className={`mt-8 p-6 rounded-lg border-2 text-center shadow-lg transition-all ${
          isBalanced
            ? "border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-300"
            : "border-red-500/30 bg-red-500/5 text-red-700 dark:text-red-300"
        }`}>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Scale className={`h-6 w-6 ${isBalanced ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`} />
            <span className="font-mono text-lg font-bold">
              {isBalanced ? "✓ Books are Balanced" : "✗ Books are Out of Balance"}
            </span>
          </div>
          <div className="font-mono text-sm font-semibold">
            Assets ({totalAssets.toFixed(2)}) {isBalanced ? "=" : "≠"} Liabilities + Equity ({(totalLiabilities + totalEquity).toFixed(2)})
          </div>
          {!isBalanced && (
            <div className="mt-2 text-xs font-mono">
              Difference: {Math.abs(totalAssets - (totalLiabilities + totalEquity)).toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
