import { ScrollArea } from "@/components/ui/scroll-area";
import type { JournalEntry } from "../SpreadsheetPanel";

interface ProfitLossProps {
  journalEntries: JournalEntry[];
}

export const ProfitLoss = ({ journalEntries }: ProfitLossProps) => {
  // Calculate P&L from journal entries
  const revenue = journalEntries
    .filter((e) => e.account.toLowerCase().includes("revenue") || e.account.toLowerCase().includes("income"))
    .reduce((sum, e) => sum + e.credit - e.debit, 0);

  const expenses = journalEntries
    .filter((e) => e.account.toLowerCase().includes("expense") || e.account.toLowerCase().includes("cost"))
    .reduce((sum, e) => sum + e.debit - e.credit, 0);

  const netIncome = revenue - expenses;

  const revenueAccounts = new Map<string, number>();
  const expenseAccounts = new Map<string, number>();

  journalEntries.forEach((entry) => {
    const lower = entry.account.toLowerCase();
    if (lower.includes("revenue") || lower.includes("income")) {
      const current = revenueAccounts.get(entry.account) || 0;
      revenueAccounts.set(entry.account, current + entry.credit - entry.debit);
    } else if (lower.includes("expense") || lower.includes("cost")) {
      const current = expenseAccounts.get(entry.account) || 0;
      expenseAccounts.set(entry.account, current + entry.debit - entry.credit);
    }
  });

  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-4xl">
        <h3 className="text-xl font-bold mb-6 text-center">Profit & Loss Statement</h3>
        
        <table className="w-full border-collapse mb-6">
          <thead className="bg-gridHeader">
            <tr>
              <th className="border border-gridBorder p-3 text-left text-sm font-semibold">Account</th>
              <th className="border border-gridBorder p-3 text-right text-sm font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-accent/5">
              <td colSpan={2} className="border border-gridBorder p-2 font-semibold">Revenue</td>
            </tr>
            {Array.from(revenueAccounts.entries()).map(([account, amount]) => (
              <tr key={account} className="hover:bg-gridHover transition-colors">
                <td className="border border-gridBorder p-3 pl-6 text-sm">{account}</td>
                <td className="border border-gridBorder p-3 text-right text-sm text-credit">
                  {amount.toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="bg-gridHeader font-semibold">
              <td className="border border-gridBorder p-3 text-right">Total Revenue:</td>
              <td className="border border-gridBorder p-3 text-right text-credit">
                {revenue.toFixed(2)}
              </td>
            </tr>

            <tr className="bg-destructive/5">
              <td colSpan={2} className="border border-gridBorder p-2 font-semibold">Expenses</td>
            </tr>
            {Array.from(expenseAccounts.entries()).map(([account, amount]) => (
              <tr key={account} className="hover:bg-gridHover transition-colors">
                <td className="border border-gridBorder p-3 pl-6 text-sm">{account}</td>
                <td className="border border-gridBorder p-3 text-right text-sm text-debit">
                  {amount.toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="bg-gridHeader font-semibold">
              <td className="border border-gridBorder p-3 text-right">Total Expenses:</td>
              <td className="border border-gridBorder p-3 text-right text-debit">
                {expenses.toFixed(2)}
              </td>
            </tr>

            <tr className="bg-primary/10">
              <td className="border border-gridBorder p-4 text-right font-bold text-lg">Net Income:</td>
              <td className={`border border-gridBorder p-4 text-right font-bold text-lg ${
                netIncome >= 0 ? "text-credit" : "text-debit"
              }`}>
                {netIncome.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ScrollArea>
  );
};
