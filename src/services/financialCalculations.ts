import { JournalEntry, OpeningBalanceEntry } from "@/types";
import { CHART_OF_ACCOUNTS } from "@/utils/chartOfAccounts";

/**
 * Calculate account balance from journal entries and opening balances
 */
export const calculateAccountBalance = (
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

/**
 * Calculate total assets
 */
export const calculateTotalAssets = (
  journalEntries: JournalEntry[],
  openingBalances: OpeningBalanceEntry[]
): number => {
  const assetAccounts = CHART_OF_ACCOUNTS.filter(a => a.type === "Asset" && !a.isParent);
  return assetAccounts.reduce((sum, account) => {
    return sum + calculateAccountBalance(account.code, journalEntries, openingBalances);
  }, 0);
};

/**
 * Calculate total liabilities
 */
export const calculateTotalLiabilities = (
  journalEntries: JournalEntry[],
  openingBalances: OpeningBalanceEntry[]
): number => {
  const liabilityAccounts = CHART_OF_ACCOUNTS.filter(a => a.type === "Liability" && !a.isParent);
  return liabilityAccounts.reduce((sum, account) => {
    return sum + Math.abs(calculateAccountBalance(account.code, journalEntries, openingBalances));
  }, 0);
};

/**
 * Calculate total equity
 */
export const calculateTotalEquity = (
  journalEntries: JournalEntry[],
  openingBalances: OpeningBalanceEntry[]
): number => {
  const equityAccounts = CHART_OF_ACCOUNTS.filter(a => a.type === "Equity" && !a.isParent);
  return equityAccounts.reduce((sum, account) => {
    return sum + Math.abs(calculateAccountBalance(account.code, journalEntries, openingBalances));
  }, 0);
};

/**
 * Calculate total revenue
 */
export const calculateTotalRevenue = (
  journalEntries: JournalEntry[],
  openingBalances: OpeningBalanceEntry[]
): number => {
  const revenueAccounts = CHART_OF_ACCOUNTS.filter(a => a.type === "Revenue" && !a.isParent);
  return revenueAccounts.reduce((sum, account) => {
    return sum + Math.abs(calculateAccountBalance(account.code, journalEntries, openingBalances));
  }, 0);
};

/**
 * Calculate total expenses
 */
export const calculateTotalExpenses = (
  journalEntries: JournalEntry[],
  openingBalances: OpeningBalanceEntry[]
): number => {
  const expenseAccounts = CHART_OF_ACCOUNTS.filter(a => a.type === "Expense" && !a.isParent);
  return expenseAccounts.reduce((sum, account) => {
    return sum + calculateAccountBalance(account.code, journalEntries, openingBalances);
  }, 0);
};

/**
 * Check if books are balanced
 */
export const checkBooksBalanced = (
  totalAssets: number,
  totalLiabilities: number,
  totalEquity: number,
  netIncome: number
): boolean => {
  return Math.abs(totalAssets - (totalLiabilities + totalEquity + netIncome)) < 0.01;
};

/**
 * Check if opening balances are balanced
 */
export const checkOpeningBalanced = (openingBalances: OpeningBalanceEntry[]): boolean => {
  const totalDebits = openingBalances.reduce((sum, e) => sum + e.debit, 0);
  const totalCredits = openingBalances.reduce((sum, e) => sum + e.credit, 0);
  return Math.abs(totalDebits - totalCredits) < 0.01;
};

/**
 * Check if journal entries are balanced
 */
export const checkJournalBalanced = (journalEntries: JournalEntry[]): boolean => {
  const totalDebits = journalEntries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredits = journalEntries.reduce((sum, e) => sum + e.credit, 0);
  return Math.abs(totalDebits - totalCredits) < 0.01;
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
