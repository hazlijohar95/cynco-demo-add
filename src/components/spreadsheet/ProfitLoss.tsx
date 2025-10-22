import type { JournalEntry } from "../SpreadsheetPanel";
import { TrendingUp, TrendingDown, DollarSign, Minus } from "lucide-react";
import { PageHeader } from "@/components/ui/info-tooltip";

interface ProfitLossProps {
  journalEntries: JournalEntry[];
}

export const ProfitLoss = ({ journalEntries }: ProfitLossProps) => {
  // Calculate P&L from journal entries using COA codes
  const revenue = journalEntries
    .filter((e) => {
      const accountCode = e.account.split(" - ")[0];
      return accountCode >= "4000" && accountCode < "5000"; // Revenue accounts
    })
    .reduce((sum, e) => sum + e.credit - e.debit, 0);

  const cogs = journalEntries
    .filter((e) => {
      const accountCode = e.account.split(" - ")[0];
      return accountCode >= "5000" && accountCode < "6000"; // COGS accounts
    })
    .reduce((sum, e) => sum + e.debit - e.credit, 0);

  const expenses = journalEntries
    .filter((e) => {
      const accountCode = e.account.split(" - ")[0];
      return accountCode >= "6000" && accountCode < "8000"; // Operating + Other expenses
    })
    .reduce((sum, e) => sum + e.debit - e.credit, 0);

  const grossProfit = revenue - cogs;
  const netIncome = grossProfit - expenses;

  const revenueAccounts = new Map<string, number>();
  const cogsAccounts = new Map<string, number>();
  const expenseAccounts = new Map<string, number>();

  journalEntries.forEach((entry) => {
    const accountCode = entry.account.split(" - ")[0];
    
    if (accountCode >= "4000" && accountCode < "5000") {
      const current = revenueAccounts.get(entry.account) || 0;
      revenueAccounts.set(entry.account, current + entry.credit - entry.debit);
    } else if (accountCode >= "5000" && accountCode < "6000") {
      const current = cogsAccounts.get(entry.account) || 0;
      cogsAccounts.set(entry.account, current + entry.debit - entry.credit);
    } else if (accountCode >= "6000" && accountCode < "8000") {
      const current = expenseAccounts.get(entry.account) || 0;
      expenseAccounts.set(entry.account, current + entry.debit - entry.credit);
    }
  });

  const profitMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;
  const isProfitable = netIncome >= 0;

  return (
    <div className="p-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <PageHeader 
          title="Profit & Loss Statement"
          description="Shows income and expenses for the period. Revenue minus Cost of Goods Sold equals Gross Profit. Gross Profit minus Operating Expenses equals Net Income. Positive net income means you're profitable."
        />

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="group bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-mono font-bold tabular-nums mb-1">{revenue.toFixed(2)}</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Total Revenue</div>
          </div>

          <div className="group bg-gradient-to-br from-muted/50 to-muted/20 border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-muted rounded-lg group-hover:bg-muted/80 transition-colors">
                <Minus className="h-5 w-5 text-foreground" />
              </div>
            </div>
            <div className="text-2xl font-mono font-bold tabular-nums mb-1">{expenses.toFixed(2)}</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Total Expenses</div>
          </div>

          <div className={`group bg-gradient-to-br border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 ${
            isProfitable 
              ? "from-green-500/10 to-green-500/5 border-green-500/20" 
              : "from-red-500/10 to-red-500/5 border-red-500/20"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg transition-colors ${
                isProfitable 
                  ? "bg-green-500/10 group-hover:bg-green-500/20" 
                  : "bg-red-500/10 group-hover:bg-red-500/20"
              }`}>
                {isProfitable ? (
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
              </div>
            </div>
            <div className={`text-2xl font-mono font-bold tabular-nums mb-1 ${
              isProfitable ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}>
              {netIncome.toFixed(2)}
            </div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Net Income</div>
          </div>

          <div className="group bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
            </div>
            <div className={`text-2xl font-mono font-bold tabular-nums mb-1 ${
              profitMargin >= 0 ? "text-foreground" : "text-red-600 dark:text-red-400"
            }`}>
              {profitMargin.toFixed(1)}%
            </div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Profit Margin</div>
          </div>
        </div>

        {/* Financial Statement */}
        <div className="border border-border rounded-lg overflow-hidden shadow-lg">
          <table className="w-full border-collapse">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-4 text-left text-[11px] font-mono font-semibold uppercase tracking-wider">Account</th>
                <th className="p-4 text-right text-[11px] font-mono font-semibold uppercase tracking-wider">Amount</th>
                <th className="p-4 text-right text-[11px] font-mono font-semibold uppercase tracking-wider w-24">% of Revenue</th>
              </tr>
            </thead>
            <tbody>
              {/* Revenue Section */}
              <tr className="bg-primary/5 border-t-2 border-primary/20">
                <td colSpan={3} className="p-4 font-mono text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  Revenue
                </td>
              </tr>
              {Array.from(revenueAccounts.entries()).map(([account, amount]) => (
                <tr key={account} className="border-b border-border hover:bg-primary/5 transition-colors group">
                  <td className="p-4 pl-8 font-mono text-sm">{account}</td>
                  <td className="p-4 text-right font-mono text-sm tabular-nums group-hover:font-semibold transition-all">
                    {amount.toFixed(2)}
                  </td>
                  <td className="p-4 text-right font-mono text-xs text-muted-foreground tabular-nums">
                    {revenue > 0 ? ((amount / revenue) * 100).toFixed(1) : "0.0"}%
                  </td>
                </tr>
              ))}
              <tr className="bg-primary/10 border-t border-primary/30">
                <td className="p-4 text-right font-mono text-sm font-bold">Total Revenue:</td>
                <td className="p-4 text-right font-mono text-sm font-bold tabular-nums text-primary">
                  {revenue.toFixed(2)}
                </td>
                <td className="p-4 text-right font-mono text-xs font-semibold">100.0%</td>
              </tr>

              {/* COGS Section */}
              {cogsAccounts.size > 0 && (
                <>
                  <tr className="bg-muted/30 border-t-2 border-border">
                    <td colSpan={3} className="p-4 font-mono text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                      <div className="w-1 h-6 bg-muted-foreground rounded-full"></div>
                      Cost of Goods Sold
                    </td>
                  </tr>
                  {Array.from(cogsAccounts.entries()).map(([account, amount]) => (
                    <tr key={account} className="border-b border-border hover:bg-muted/20 transition-colors group">
                      <td className="p-4 pl-8 font-mono text-sm">{account}</td>
                      <td className="p-4 text-right font-mono text-sm tabular-nums group-hover:font-semibold transition-all">
                        ({amount.toFixed(2)})
                      </td>
                      <td className="p-4 text-right font-mono text-xs text-muted-foreground tabular-nums">
                        {revenue > 0 ? ((amount / revenue) * 100).toFixed(1) : "0.0"}%
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muted/20 border-t border-border">
                    <td className="p-4 text-right font-mono text-sm font-bold">Total COGS:</td>
                    <td className="p-4 text-right font-mono text-sm font-bold tabular-nums">
                      ({cogs.toFixed(2)})
                    </td>
                    <td className="p-4 text-right font-mono text-xs font-semibold">
                      {revenue > 0 ? ((cogs / revenue) * 100).toFixed(1) : "0.0"}%
                    </td>
                  </tr>
                  <tr className="bg-accent/10 border-t-2 border-accent/30">
                    <td className="p-4 text-right font-mono font-bold">Gross Profit:</td>
                    <td className="p-4 text-right font-mono font-bold tabular-nums text-accent">
                      {grossProfit.toFixed(2)}
                    </td>
                    <td className="p-4 text-right font-mono text-sm font-semibold">
                      {revenue > 0 ? ((grossProfit / revenue) * 100).toFixed(1) : "0.0"}%
                    </td>
                  </tr>
                </>
              )}

              {/* Expenses Section */}
              <tr className="bg-muted/30 border-t-2 border-border">
                <td colSpan={3} className="p-4 font-mono text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1 h-6 bg-muted-foreground rounded-full"></div>
                  Operating Expenses
                </td>
              </tr>
              {Array.from(expenseAccounts.entries()).map(([account, amount]) => (
                <tr key={account} className="border-b border-border hover:bg-muted/20 transition-colors group">
                  <td className="p-4 pl-8 font-mono text-sm">{account}</td>
                  <td className="p-4 text-right font-mono text-sm tabular-nums group-hover:font-semibold transition-all">
                    ({amount.toFixed(2)})
                  </td>
                  <td className="p-4 text-right font-mono text-xs text-muted-foreground tabular-nums">
                    {revenue > 0 ? ((amount / revenue) * 100).toFixed(1) : "0.0"}%
                  </td>
                </tr>
              ))}
              <tr className="bg-muted/20 border-t border-border">
                <td className="p-4 text-right font-mono text-sm font-bold">Total Operating Expenses:</td>
                <td className="p-4 text-right font-mono text-sm font-bold tabular-nums">
                  ({expenses.toFixed(2)})
                </td>
                <td className="p-4 text-right font-mono text-xs font-semibold">
                  {revenue > 0 ? ((expenses / revenue) * 100).toFixed(1) : "0.0"}%
                </td>
              </tr>

              {/* Net Income */}
              <tr className={`border-t-4 ${
                isProfitable ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"
              }`}>
                <td className="p-5 text-right font-mono text-lg font-bold flex items-center justify-end gap-2">
                  {isProfitable ? (
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                  Net Income:
                </td>
                <td className={`p-5 text-right font-mono text-xl font-bold tabular-nums ${
                  isProfitable ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}>
                  {netIncome.toFixed(2)}
                </td>
                <td className={`p-5 text-right font-mono text-base font-bold ${
                  isProfitable ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}>
                  {profitMargin.toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual Indicator */}
        <div className={`mt-6 p-4 rounded-lg border-2 text-center font-mono text-sm ${
          isProfitable 
            ? "border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-300" 
            : "border-red-500/30 bg-red-500/5 text-red-700 dark:text-red-300"
        }`}>
          {isProfitable 
            ? "✓ Profitable Period - Business is generating positive income"
            : "⚠ Loss Period - Expenses exceed revenue"}
        </div>
      </div>
    </div>
  );
};
