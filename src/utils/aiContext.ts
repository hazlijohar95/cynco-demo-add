import { JournalEntry, OpeningBalanceEntry, KnowledgeEntry, FinancialSummary, AIContext } from "@/types";
import { 
  calculateTotalAssets, 
  calculateTotalLiabilities, 
  calculateTotalEquity, 
  calculateTotalRevenue, 
  calculateTotalExpenses,
  checkBooksBalanced,
  checkOpeningBalanced,
  formatCurrency
} from "@/services/financialCalculations";

export const generateFinancialContext = (
  journalEntries: JournalEntry[],
  openingBalances: OpeningBalanceEntry[],
  knowledgeEntries: KnowledgeEntry[],
  activeView: string
): AIContext => {
  // Calculate financial totals using centralized service
  const totalAssets = calculateTotalAssets(journalEntries, openingBalances);
  const totalLiabilities = calculateTotalLiabilities(journalEntries, openingBalances);
  const totalEquity = calculateTotalEquity(journalEntries, openingBalances);
  const totalRevenue = calculateTotalRevenue(journalEntries, openingBalances);
  const totalExpenses = calculateTotalExpenses(journalEntries, openingBalances);
  const netIncome = totalRevenue - totalExpenses;

  // Check if books are balanced
  const isBalanced = checkBooksBalanced(totalAssets, totalLiabilities, totalEquity, netIncome);

  // Opening balance check
  const totalOpeningDebits = openingBalances.reduce((sum, e) => sum + e.debit, 0);
  const totalOpeningCredits = openingBalances.reduce((sum, e) => sum + e.credit, 0);
  const isOpeningBalanced = checkOpeningBalanced(openingBalances);

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
