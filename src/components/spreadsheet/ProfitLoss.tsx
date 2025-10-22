import type { JournalEntry } from "../SpreadsheetPanel";

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

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
          <div className="border-b border-border pb-4 mb-8">
            <h2 className="text-2xl font-mono font-bold tracking-tight">Profit & Loss Statement</h2>
            <p className="text-sm text-muted-foreground mt-1 font-mono">
              Income and expenses for the period
            </p>
          </div>
          
          <table className="w-full border-collapse">
            <thead className="border-b border-border">
              <tr>
                <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider">Account</th>
                <th className="p-3 text-right text-[10px] font-mono font-semibold uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-muted">
                <td colSpan={2} className="p-3 font-mono text-xs font-semibold uppercase tracking-wider">Revenue</td>
              </tr>
              {Array.from(revenueAccounts.entries()).map(([account, amount]) => (
                <tr key={account} className="border-b border-border hover:bg-gridHover transition-colors">
                  <td className="p-3 pl-8 font-mono text-sm">{account}</td>
                  <td className="p-3 text-right font-mono text-sm tabular-nums">
                    {amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="border-b border-foreground">
                <td className="p-3 text-right font-mono text-sm font-semibold">Total Revenue:</td>
                <td className="p-3 text-right font-mono text-sm font-semibold tabular-nums">
                  {revenue.toFixed(2)}
                </td>
              </tr>

              {cogsAccounts.size > 0 && (
                <>
                  <tr className="bg-muted">
                    <td colSpan={2} className="p-3 font-mono text-xs font-semibold uppercase tracking-wider">Cost of Goods Sold</td>
                  </tr>
                  {Array.from(cogsAccounts.entries()).map(([account, amount]) => (
                    <tr key={account} className="border-b border-border hover:bg-gridHover transition-colors">
                      <td className="p-3 pl-8 font-mono text-sm">{account}</td>
                      <td className="p-3 text-right font-mono text-sm tabular-nums">
                        {amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-b border-foreground">
                    <td className="p-3 text-right font-mono text-sm font-semibold">Total COGS:</td>
                    <td className="p-3 text-right font-mono text-sm font-semibold tabular-nums">
                      {cogs.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="p-3 text-right font-mono text-sm font-semibold">Gross Profit:</td>
                    <td className="p-3 text-right font-mono text-sm font-semibold tabular-nums">
                      {grossProfit.toFixed(2)}
                    </td>
                  </tr>
                </>
              )}

              <tr className="bg-muted">
                <td colSpan={2} className="p-3 font-mono text-xs font-semibold uppercase tracking-wider">Operating Expenses</td>
              </tr>
              {Array.from(expenseAccounts.entries()).map(([account, amount]) => (
                <tr key={account} className="border-b border-border hover:bg-gridHover transition-colors">
                  <td className="p-3 pl-8 font-mono text-sm">{account}</td>
                  <td className="p-3 text-right font-mono text-sm tabular-nums">
                    {amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="border-b border-foreground">
                <td className="p-3 text-right font-mono text-sm font-semibold">Total Operating Expenses:</td>
                <td className="p-3 text-right font-mono text-sm font-semibold tabular-nums">
                  {expenses.toFixed(2)}
                </td>
              </tr>

              <tr className="border-t-2 border-foreground bg-muted">
                <td className="p-4 text-right font-mono text-lg font-bold">Net Income:</td>
                <td className="p-4 text-right font-mono text-lg font-bold tabular-nums">
                  {netIncome.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };
