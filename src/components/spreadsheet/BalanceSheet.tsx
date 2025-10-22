import { ScrollArea } from "@/components/ui/scroll-area";
import type { JournalEntry } from "../SpreadsheetPanel";

interface BalanceSheetProps {
  journalEntries: JournalEntry[];
}

export const BalanceSheet = ({ journalEntries }: BalanceSheetProps) => {
  const categorizeAccount = (account: string) => {
    const lower = account.toLowerCase();
    if (lower.includes("asset") || lower.includes("cash") || lower.includes("receivable")) {
      return "asset";
    } else if (lower.includes("liability") || lower.includes("payable")) {
      return "liability";
    } else if (lower.includes("equity") || lower.includes("capital")) {
      return "equity";
    }
    return "other";
  };

  const assetAccounts = new Map<string, number>();
  const liabilityAccounts = new Map<string, number>();
  const equityAccounts = new Map<string, number>();

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
    <ScrollArea className="h-full">
      <div className="p-6 max-w-4xl">
        <h3 className="text-xl font-bold mb-6 text-center">Balance Sheet</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Assets */}
          <div>
            <table className="w-full border-collapse">
              <thead className="bg-gridHeader">
                <tr>
                  <th className="border border-gridBorder p-3 text-left text-sm font-semibold" colSpan={2}>
                    Assets
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from(assetAccounts.entries()).map(([account, amount]) => (
                  <tr key={account} className="hover:bg-gridHover transition-colors">
                    <td className="border border-gridBorder p-3 text-sm">{account}</td>
                    <td className="border border-gridBorder p-3 text-right text-sm">
                      {amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-primary/10 font-bold">
                  <td className="border border-gridBorder p-3 text-right">Total Assets:</td>
                  <td className="border border-gridBorder p-3 text-right">
                    {totalAssets.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Liabilities & Equity */}
          <div className="space-y-6">
            <table className="w-full border-collapse">
              <thead className="bg-gridHeader">
                <tr>
                  <th className="border border-gridBorder p-3 text-left text-sm font-semibold" colSpan={2}>
                    Liabilities
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from(liabilityAccounts.entries()).map(([account, amount]) => (
                  <tr key={account} className="hover:bg-gridHover transition-colors">
                    <td className="border border-gridBorder p-3 text-sm">{account}</td>
                    <td className="border border-gridBorder p-3 text-right text-sm">
                      {amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gridHeader font-semibold">
                  <td className="border border-gridBorder p-3 text-right">Total Liabilities:</td>
                  <td className="border border-gridBorder p-3 text-right">
                    {totalLiabilities.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="w-full border-collapse">
              <thead className="bg-gridHeader">
                <tr>
                  <th className="border border-gridBorder p-3 text-left text-sm font-semibold" colSpan={2}>
                    Equity
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from(equityAccounts.entries()).map(([account, amount]) => (
                  <tr key={account} className="hover:bg-gridHover transition-colors">
                    <td className="border border-gridBorder p-3 text-sm">{account}</td>
                    <td className="border border-gridBorder p-3 text-right text-sm">
                      {amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gridHeader font-semibold">
                  <td className="border border-gridBorder p-3 text-right">Total Equity:</td>
                  <td className="border border-gridBorder p-3 text-right">
                    {totalEquity.toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-primary/10 font-bold">
                  <td className="border border-gridBorder p-3 text-right">Total L + E:</td>
                  <td className="border border-gridBorder p-3 text-right">
                    {(totalLiabilities + totalEquity).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Accounting Equation Check */}
        <div className={`mt-6 p-4 rounded-lg text-center font-semibold ${
          Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01
            ? "bg-accent/10 text-credit"
            : "bg-destructive/10 text-destructive"
        }`}>
          Assets = Liabilities + Equity: {totalAssets.toFixed(2)} = {(totalLiabilities + totalEquity).toFixed(2)}
          {Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01 ? " ✓" : " ✗"}
        </div>
      </div>
    </ScrollArea>
  );
};
