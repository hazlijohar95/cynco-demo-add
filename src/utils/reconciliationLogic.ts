import { JournalEntry } from "@/types";
import { 
  BankStatementEntry, 
  ReconciliationMatch, 
  ReconciliationDiscrepancy,
  ReconciliationSummary 
} from "@/types/reconciliation";

/**
 * Calculate book balance from journal entries for cash account
 */
export const calculateBookBalance = (journalEntries: JournalEntry[]): number => {
  const cashEntries = journalEntries.filter(entry => entry.account === "1011 - Cash");
  return cashEntries.reduce((sum, entry) => sum + entry.debit - entry.credit, 0);
};

/**
 * Auto-match bank statement entries with journal entries
 * Returns suggested matches based on amount, date, and reference
 */
export const autoMatchTransactions = (
  bankEntries: BankStatementEntry[],
  journalEntries: JournalEntry[],
  existingMatches: ReconciliationMatch[]
): ReconciliationMatch[] => {
  const matchedBankIds = new Set(existingMatches.map(m => m.bankEntryId));
  const matchedJournalIds = new Set(existingMatches.map(m => m.journalEntryId));
  
  const cashEntries = journalEntries.filter(
    entry => entry.account === "1011 - Cash" && !matchedJournalIds.has(entry.id)
  );
  
  const newMatches: ReconciliationMatch[] = [];
  
  bankEntries.forEach(bankEntry => {
    if (matchedBankIds.has(bankEntry.id)) return;
    
    const bankAmount = bankEntry.deposit > 0 ? bankEntry.deposit : bankEntry.withdrawal;
    
    cashEntries.forEach(journalEntry => {
      if (matchedJournalIds.has(journalEntry.id)) return;
      
      // Deposits increase cash (debit), withdrawals decrease cash (credit)
      const journalAmount = bankEntry.deposit > 0 ? journalEntry.debit : journalEntry.credit;
      
      let confidence = 0;
      
      // Exact amount match
      if (Math.abs(bankAmount - journalAmount) < 0.01) {
        confidence += 50;
      }
      
      // Date proximity (within 3 days)
      const daysDiff = Math.abs(
        new Date(bankEntry.date).getTime() - new Date(journalEntry.date).getTime()
      ) / (1000 * 60 * 60 * 24);
      
      if (daysDiff <= 1) confidence += 30;
      else if (daysDiff <= 3) confidence += 15;
      
      // Reference match
      if (bankEntry.reference && journalEntry.reference && 
          bankEntry.reference.toLowerCase().includes(journalEntry.reference.toLowerCase())) {
        confidence += 20;
      }
      
      // Suggest match if confidence >= 80%
      if (confidence >= 80) {
        newMatches.push({
          id: `match-${Date.now()}-${Math.random()}`,
          bankEntryId: bankEntry.id,
          journalEntryId: journalEntry.id,
          matchDate: new Date().toISOString(),
          matchType: confidence === 100 ? 'exact' : 'suggested',
          confidence
        });
        
        matchedBankIds.add(bankEntry.id);
        matchedJournalIds.add(journalEntry.id);
      }
    });
  });
  
  return newMatches;
};

/**
 * Identify discrepancies between book and bank
 */
export const identifyDiscrepancies = (
  bankEntries: BankStatementEntry[],
  journalEntries: JournalEntry[],
  matches: ReconciliationMatch[]
): ReconciliationDiscrepancy[] => {
  const discrepancies: ReconciliationDiscrepancy[] = [];
  const matchedBankIds = new Set(matches.map(m => m.bankEntryId));
  const matchedJournalIds = new Set(matches.map(m => m.journalEntryId));
  
  // Outstanding checks (in journal, not in bank statement)
  const cashEntries = journalEntries.filter(entry => entry.account === "1011 - Cash");
  cashEntries.forEach(entry => {
    if (!matchedJournalIds.has(entry.id) && entry.credit > 0) {
      discrepancies.push({
        id: `disc-${entry.id}`,
        type: 'outstanding_check',
        amount: entry.credit,
        description: entry.description,
        reference: entry.reference,
        needsAdjustment: false
      });
    }
  });
  
  // Deposits in transit (in journal, not in bank statement)
  cashEntries.forEach(entry => {
    if (!matchedJournalIds.has(entry.id) && entry.debit > 0) {
      discrepancies.push({
        id: `disc-${entry.id}`,
        type: 'deposit_in_transit',
        amount: entry.debit,
        description: entry.description,
        reference: entry.reference,
        needsAdjustment: false
      });
    }
  });
  
  // Bank fees, interest, NSF (in bank statement, not in journal)
  bankEntries.forEach(entry => {
    if (!matchedBankIds.has(entry.id)) {
      let type: ReconciliationDiscrepancy['type'] = 'bank_fee';
      let needsAdjustment = true;
      
      if (entry.type === 'fee') type = 'bank_fee';
      else if (entry.type === 'interest') type = 'interest';
      else if (entry.description.toLowerCase().includes('nsf') || 
               entry.description.toLowerCase().includes('returned')) {
        type = 'nsf_check';
      }
      
      discrepancies.push({
        id: `disc-${entry.id}`,
        type,
        amount: entry.withdrawal > 0 ? entry.withdrawal : entry.deposit,
        description: entry.description,
        reference: entry.reference,
        needsAdjustment
      });
    }
  });
  
  return discrepancies;
};

/**
 * Calculate reconciliation summary
 */
export const calculateReconciliationSummary = (
  bookBalance: number,
  bankStatementBalance: number,
  discrepancies: ReconciliationDiscrepancy[]
): ReconciliationSummary => {
  let outstandingChecks = 0;
  let depositsInTransit = 0;
  let bankAdjustments = 0;
  let bookAdjustments = 0;
  
  discrepancies.forEach(disc => {
    switch (disc.type) {
      case 'outstanding_check':
        outstandingChecks += disc.amount;
        break;
      case 'deposit_in_transit':
        depositsInTransit += disc.amount;
        break;
      case 'bank_fee':
      case 'nsf_check':
        bankAdjustments -= disc.amount;
        break;
      case 'interest':
        bankAdjustments += disc.amount;
        break;
    }
  });
  
  const adjustedBookBalance = bookBalance + depositsInTransit - outstandingChecks + bankAdjustments;
  const adjustedBankBalance = bankStatementBalance + depositsInTransit - outstandingChecks + bookAdjustments;
  const difference = Math.abs(adjustedBookBalance - adjustedBankBalance);
  const isBalanced = difference < 0.01;
  
  return {
    bookBalance,
    bankBalance: bankStatementBalance,
    outstandingChecks,
    depositsInTransit,
    bankAdjustments,
    bookAdjustments,
    adjustedBookBalance,
    adjustedBankBalance,
    difference,
    isBalanced
  };
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
