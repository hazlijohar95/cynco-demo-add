import { DemoCase, ReconciliationSession, BankStatementEntry, ReconciliationMatch } from "@/types/reconciliation";
import { JournalEntry } from "@/types";

/**
 * Generate demo cases for bank reconciliation
 */
export const generateDemoCases = (): DemoCase[] => {
  return [
    generateCase1_Perfect(),
    generateCase2_OutstandingChecks(),
    generateCase3_DepositsInTransit(),
    generateCase4_BankFees(),
    generateCase5_NSFCheck(),
    generateCase6_BankError(),
    generateCase7_Complex()
  ];
};

// Case 1: Perfect Reconciliation
function generateCase1_Perfect(): DemoCase {
  const session: ReconciliationSession = {
    id: 'demo-case-1',
    date: '2024-03-31',
    month: 'March',
    year: '2024',
    startingBalance: 10000,
    endingBalance: 12500,
    bankStatementEntries: [
      {
        id: 'bank-1-1',
        date: '2024-03-05',
        description: 'Customer Payment - Invoice 1001',
        reference: 'DEP001',
        withdrawal: 0,
        deposit: 1500,
        balance: 11500,
        type: 'deposit',
        isCleared: false
      },
      {
        id: 'bank-1-2',
        date: '2024-03-10',
        description: 'Check #1001 - Office Supplies',
        reference: 'CHK1001',
        withdrawal: 500,
        deposit: 0,
        balance: 11000,
        type: 'withdrawal',
        isCleared: false
      },
      {
        id: 'bank-1-3',
        date: '2024-03-15',
        description: 'Customer Payment - Invoice 1002',
        reference: 'DEP002',
        withdrawal: 0,
        deposit: 2000,
        balance: 13000,
        type: 'deposit',
        isCleared: false
      },
      {
        id: 'bank-1-4',
        date: '2024-03-20',
        description: 'Check #1002 - Rent Payment',
        reference: 'CHK1002',
        withdrawal: 1200,
        deposit: 0,
        balance: 11800,
        type: 'withdrawal',
        isCleared: false
      },
      {
        id: 'bank-1-5',
        date: '2024-03-25',
        description: 'Customer Payment - Invoice 1003',
        reference: 'DEP003',
        withdrawal: 0,
        deposit: 700,
        balance: 12500,
        type: 'deposit',
        isCleared: false
      }
    ],
    matches: [],
    status: 'in-progress',
    discrepancies: [],
    notes: '',
    createdAt: new Date().toISOString()
  };

  return {
    id: 'perfect',
    name: 'Case 1: Perfect Reconciliation',
    description: 'All transactions match perfectly between books and bank statement.',
    learningObjective: 'Learn the basic reconciliation process when everything matches.',
    session
  };
}

// Case 2: Outstanding Checks
function generateCase2_OutstandingChecks(): DemoCase {
  const session: ReconciliationSession = {
    id: 'demo-case-2',
    date: '2024-03-31',
    month: 'March',
    year: '2024',
    startingBalance: 15000,
    endingBalance: 14300,
    bankStatementEntries: [
      {
        id: 'bank-2-1',
        date: '2024-03-10',
        description: 'Customer Payment',
        reference: 'DEP001',
        withdrawal: 0,
        deposit: 2000,
        balance: 17000,
        type: 'deposit',
        isCleared: false
      },
      {
        id: 'bank-2-2',
        date: '2024-03-15',
        description: 'Check #2001 - Utilities',
        reference: 'CHK2001',
        withdrawal: 300,
        deposit: 0,
        balance: 16700,
        type: 'withdrawal',
        isCleared: false
      },
      {
        id: 'bank-2-3',
        date: '2024-03-20',
        description: 'Check #2002 - Insurance',
        reference: 'CHK2002',
        withdrawal: 900,
        deposit: 0,
        balance: 15800,
        type: 'withdrawal',
        isCleared: false
      },
      {
        id: 'bank-2-4',
        date: '2024-03-25',
        description: 'Check #2003 - Supplies',
        reference: 'CHK2003',
        withdrawal: 1500,
        deposit: 0,
        balance: 14300,
        type: 'withdrawal',
        isCleared: false
      }
    ],
    matches: [],
    status: 'in-progress',
    discrepancies: [],
    notes: 'Checks #2004 and #2005 written but not yet cleared.',
    createdAt: new Date().toISOString()
  };

  return {
    id: 'outstanding_checks',
    name: 'Case 2: Outstanding Checks',
    description: 'Company wrote checks that haven\'t cleared the bank yet.',
    learningObjective: 'Understand timing differences - outstanding checks reduce book balance but not bank balance yet.',
    session
  };
}

