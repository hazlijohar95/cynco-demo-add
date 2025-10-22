import type { JournalEntry } from "../SpreadsheetPanel";

interface ChartOfAccountsProps {
  journalEntries: JournalEntry[];
}

export const ChartOfAccounts = ({ journalEntries }: ChartOfAccountsProps) => {
  // Extract unique accounts from journal entries
  const accountsMap = new Map<string, { type: string; balance: number }>();

  journalEntries.forEach((entry) => {
    if (!accountsMap.has(entry.account)) {
      // Categorize account type
      const lower = entry.account.toLowerCase();
      let type = "Asset";
      if (lower.includes("revenue") || lower.includes("income")) {
        type = "Revenue";
      } else if (lower.includes("expense") || lower.includes("cost")) {
        type = "Expense";
      } else if (lower.includes("liability") || lower.includes("payable")) {
        type = "Liability";
      } else if (lower.includes("equity") || lower.includes("capital")) {
        type = "Equity";
      }
      accountsMap.set(entry.account, { type, balance: 0 });
    }

    const account = accountsMap.get(entry.account)!;
    account.balance += entry.debit - entry.credit;
  });

  // Sort accounts by type
  const sortedAccounts = Array.from(accountsMap.entries()).sort((a, b) => {
    const typeOrder = ["Asset", "Liability", "Equity", "Revenue", "Expense"];
    const typeA = typeOrder.indexOf(a[1].type);
    const typeB = typeOrder.indexOf(b[1].type);
    return typeA - typeB;
  });

  // Group by type
  const accountsByType = sortedAccounts.reduce((acc, [name, data]) => {
    if (!acc[data.type]) {
      acc[data.type] = [];
    }
    acc[data.type].push({ name, ...data });
    return acc;
  }, {} as Record<string, Array<{ name: string; type: string; balance: number }>>);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b border-border pb-4">
          <h2 className="text-2xl font-mono font-bold tracking-tight">Chart of Accounts</h2>
          <p className="text-sm text-muted-foreground mt-1 font-mono">
            Complete listing of all accounts in the system
          </p>
        </div>

        {Object.entries(accountsByType).map(([type, accounts]) => (
          <div key={type} className="space-y-2">
            <h3 className="text-sm font-mono font-semibold uppercase tracking-wider border-b border-border pb-2">
              {type}
            </h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-mono text-xs font-semibold uppercase tracking-wider">
                    Account Name
                  </th>
                  <th className="text-right py-2 font-mono text-xs font-semibold uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr
                    key={account.name}
                    className="border-b border-border hover:bg-gridHover transition-colors"
                  >
                    <td className="py-3 font-mono text-sm">{account.name}</td>
                    <td className="py-3 font-mono text-sm text-right tabular-nums">
                      {account.balance.toFixed(2)}
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
