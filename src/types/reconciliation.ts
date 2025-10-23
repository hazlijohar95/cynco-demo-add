// Bank Reconciliation type definitions

export interface BankStatementEntry {
  id: string;
  date: string;
  description: string;
  reference: string;
  withdrawal: number;
  deposit: number;
  balance: number;
  type: 'deposit' | 'withdrawal' | 'fee' | 'interest';
  isCleared: boolean;
}

export interface ReconciliationMatch {
  id: string;
  bankEntryId: string;
  journalEntryId: string;
  matchDate: string;
  matchType: 'exact' | 'manual' | 'suggested';
  confidence: number; // 0-100
}

export interface ReconciliationDiscrepancy {
  id: string;
  type: 'outstanding_check' | 'deposit_in_transit' | 'bank_error' | 'book_error' | 'bank_fee' | 'nsf_check' | 'interest';
  amount: number;
  description: string;
  reference: string;
  needsAdjustment: boolean;
  adjustmentJournalEntryId?: string;
}

export interface ReconciliationSession {
  id: string;
  date: string;
  month: string;
  year: string;
  startingBalance: number;
  endingBalance: number;
  bankStatementEntries: BankStatementEntry[];
  matches: ReconciliationMatch[];
  status: 'in-progress' | 'completed' | 'approved';
  discrepancies: ReconciliationDiscrepancy[];
  notes: string;
  createdAt: string;
  completedAt?: string;
}

export interface ReconciliationSummary {
  bookBalance: number;
  bankBalance: number;
  outstandingChecks: number;
  depositsInTransit: number;
  bankAdjustments: number;
  bookAdjustments: number;
  adjustedBookBalance: number;
  adjustedBankBalance: number;
  difference: number;
  isBalanced: boolean;
}

export type DemoCaseType = 
  | 'perfect'
  | 'outstanding_checks'
  | 'deposits_in_transit'
  | 'bank_fees'
  | 'nsf_check'
  | 'bank_error'
  | 'complex';

export interface DemoCase {
  id: DemoCaseType;
  name: string;
  description: string;
  learningObjective: string;
  session: ReconciliationSession;
}