// Case 3: Deposits in Transit
function generateCase3_DepositsInTransit(): DemoCase {
  const session: ReconciliationSession = {
    id: 'demo-case-3',
    date: '2024-03-31',
    month: 'March',
    year: '2024',
    startingBalance: 8000,
    endingBalance: 9500,
    bankStatementEntries: [
      {
        id: 'bank-3-1',
        date: '2024-03-08',
        description: 'Customer Payment - ABC Corp',
        reference: 'DEP001',
        withdrawal: 0,
        deposit: 1500,
        balance: 9500,
        type: 'deposit',
        isCleared: false
      }
    ],
    matches: [],
    status: 'in-progress',
    discrepancies: [],
    notes: 'Deposit of $2,000 made on March 31 but not yet on bank statement.',
    createdAt: new Date().toISOString()
  };

  return {
    id: 'deposits_in_transit',
    name: 'Case 3: Deposits in Transit',
    description: 'Deposits recorded in books but not yet processed by bank.',
    learningObjective: 'Recognize deposits in transit - recorded by company but bank hasn\'t processed yet.',
    session
  };
}

// Case 4: Bank Fees
function generateCase4_BankFees(): DemoCase {
  const session: ReconciliationSession = {
    id: 'demo-case-4',
    date: '2024-03-31',
    month: 'March',
    year: '2024',
    startingBalance: 5000,
    endingBalance: 6935,
    bankStatementEntries: [
      {
        id: 'bank-4-1',
        date: '2024-03-15',
        description: 'Customer Payment',
        reference: 'DEP001',
        withdrawal: 0,
        deposit: 2000,
        balance: 7000,
        type: 'deposit',
        isCleared: false
      },
      {
        id: 'bank-4-2',
        date: '2024-03-31',
        description: 'Monthly Maintenance Fee',
        reference: 'FEE001',
        withdrawal: 35,
        deposit: 0,
        balance: 6965,
        type: 'fee',
        isCleared: false
      },
      {
        id: 'bank-4-3',
        date: '2024-03-31',
        description: 'Interest Income',
        reference: 'INT001',
        withdrawal: 0,
        deposit: 30,
        balance: 6995,
        type: 'interest',
        isCleared: false
      },
      {
        id: 'bank-4-4',
        date: '2024-03-28',
        description: 'Wire Transfer Fee',
        reference: 'FEE002',
        withdrawal: 25,
        deposit: 0,
        balance: 6970,
        type: 'fee',
        isCleared: false
      },
      {
        id: 'bank-4-5',
        date: '2024-03-29',
        description: 'Overdraft Protection Fee',
        reference: 'FEE003',
        withdrawal: 35,
        deposit: 0,
        balance: 6935,
        type: 'fee',
        isCleared: false
      }
    ],
    matches: [],
    status: 'in-progress',
    discrepancies: [],
    notes: 'Bank fees and interest not yet recorded in books.',
    createdAt: new Date().toISOString()
  };

  return {
    id: 'bank_fees',
    name: 'Case 4: Bank Fees & Interest',
    description: 'Bank charged fees and credited interest that aren\'t in books yet.',
    learningObjective: 'Learn to identify and record bank-initiated adjustments (fees and interest).',
    session
  };
}

