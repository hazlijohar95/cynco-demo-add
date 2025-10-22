import type { JournalEntry } from "../SpreadsheetPanel";
import { CHART_OF_ACCOUNTS, getSubAccounts, COAAccount } from "@/utils/chartOfAccounts";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/ui/info-tooltip";

interface ChartOfAccountsProps {
  journalEntries: JournalEntry[];
}

export const ChartOfAccounts = ({ journalEntries }: ChartOfAccountsProps) => {
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set(["1000", "2000", "3000", "4000", "5000", "6000", "7000"]));

  // Calculate balances for each account from journal entries
  const calculateBalance = (accountCode: string, accountName: string): number => {
    let balance = 0;
    journalEntries.forEach((entry) => {
      // Match by code or name
      if (entry.account.startsWith(accountCode) || entry.account.includes(accountName)) {
        balance += entry.debit - entry.credit;
      }
    });
    return balance;
  };

  const toggleExpand = (code: string) => {
    setExpandedAccounts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      return newSet;
    });
  };

  const renderAccount = (account: COAAccount, level: number = 0) => {
    const isExpanded = expandedAccounts.has(account.code);
    const hasChildren = account.isParent && getSubAccounts(account.code).length > 0;
    const balance = calculateBalance(account.code, account.name);
    const indentClass = `pl-${level * 4}`;

    return (
      <div key={account.code}>
        <div 
          className={`grid grid-cols-[40px_80px_1fr_120px] gap-4 py-2 border-b border-border hover:bg-gridHover transition-colors ${
            account.isParent ? 'font-semibold' : ''
          }`}
          style={{ paddingLeft: `${level * 1.5}rem` }}
        >
          <div className="flex items-center">
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(account.code)}
                className="hover:bg-muted rounded p-0.5"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
            ) : (
              <div className="w-4" />
            )}
          </div>
          <div className="font-mono text-xs">{account.code}</div>
          <div className="font-mono text-xs">{account.name}</div>
          <div className="font-mono text-xs text-right tabular-nums">
            {!account.isParent && balance !== 0 ? balance.toFixed(2) : '—'}
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {getSubAccounts(account.code).map(subAccount => 
              renderAccount(subAccount, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  // Get top-level accounts (Assets, Liabilities, Equity, Revenue, Expenses)
  const topLevelAccounts = CHART_OF_ACCOUNTS.filter(acc => !acc.parentCode);

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader 
          title="Chart of Accounts"
          description="Standard accounting structure with hierarchical codes. All accounts are organized by type: Assets (1000-1999), Liabilities (2000-2999), Equity (3000-3999), Revenue (4000-4999), COGS (5000-5999), Expenses (6000-6999), Other (7000-7999)."
        />

        <div className="border border-border">
          {/* Header */}
          <div className="grid grid-cols-[40px_80px_1fr_120px] gap-4 bg-gridHeader p-3 border-b border-border font-semibold">
            <div></div>
            <div className="font-mono text-[10px] uppercase tracking-wider">Code</div>
            <div className="font-mono text-[10px] uppercase tracking-wider">Account Name</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-right">Balance</div>
          </div>

          {/* Account Tree */}
          <div>
            {topLevelAccounts.map(account => renderAccount(account, 0))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-muted/30 border border-border">
          <h3 className="font-mono text-xs font-semibold mb-2">Account Code Structure</h3>
          <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
            <div><span className="font-semibold">1000-1999:</span> Assets</div>
            <div><span className="font-semibold">2000-2999:</span> Liabilities</div>
            <div><span className="font-semibold">3000-3999:</span> Equity</div>
            <div><span className="font-semibold">4000-4999:</span> Revenue</div>
            <div><span className="font-semibold">5000-5999:</span> Cost of Goods Sold</div>
            <div><span className="font-semibold">6000-6999:</span> Operating Expenses</div>
            <div><span className="font-semibold">7000-7999:</span> Other Income/Expenses</div>
          </div>
        </div>
      </div>
    </div>
  );
};
