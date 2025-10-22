import { JournalEntry } from "@/components/SpreadsheetPanel";
import { OpeningBalanceEntry } from "@/components/spreadsheet/OpeningBalance";
import { KnowledgeEntry } from "@/components/spreadsheet/KnowledgeBase";
import { CHART_OF_ACCOUNTS } from "./chartOfAccounts";

export interface FinancialSummary {
  totalEntries: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  isBalanced: boolean;
  lastEntryDate: string | null;
  openingBalanceCount: number;
  isOpeningBalanced: boolean;
}

export interface AIContext {
  summary: FinancialSummary;
  currentView: string;
  viewData: string;
  recentEntries: JournalEntry[];
  knowledgeContext: string;
}

const calculateAccountBalance = (
  accountCode: string,
  journalEntries: JournalEntry[],
  openingBalances: OpeningBalanceEntry[]
): number => {
  const account = CHART_OF_ACCOUNTS.find(a => a.code === accountCode);
  if (!account) return 0;

  // Opening balance
  const openingBalance = openingBalances
    .filter(e => e.account.includes(accountCode))
    .reduce((sum, e) => sum + e.debit - e.credit, 0);

  // Journal entries
  const journalBalance = journalEntries
    .filter(e => e.account.includes(accountCode))
    .reduce((sum, e) => sum + e.debit - e.credit, 0);

  return openingBalance + journalBalance;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const generateFinancialContext = (
  journalEntries: JournalEntry[],
  openingBalances: OpeningBalanceEntry[],
  knowledgeEntries: KnowledgeEntry[],
  activeView: string
): AIContext => {
  // Calculate assets
  const assetAccounts = CHART_OF_ACCOUNTS.filter(a => a.type === "Asset" && !a.isParent);
  const totalAssets = assetAccounts.reduce((sum, account) => {
    return sum + calculateAccountBalance(account.code, journalEntries, openingBalances);
  }, 0);

  // Calculate liabilities
  const liabilityAccounts = CHART_OF_ACCOUNTS.filter(a => a.type === "Liability" && !a.isParent);
  const totalLiabilities = liabilityAccounts.reduce((sum, account) => {
    return sum + Math.abs(calculateAccountBalance(account.code, journalEntries, openingBalances));
  }, 0);

  // Calculate equity
  const equityAccounts = CHART_OF_ACCOUNTS.filter(a => a.type === "Equity" && !a.isParent);
  const totalEquity = equityAccounts.reduce((sum, account) => {
    return sum + Math.abs(calculateAccountBalance(account.code, journalEntries, openingBalances));
  }, 0);

  // Calculate revenue
  const revenueAccounts = CHART_OF_ACCOUNTS.filter(a => a.type === "Revenue" && !a.isParent);
  const totalRevenue = revenueAccounts.reduce((sum, account) => {
    return sum + Math.abs(calculateAccountBalance(account.code, journalEntries, openingBalances));
  }, 0);

  // Calculate expenses
  const expenseAccounts = CHART_OF_ACCOUNTS.filter(a => a.type === "Expense" && !a.isParent);
  const totalExpenses = expenseAccounts.reduce((sum, account) => {
    return sum + calculateAccountBalance(account.code, journalEntries, openingBalances);
  }, 0);

  const netIncome = totalRevenue - totalExpenses;

  // Check if books are balanced
  const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity + netIncome)) < 0.01;

  // Opening balance check
  const totalOpeningDebits = openingBalances.reduce((sum, e) => sum + e.debit, 0);
  const totalOpeningCredits = openingBalances.reduce((sum, e) => sum + e.credit, 0);
  const isOpeningBalanced = Math.abs(totalOpeningDebits - totalOpeningCredits) < 0.01;

  // Generate view-specific data
  let viewData = "";
  switch (activeView) {
    case "balance-sheet":
      viewData = `📊 BALANCE SHEET SUMMARY
      
Assets: ${formatCurrency(totalAssets)}
Liabilities: ${formatCurrency(totalLiabilities)}
Equity: ${formatCurrency(totalEquity)}
Net Income: ${formatCurrency(netIncome)}

Balance Check: ${isBalanced ? "✓ Balanced" : "✗ Not Balanced"}`;
      break;

    case "profit-loss":
      viewData = `💰 PROFIT & LOSS SUMMARY
      
Revenue: ${formatCurrency(totalRevenue)}
Expenses: ${formatCurrency(totalExpenses)}
Net Income: ${formatCurrency(netIncome)}

Profit Margin: ${totalRevenue > 0 ? ((netIncome / totalRevenue) * 100).toFixed(2) : 0}%`;
      break;

    case "trial-balance":
      const totalDebits = journalEntries.reduce((sum, e) => sum + e.debit, 0) + totalOpeningDebits;
      const totalCredits = journalEntries.reduce((sum, e) => sum + e.credit, 0) + totalOpeningCredits;
      viewData = `⚖️ TRIAL BALANCE SUMMARY
      
Total Debits: ${formatCurrency(totalDebits)}
Total Credits: ${formatCurrency(totalCredits)}
Difference: ${formatCurrency(Math.abs(totalDebits - totalCredits))}

Status: ${Math.abs(totalDebits - totalCredits) < 0.01 ? "✓ Balanced" : "✗ Unbalanced"}`;
      break;

    case "journal":
      viewData = `📝 JOURNAL ENTRIES SUMMARY
      
Total Entries: ${journalEntries.length}
Date Range: ${journalEntries.length > 0 ? `${journalEntries[0]?.date} to ${journalEntries[journalEntries.length - 1]?.date}` : "No entries"}

Recent entries available below`;
      break;

    case "opening":
      viewData = `🔢 OPENING BALANCES SUMMARY
      
Total Entries: ${openingBalances.length}
Total Debits: ${formatCurrency(totalOpeningDebits)}
Total Credits: ${formatCurrency(totalOpeningCredits)}
Difference: ${formatCurrency(Math.abs(totalOpeningDebits - totalOpeningCredits))}

Status: ${isOpeningBalanced ? "✓ Balanced" : "✗ Unbalanced"}`;
      break;

    case "knowledge":
      viewData = `📚 KNOWLEDGE BASE
      
Total Entries: ${knowledgeEntries.length}
Categories: ${[...new Set(knowledgeEntries.map(e => e.category))].join(", ") || "None"}`;
      break;

    default:
      viewData = `Current view: ${activeView}`;
  }

  // Knowledge base context
  const knowledgeContext = knowledgeEntries.length > 0 
    ? `\n\nKNOWLEDGE BASE:\n${knowledgeEntries.slice(0, 5).map(e => 
        `• ${e.title} (${e.category}): ${e.content.substring(0, 100)}...`
      ).join('\n')}`
    : "";

  return {
    summary: {
      totalEntries: journalEntries.length,
      totalAssets,
      totalLiabilities,
      totalEquity,
      totalRevenue,
      totalExpenses,
      netIncome,
      isBalanced,
      lastEntryDate: journalEntries.length > 0 ? journalEntries[journalEntries.length - 1]?.date : null,
      openingBalanceCount: openingBalances.length,
      isOpeningBalanced,
    },
    currentView: activeView,
    viewData,
    recentEntries: journalEntries.slice(-10),
    knowledgeContext,
  };
};