// Case 5: NSF Check
function generateCase5_NSFCheck(): DemoCase {
  const session: ReconciliationSession = {
    id: 'demo-case-5',
    date: '2024-03-31',
    month: 'March',
    year: '2024',
    startingBalance: 10000,
    endingBalance: 8750,
    bankStatementEntries: [
      {
        id: 'bank-5-1',
        date: '2024-03-10',
        description: 'Customer Payment - XYZ Inc',
        reference: 'DEP001',
        withdrawal: 0,
        deposit: 1200,
        balance: 11200,
        type: 'deposit',
        isCleared: false
      },
      {
        id: 'bank-5-2',
        date: '2024-03-15',
        description: 'Check #3001 - Vendor Payment',
        reference: 'CHK3001',
        withdrawal: 500,
        deposit: 0,
        balance: 10700,
        type: 'withdrawal',
        isCleared: false
      },
      {
        id: 'bank-5-3',
        date: '2024-03-20',
        description: 'NSF Return - XYZ Inc Check',
        reference: 'NSF001',
        withdrawal: 1200,
        deposit: 0,
        balance: 9500,
        type: 'fee',
        isCleared: false
      },
      {
        id: 'bank-5-4',
        date: '2024-03-20',
        description: 'NSF Fee',
        reference: 'FEE001',
        withdrawal: 35,
        deposit: 0,
        balance: 9465,
        type: 'fee',
        isCleared: false
      },
      {
        id: 'bank-5-5',
        date: '2024-03-25',
        description: 'Customer Payment - ABC Corp',
        reference: 'DEP002',
        withdrawal: 0,
        deposit: 2500,
        balance: 11965,
        type: 'deposit',
        isCleared: false
      },
      {
        id: 'bank-5-6',
        date: '2024-03-30',
        description: 'Check #3002 - Payroll',
        reference: 'CHK3002',
        withdrawal: 3215,
        deposit: 0,
        balance: 8750,
        type: 'withdrawal',
        isCleared: false
      }
    ],
    matches: [],
    status: 'in-progress',
    discrepancies: [],
    notes: 'Customer check bounced - needs adjustment.',
    createdAt: new Date().toISOString()
  };

  return {
    id: 'nsf_check',
    name: 'Case 5: NSF (Bad) Check',
    description: 'Customer check was returned due to insufficient funds.',
    learningObjective: 'Handle returned checks - requires adjustment to accounts receivable.',
    session
  };
}

// Case 6: Bank Error
function generateCase6_BankError(): DemoCase {
  const session: ReconciliationSession = {
    id: 'demo-case-6',
    date: '2024-03-31',
    month: 'March',
    year: '2024',
    startingBalance: 12000,
    endingBalance: 11050,
    bankStatementEntries: [
      {
        id: 'bank-6-1',
        date: '2024-03-12',
        description: 'Check #4001 - Office Rent',
        reference: 'CHK4001',
        withdrawal: 1200,
        deposit: 0,
        balance: 10800,
        type: 'withdrawal',
        isCleared: false
      },
      {
        id: 'bank-6-2',
        date: '2024-03-12',
        description: 'Check #4001 - Office Rent (DUPLICATE)',
        reference: 'CHK4001',
        withdrawal: 1200,
        deposit: 0,
        balance: 9600,
        type: 'withdrawal',
        isCleared: false
      },
      {
        id: 'bank-6-3',
        date: '2024-03-20',
        description: 'Customer Payment',
        reference: 'DEP001',
        withdrawal: 0,
        deposit: 3500,
        balance: 13100,
        type: 'deposit',
        isCleared: false
      },
      {
        id: 'bank-6-4',
        date: '2024-03-28',
        description: 'Check #4002 - Utilities',
        reference: 'CHK4002',
        withdrawal: 250,
        deposit: 0,
        balance: 12850,
        type: 'withdrawal',
        isCleared: false
      },
      {
        id: 'bank-6-5',
        date: '2024-03-30',
        description: 'ATM Withdrawal',
        reference: 'ATM001',
        withdrawal: 1800,
        deposit: 0,
        balance: 11050,
        type: 'withdrawal',
        isCleared: false
      }
    ],
    matches: [],
    status: 'in-progress',
    discrepancies: [],
    notes: 'Bank processed Check #4001 twice - this is a bank error.',
    createdAt: new Date().toISOString()
  };

  return {
    id: 'bank_error',
    name: 'Case 6: Bank Error',
    description: 'Bank incorrectly processed a check twice.',
    learningObjective: 'Identify bank errors - contact bank for correction, no book adjustment needed.',
    session
  };
}

