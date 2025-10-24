import { JournalEntry } from "@/types";
import { 
  ReconciliationSession, 
  BankStatementEntry, 
  ReconciliationDiscrepancy 
} from "@/types/reconciliation";

/**
 * Generate a realistic bank reconciliation from actual journal entries
 * Uses the cash account transactions and adds realistic discrepancies
 */
export const generateRealisticReconciliation = (
  journalEntries: JournalEntry[],
  reconciliationDate: string = new Date().toISOString().split('T')[0]
): ReconciliationSession => {
  // Extract cash account transactions only
  const cashAccount = "1011 - Cash";
  const cashTransactions = journalEntries
    .filter(entry => entry.account === cashAccount)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate starting balance (from opening balance or first entry)
  let runningBalance = 95000; // Opening balance from demo
  
  // Generate bank statement entries from cash transactions
  // Exclude the last 2-3 transactions to simulate timing differences
  const bankStatementEntries: BankStatementEntry[] = [];
  const excludeLastN = 2; // Create outstanding items
  const transactionsToInclude = cashTransactions.slice(0, -excludeLastN);
  
  transactionsToInclude.forEach((entry, index) => {
    const isDebit = entry.debit > 0;
    const amount = isDebit ? entry.debit : entry.credit;
    
    runningBalance += isDebit ? amount : -amount;
    
    bankStatementEntries.push({
      id: `bank-${index + 1}`,
      date: entry.date,
      description: entry.description,
      reference: entry.reference,
      withdrawal: isDebit ? 0 : amount,
      deposit: isDebit ? amount : 0,
      balance: runningBalance,
      type: isDebit ? 'deposit' : 'withdrawal',
      isCleared: false
    });
  });

  // Add realistic bank-initiated items not in books yet
  const bankFees: BankStatementEntry[] = [
    {
      id: 'bank-fee-1',
      date: reconciliationDate,
      description: 'Monthly Account Maintenance Fee',
      reference: 'FEE-001',
      withdrawal: 35,
      deposit: 0,
      balance: runningBalance - 35,
      type: 'fee',
      isCleared: false
    },
    {
      id: 'bank-fee-2',
      date: reconciliationDate,
      description: 'Wire Transfer Fee',
      reference: 'FEE-002',
      withdrawal: 25,
      deposit: 0,
      balance: runningBalance - 60,
      type: 'fee',
      isCleared: false
    },
    {
      id: 'bank-interest',
      date: reconciliationDate,
      description: 'Interest Income',
      reference: 'INT-001',
      withdrawal: 0,
      deposit: 30,
      balance: runningBalance - 30,
      type: 'interest',
      isCleared: false
    }
  ];

  runningBalance = runningBalance - 60 + 30;
  bankStatementEntries.push(...bankFees);

  // Add NSF check scenario if there are any large deposits
  const largeDeposits = cashTransactions.filter(e => e.debit > 10000);
  if (largeDeposits.length > 0) {
    const nsfCheck = largeDeposits[0];
    bankStatementEntries.push({
      id: 'bank-nsf',
      date: reconciliationDate,
      description: `NSF Return - ${nsfCheck.description}`,
      reference: 'NSF-001',
      withdrawal: 1200,
      deposit: 0,
      balance: runningBalance - 1200,
      type: 'fee',
      isCleared: false
    });
    bankStatementEntries.push({
      id: 'bank-nsf-fee',
      date: reconciliationDate,
      description: 'NSF Fee',
      reference: 'FEE-NSF',
      withdrawal: 35,
      deposit: 0,
      balance: runningBalance - 1235,
      type: 'fee',
      isCleared: false
    });
    runningBalance -= 1235;
  }

  // Calculate book balance
  const bookBalance = cashTransactions.reduce((balance, entry) => {
    return balance + (entry.debit > 0 ? entry.debit : -entry.credit);
  }, 95000);

  // Generate discrepancies
  const discrepancies: ReconciliationDiscrepancy[] = [];
  
  // Outstanding checks (last 2 withdrawals not in bank statement)
  const outstandingChecks = cashTransactions
    .slice(-excludeLastN)
    .filter(e => e.credit > 0);
  
  outstandingChecks.forEach((check, index) => {
    discrepancies.push({
      id: `disc-outstanding-${index + 1}`,
      type: 'outstanding_check',
      amount: check.credit,
      description: check.description,
      reference: check.reference,
      needsAdjustment: false
    });
  });

  // Bank fees (need adjustment entries)
  discrepancies.push(
    {
      id: 'disc-fee-1',
      type: 'bank_fee',
      amount: 35,
      description: 'Monthly Account Maintenance Fee',
      reference: 'FEE-001',
      needsAdjustment: true
    },
    {
      id: 'disc-fee-2',
      type: 'bank_fee',
      amount: 25,
      description: 'Wire Transfer Fee',
      reference: 'FEE-002',
      needsAdjustment: true
    },
    {
      id: 'disc-interest',
      type: 'interest',
      amount: 30,
      description: 'Interest Income',
      reference: 'INT-001',
      needsAdjustment: true
    }
  );

  // NSF check if applicable
  if (largeDeposits.length > 0) {
    discrepancies.push(
      {
        id: 'disc-nsf',
        type: 'nsf_check',
        amount: 1200,
        description: 'Customer check returned - insufficient funds',
        reference: 'NSF-001',
        needsAdjustment: true
      },
      {
        id: 'disc-nsf-fee',
        type: 'bank_fee',
        amount: 35,
        description: 'NSF Fee',
        reference: 'FEE-NSF',
        needsAdjustment: true
      }
    );
  }

  // Calculate month and year from reconciliation date
  const reconDate = new Date(reconciliationDate);
  const month = reconDate.toLocaleString('en-US', { month: 'long' });
  const year = reconDate.getFullYear().toString();

  return {
    id: 'realistic-recon-1',
    date: reconciliationDate,
    month,
    year,
    startingBalance: 95000,
    endingBalance: runningBalance,
    bankStatementEntries,
    matches: [],
    status: 'in-progress',
    discrepancies,
    notes: `Bank reconciliation for ${month} ${year}. Outstanding items identified. Bank fees and interest require adjustment entries.`,
    createdAt: new Date().toISOString()
  };
};
