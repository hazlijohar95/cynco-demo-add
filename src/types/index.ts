// Centralized type definitions

export interface JournalEntry {
  id: string;
  date: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
  reference: string;
}

export interface OpeningBalanceEntry {
  id: string;
  account: string;
  debit: number;
  credit: number;
  date: string;
}

export interface KnowledgeEntry {
  id: string;
  category: string;
  title: string;
  content: string;
  type: 'text' | 'link' | 'document';
  url?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

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

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface AIToolExecutionResult {
  success: boolean;
  message: string;
  viewToSwitch?: string;
}

// Re-export reconciliation types
export * from './reconciliation';