// Case 7: Complex Multi-Issue
function generateCase7_Complex(): DemoCase {
  const session: ReconciliationSession = {
    id: 'demo-case-7',
    date: '2024-03-31',
    month: 'March',
    year: '2024',
    startingBalance: 15000,
    endingBalance: 14815,
    bankStatementEntries: [
      {
        id: 'bank-7-1',
        date: '2024-03-05',
        description: 'Customer Payment - Corp A',
        reference: 'DEP001',
        withdrawal: 0,
        deposit: 5000,
        balance: 20000,
        type: 'deposit',
        isCleared: false
      },
      {
        id: 'bank-7-2',
        date: '2024-03-10',
        description: 'Check #5001 - Vendor Payment',
        reference: 'CHK5001',
        withdrawal: 2500,
        deposit: 0,
        balance: 17500,
        type: 'withdrawal',
        isCleared: false
      },
      {
        id: 'bank-7-3',
        date: '2024-03-15',
        description: 'Check #5002 - Equipment',
        reference: 'CHK5002',
        withdrawal: 1200,
        deposit: 0,
        balance: 16300,
        type: 'withdrawal',
        isCleared: false
      },
      {
        id: 'bank-7-4',
        date: '2024-03-20',
        description: 'Customer Payment - Corp B',
        reference: 'DEP002',
        withdrawal: 0,
        deposit: 3500,
        balance: 19800,
        type: 'deposit',
        isCleared: false
      },
      {
        id: 'bank-7-5',
        date: '2024-03-25',
        description: 'Check #5003 - Payroll',
        reference: 'CHK5003',
        withdrawal: 4800,
        deposit: 0,
        balance: 15000,
        type: 'withdrawal',
        isCleared: false
      },
      {
        id: 'bank-7-6',
        date: '2024-03-31',
        description: 'Monthly Service Fee',
        reference: 'FEE001',
        withdrawal: 35,
        deposit: 0,
        balance: 14965,
        type: 'fee',
        isCleared: false
      },
      {
        id: 'bank-7-7',
        date: '2024-03-31',
        description: 'Interest Income',
        reference: 'INT001',
        withdrawal: 0,
        deposit: 50,
        balance: 15015,
        type: 'interest',
        isCleared: false
      },
      {
        id: 'bank-7-8',
        date: '2024-03-28',
        description: 'Wire Transfer Fee',
        reference: 'FEE002',
        withdrawal: 25,
        deposit: 0,
        balance: 14990,
        type: 'fee',
        isCleared: false
      },
      {
        id: 'bank-7-9',
        date: '2024-03-29',
        description: 'Check Printing Fee',
        reference: 'FEE003',
        withdrawal: 15,
        deposit: 0,
        balance: 14975,
        type: 'fee',
        isCleared: false
      },
      {
        id: 'bank-7-10',
        date: '2024-03-30',
        description: 'ATM Fee',
        reference: 'FEE004',
        withdrawal: 10,
        deposit: 0,
        balance: 14965,
        type: 'fee',
        isCleared: false
      },
      {
        id: 'bank-7-11',
        date: '2024-03-22',
        description: 'Check #5004 - Marketing',
        reference: 'CHK5004',
        withdrawal: 150,
        deposit: 0,
        balance: 14815,
        type: 'withdrawal',
        isCleared: false
      }
    ],
    matches: [],
    status: 'in-progress',
    discrepancies: [],
    notes: 'Complex scenario: outstanding checks, deposits in transit, multiple bank fees, and interest.',
    createdAt: new Date().toISOString()
  };

  return {
    id: 'complex',
    name: 'Case 7: Complex Reconciliation',
    description: 'Real-world scenario with multiple types of discrepancies.',
    learningObjective: 'Apply all reconciliation concepts together in a complex situation.',
    session
  };
}

/**
 * Get corresponding journal entries for demo cases
 */
export const getDemoCaseJournalEntries = (caseId: string): JournalEntry[] => {
  const baseEntries: { [key: string]: JournalEntry[] } = {
    'demo-case-1': [
      {
        id: 'je-1-1',
        date: '2024-03-05',
        account: '1011 - Cash',
        description: 'Customer Payment - Invoice 1001',
        debit: 1500,
        credit: 0,
        reference: 'DEP001'
      },
      {
        id: 'je-1-2',
        date: '2024-03-10',
        account: '1011 - Cash',
        description: 'Check #1001 - Office Supplies',
        debit: 0,
        credit: 500,
        reference: 'CHK1001'
      },
      {
        id: 'je-1-3',
        date: '2024-03-15',
        account: '1011 - Cash',
        description: 'Customer Payment - Invoice 1002',
        debit: 2000,
        credit: 0,
        reference: 'DEP002'
      },
      {
        id: 'je-1-4',
        date: '2024-03-20',
        account: '1011 - Cash',
        description: 'Check #1002 - Rent Payment',
        debit: 0,
        credit: 1200,
        reference: 'CHK1002'
      },
      {
        id: 'je-1-5',
        date: '2024-03-25',
        account: '1011 - Cash',
        description: 'Customer Payment - Invoice 1003',
        debit: 700,
        credit: 0,
        reference: 'DEP003'
      }
    ],
    'demo-case-2': [
      {
        id: 'je-2-1',
        date: '2024-03-10',
        account: '1011 - Cash',
        description: 'Customer Payment',
        debit: 2000,
        credit: 0,
        reference: 'DEP001'
      },
      {
        id: 'je-2-2',
        date: '2024-03-15',
        account: '1011 - Cash',
        description: 'Check #2001 - Utilities',
        debit: 0,
        credit: 300,
        reference: 'CHK2001'
      },
      {
        id: 'je-2-3',
        date: '2024-03-20',
        account: '1011 - Cash',
        description: 'Check #2002 - Insurance',
        debit: 0,
        credit: 900,
        reference: 'CHK2002'
      },
      {
        id: 'je-2-4',
        date: '2024-03-25',
        account: '1011 - Cash',
        description: 'Check #2003 - Supplies',
        debit: 0,
        credit: 1500,
        reference: 'CHK2003'
      },
      {
        id: 'je-2-5',
        date: '2024-03-28',
        account: '1011 - Cash',
        description: 'Check #2004 - Marketing (Outstanding)',
        debit: 0,
        credit: 500,
        reference: 'CHK2004'
      },
      {
        id: 'je-2-6',
        date: '2024-03-30',
        account: '1011 - Cash',
        description: 'Check #2005 - Consulting Fees (Outstanding)',
        debit: 0,
        credit: 800,
        reference: 'CHK2005'
      }
    ],
    'demo-case-3': [
      {
        id: 'je-3-1',
        date: '2024-03-08',
        account: '1011 - Cash',
        description: 'Customer Payment - ABC Corp',
        debit: 1500,
        credit: 0,
        reference: 'DEP001'
      },
      {
        id: 'je-3-2',
        date: '2024-03-31',
        account: '1011 - Cash',
        description: 'End of Month Deposit (In Transit)',
        debit: 2000,
        credit: 0,
        reference: 'DEP002'
      }
    ],
    'demo-case-4': [
      {
        id: 'je-4-1',
        date: '2024-03-15',
        account: '1011 - Cash',
        description: 'Customer Payment',
        debit: 2000,
        credit: 0,
        reference: 'DEP001'
      }
    ],
    'demo-case-5': [
      {
        id: 'je-5-1',
        date: '2024-03-10',
        account: '1011 - Cash',
        description: 'Customer Payment - XYZ Inc',
        debit: 1200,
        credit: 0,
        reference: 'DEP001'
      },
      {
        id: 'je-5-2',
        date: '2024-03-15',
        account: '1011 - Cash',
        description: 'Check #3001 - Vendor Payment',
        debit: 0,
        credit: 500,
        reference: 'CHK3001'
      },
      {
        id: 'je-5-3',
        date: '2024-03-25',
        account: '1011 - Cash',
        description: 'Customer Payment - ABC Corp',
        debit: 2500,
        credit: 0,
        reference: 'DEP002'
      },
      {
        id: 'je-5-4',
        date: '2024-03-30',
        account: '1011 - Cash',
        description: 'Check #3002 - Payroll',
        debit: 0,
        credit: 3215,
        reference: 'CHK3002'
      }
    ],
    'demo-case-6': [
      {
        id: 'je-6-1',
        date: '2024-03-12',
        account: '1011 - Cash',
        description: 'Check #4001 - Office Rent',
        debit: 0,
        credit: 1200,
        reference: 'CHK4001'
      },
      {
        id: 'je-6-2',
        date: '2024-03-20',
        account: '1011 - Cash',
        description: 'Customer Payment',
        debit: 3500,
        credit: 0,
        reference: 'DEP001'
      },
      {
        id: 'je-6-3',
        date: '2024-03-28',
        account: '1011 - Cash',
        description: 'Check #4002 - Utilities',
        debit: 0,
        credit: 250,
        reference: 'CHK4002'
      },
      {
        id: 'je-6-4',
        date: '2024-03-30',
        account: '1011 - Cash',
        description: 'ATM Withdrawal',
        debit: 0,
        credit: 1800,
        reference: 'ATM001'
      }
    ],
    'demo-case-7': [
      {
        id: 'je-7-1',
        date: '2024-03-05',
        account: '1011 - Cash',
        description: 'Customer Payment - Corp A',
        debit: 5000,
        credit: 0,
        reference: 'DEP001'
      },
      {
        id: 'je-7-2',
        date: '2024-03-10',
        account: '1011 - Cash',
        description: 'Check #5001 - Vendor Payment',
        debit: 0,
        credit: 2500,
        reference: 'CHK5001'
      },
      {
        id: 'je-7-3',
        date: '2024-03-15',
        account: '1011 - Cash',
        description: 'Check #5002 - Equipment',
        debit: 0,
        credit: 1200,
        reference: 'CHK5002'
      },
      {
        id: 'je-7-4',
        date: '2024-03-20',
        account: '1011 - Cash',
        description: 'Customer Payment - Corp B',
        debit: 3500,
        credit: 0,
        reference: 'DEP002'
      },
      {
        id: 'je-7-5',
        date: '2024-03-25',
        account: '1011 - Cash',
        description: 'Check #5003 - Payroll',
        debit: 0,
        credit: 4800,
        reference: 'CHK5003'
      },
      {
        id: 'je-7-6',
        date: '2024-03-22',
        account: '1011 - Cash',
        description: 'Check #5004 - Marketing',
        debit: 0,
        credit: 150,
        reference: 'CHK5004'
      },
      {
        id: 'je-7-7',
        date: '2024-03-28',
        account: '1011 - Cash',
        description: 'Check #5005 - Office Supplies (Outstanding)',
        debit: 0,
        credit: 450,
        reference: 'CHK5005'
      },
      {
        id: 'je-7-8',
        date: '2024-03-30',
        account: '1011 - Cash',
        description: 'Check #5006 - Professional Fees (Outstanding)',
        debit: 0,
        credit: 750,
        reference: 'CHK5006'
      },
      {
        id: 'je-7-9',
        date: '2024-03-31',
        account: '1011 - Cash',
        description: 'Late Day Deposit (In Transit)',
        debit: 1800,
        credit: 0,
        reference: 'DEP003'
      }
    ]
  };

  return baseEntries[caseId] || [];
};
