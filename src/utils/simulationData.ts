import { JournalEntry, OpeningBalanceEntry } from "@/types";

/**
 * Generate opening balances for TechConsult Solutions LLC as of January 1, 2024
 * Reflects the financial position after 2 months of operations (started Nov 2023)
 */
export const generateOpeningBalances = (): OpeningBalanceEntry[] => {
  const openingDate = '2024-01-01';
  
  return [
    {
      id: 'ob-1',
      account: '1011 - Cash',
      debit: 95000,
      credit: 0,
      date: openingDate
    },
    {
      id: 'ob-2',
      account: '1020 - Accounts Receivable',
      debit: 12500,
      credit: 0,
      date: openingDate
    },
    {
      id: 'ob-3',
      account: '1040 - Prepaid Expenses',
      debit: 3600,
      credit: 0,
      date: openingDate
    },
    {
      id: 'ob-4',
      account: '1110 - Office Equipment',
      debit: 15000,
      credit: 0,
      date: openingDate
    },
    {
      id: 'ob-5',
      account: '1140 - Accumulated Depreciation',
      debit: 0,
      credit: 500,
      date: openingDate
    },
    {
      id: 'ob-6',
      account: '2011 - Accounts Payable',
      debit: 0,
      credit: 2800,
      date: openingDate
    },
    {
      id: 'ob-7',
      account: '2020 - Notes Payable',
      debit: 0,
      credit: 25000,
      date: openingDate
    },
    {
      id: 'ob-8',
      account: '3010 - Owner\'s Capital',
      debit: 0,
      credit: 100000,
      date: openingDate
    },
    {
      id: 'ob-9',
      account: '3020 - Retained Earnings',
      debit: 0,
      credit: 2200,
      date: openingDate
    }
  ];
};

/**
 * Helper to create dates for Q1 2024 (Jan 1 - Mar 31)
 */
const getQ1Date = (month: number, day: number): string => {
  return `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

/**
 * Generate realistic Q1 2024 journal entries for "TechConsult Solutions LLC"
 * Period: January 1 - March 31, 2024
 * Starting from opening balances, creating 3 months of realistic business transactions
 */
export const generateSampleEntries = (): JournalEntry[] => {
  let entryId = 1;
  const entries: JournalEntry[] = [];

  const addEntry = (date: string, account: string, desc: string, debit: number, credit: number, ref: string) => {
    entries.push({
      id: (entryId++).toString(),
      date,
      account,
      description: desc,
      debit,
      credit,
      reference: ref,
    });
  };

  // === JANUARY 2024: Month 1 Operations ===
  
  // Jan 3: Rent expense for January (from prepaid)
  addEntry(getQ1Date(1, 3), "6210 - Rent Expense", "Office rent - January 2024", 3000, 0, "RENT-JAN");
  addEntry(getQ1Date(1, 3), "1040 - Prepaid Expenses", "Office rent - January 2024", 0, 3000, "RENT-JAN");
  
  // Jan 5: Client invoice - ABC Corp (from prior AR)
  addEntry(getQ1Date(1, 8), "1011 - Cash", "Payment received from ABC Corp", 12500, 0, "PAY-1001");
  addEntry(getQ1Date(1, 8), "1020 - Accounts Receivable", "Payment received from ABC Corp", 0, 12500, "PAY-1001");
  
  // Jan 10: Utilities bill
  addEntry(getQ1Date(1, 10), "6220 - Utilities", "January utilities - internet, electricity", 580, 0, "UTIL-JAN");
  addEntry(getQ1Date(1, 10), "2011 - Accounts Payable", "January utilities - internet, electricity", 0, 580, "UTIL-JAN");
  
  // Jan 15: Payroll #1
  addEntry(getQ1Date(1, 15), "6110 - Salaries & Wages", "January payroll - 3 employees", 18000, 0, "PAY-JAN1");
  addEntry(getQ1Date(1, 15), "1011 - Cash", "January payroll - 3 employees", 0, 18000, "PAY-JAN1");
  
  // Jan 18: New client invoice - XYZ Ltd
  addEntry(getQ1Date(1, 18), "1020 - Accounts Receivable", "Invoice XYZ Ltd - Mobile app dev", 42000, 0, "INV-1006");
  addEntry(getQ1Date(1, 18), "4010 - Service Revenue", "Invoice XYZ Ltd - Mobile app dev", 0, 42000, "INV-1006");
  
  // Jan 20: Office supplies
  addEntry(getQ1Date(1, 20), "6310 - Office Supplies", "Office supplies purchase", 425, 0, "SUP-JAN");
  addEntry(getQ1Date(1, 20), "1011 - Cash", "Office supplies purchase", 0, 425, "SUP-JAN");
  
  // Jan 22: Marketing expense
  addEntry(getQ1Date(1, 22), "6230 - Marketing & Advertising", "Google Ads January campaign", 1200, 0, "MKT-JAN");
  addEntry(getQ1Date(1, 22), "1011 - Cash", "Google Ads January campaign", 0, 1200, "MKT-JAN");
  
  // Jan 25: Pay utilities from prior month
  addEntry(getQ1Date(1, 25), "2011 - Accounts Payable", "Payment - December utilities", 580, 0, "PAY-UTIL");
  addEntry(getQ1Date(1, 25), "1011 - Cash", "Payment - December utilities", 0, 580, "PAY-UTIL");
  
  // Jan 31: Monthly depreciation
  addEntry(getQ1Date(1, 31), "6920 - Depreciation Expense", "January depreciation expense", 500, 0, "DEP-JAN");
  addEntry(getQ1Date(1, 31), "1140 - Accumulated Depreciation", "January depreciation expense", 0, 500, "DEP-JAN");
  
  // === FEBRUARY 2024: Month 2 Operations ===
  
  // Feb 2: Rent expense
  addEntry(getQ1Date(2, 2), "6210 - Rent Expense", "Office rent - February 2024", 3000, 0, "RENT-FEB");
  addEntry(getQ1Date(2, 2), "1040 - Prepaid Expenses", "Office rent - February 2024", 0, 3000, "RENT-FEB");
  
  // Feb 5: Deposit from XYZ Ltd (50%)
  addEntry(getQ1Date(2, 5), "1011 - Cash", "Deposit from XYZ Ltd - 50%", 21000, 0, "PAY-1007");
  addEntry(getQ1Date(2, 5), "1020 - Accounts Receivable", "Deposit from XYZ Ltd - 50%", 0, 21000, "PAY-1007");
  
  // Feb 8: Professional services
  addEntry(getQ1Date(2, 8), "6240 - Professional Fees", "Accounting & legal consulting", 2200, 0, "PROF-FEB");
  addEntry(getQ1Date(2, 8), "1011 - Cash", "Accounting & legal consulting", 0, 2200, "PROF-FEB");
  
  // Feb 12: Insurance payment (annual)
  addEntry(getQ1Date(2, 12), "1040 - Prepaid Expenses", "Annual business insurance", 3600, 0, "INS-2024");
  addEntry(getQ1Date(2, 12), "1011 - Cash", "Annual business insurance", 0, 3600, "INS-2024");
  
  // Feb 15: Payroll #2
  addEntry(getQ1Date(2, 15), "6110 - Salaries & Wages", "February payroll - 3 employees", 18000, 0, "PAY-FEB1");
  addEntry(getQ1Date(2, 15), "1011 - Cash", "February payroll - 3 employees", 0, 18000, "PAY-FEB1");
  
  // Feb 18: New client - FinTech Inc
  addEntry(getQ1Date(2, 18), "1020 - Accounts Receivable", "Invoice FinTech Inc - API integration", 35000, 0, "INV-1008");
  addEntry(getQ1Date(2, 18), "4010 - Service Revenue", "Invoice FinTech Inc - API integration", 0, 35000, "INV-1008");
  
  // Feb 20: Loan payment
  addEntry(getQ1Date(2, 20), "2020 - Notes Payable", "Loan principal payment", 1500, 0, "LOAN-FEB");
  addEntry(getQ1Date(2, 20), "6930 - Interest Expense", "Loan interest payment", 250, 0, "LOAN-FEB");
  addEntry(getQ1Date(2, 20), "1011 - Cash", "Loan payment - principal + interest", 0, 1750, "LOAN-FEB");
  
  // Feb 22: Utilities February
  addEntry(getQ1Date(2, 22), "6220 - Utilities", "February utilities", 620, 0, "UTIL-FEB");
  addEntry(getQ1Date(2, 22), "2011 - Accounts Payable", "February utilities", 0, 620, "UTIL-FEB");
  
  // Feb 25: Office equipment purchase
  addEntry(getQ1Date(2, 25), "1110 - Office Equipment", "New monitors and peripherals", 2500, 0, "EQUIP-FEB");
  addEntry(getQ1Date(2, 25), "1011 - Cash", "New monitors and peripherals", 0, 2500, "EQUIP-FEB");
  
  // Feb 28: Monthly depreciation
  addEntry(getQ1Date(2, 28), "6920 - Depreciation Expense", "February depreciation expense", 500, 0, "DEP-FEB");
  addEntry(getQ1Date(2, 28), "1140 - Accumulated Depreciation", "February depreciation expense", 0, 500, "DEP-FEB");
  
  // === MARCH 2024: Month 3 Operations ===
  
  // Mar 1: Rent expense
  addEntry(getQ1Date(3, 1), "6210 - Rent Expense", "Office rent - March 2024", 3000, 0, "RENT-MAR");
  addEntry(getQ1Date(3, 1), "1040 - Prepaid Expenses", "Office rent - March 2024", 0, 3000, "RENT-MAR");
  
  // Mar 5: Final payment from XYZ Ltd
  addEntry(getQ1Date(3, 5), "1011 - Cash", "Final payment from XYZ Ltd", 21000, 0, "PAY-1009");
  addEntry(getQ1Date(3, 5), "1020 - Accounts Receivable", "Final payment from XYZ Ltd", 0, 21000, "PAY-1009");
  
  // Mar 8: FinTech Inc deposit (50%)
  addEntry(getQ1Date(3, 8), "1011 - Cash", "Deposit from FinTech Inc - 50%", 17500, 0, "PAY-1010");
  addEntry(getQ1Date(3, 8), "1020 - Accounts Receivable", "Deposit from FinTech Inc - 50%", 0, 17500, "PAY-1010");
  
  // Mar 10: Marketing expenses
  addEntry(getQ1Date(3, 10), "6230 - Marketing & Advertising", "LinkedIn ads + content marketing", 1500, 0, "MKT-MAR");
  addEntry(getQ1Date(3, 10), "1011 - Cash", "LinkedIn ads + content marketing", 0, 1500, "MKT-MAR");
  
  // Mar 12: New client - RetailCo
  addEntry(getQ1Date(3, 12), "1020 - Accounts Receivable", "Invoice RetailCo - E-commerce platform", 28000, 0, "INV-1010");
  addEntry(getQ1Date(3, 12), "4010 - Service Revenue", "Invoice RetailCo - E-commerce platform", 0, 28000, "INV-1010");
  
  // Mar 15: Payroll #3
  addEntry(getQ1Date(3, 15), "6110 - Salaries & Wages", "March payroll - 3 employees", 19000, 0, "PAY-MAR1");
  addEntry(getQ1Date(3, 15), "1011 - Cash", "March payroll - 3 employees", 0, 19000, "PAY-MAR1");
  
  // Mar 18: Pay February utilities
  addEntry(getQ1Date(3, 18), "2011 - Accounts Payable", "Payment - February utilities", 620, 0, "PAY-UTIL-FEB");
  addEntry(getQ1Date(3, 18), "1011 - Cash", "Payment - February utilities", 0, 620, "PAY-UTIL-FEB");
  
  // Mar 20: Travel expense
  addEntry(getQ1Date(3, 20), "6240 - Professional Fees", "Client meeting travel", 1250, 0, "TRAVEL-MAR");
  addEntry(getQ1Date(3, 20), "1011 - Cash", "Client meeting travel", 0, 1250, "TRAVEL-MAR");
  
  // Mar 22: Office supplies
  addEntry(getQ1Date(3, 22), "6310 - Office Supplies", "Office supplies restocking", 375, 0, "SUP-MAR");
  addEntry(getQ1Date(3, 22), "1011 - Cash", "Office supplies restocking", 0, 375, "SUP-MAR");
  
  // Mar 25: Software subscriptions
  addEntry(getQ1Date(3, 25), "6240 - Professional Fees", "Monthly SaaS subscriptions", 450, 0, "SOFT-MAR");
  addEntry(getQ1Date(3, 25), "1011 - Cash", "Monthly SaaS subscriptions", 0, 450, "SOFT-MAR");
  
  // Mar 28: March utilities
  addEntry(getQ1Date(3, 28), "6220 - Utilities", "March utilities", 595, 0, "UTIL-MAR");
  addEntry(getQ1Date(3, 28), "2011 - Accounts Payable", "March utilities", 0, 595, "UTIL-MAR");
  
  // Mar 29: Outstanding checks (will not be in bank statement yet)
  addEntry(getQ1Date(3, 29), "6310 - Office Supplies", "Office furniture order", 1500, 0, "CHK-5024");
  addEntry(getQ1Date(3, 29), "1011 - Cash", "Office furniture order - Check #5024", 0, 1500, "CHK-5024");
  
  addEntry(getQ1Date(3, 30), "6230 - Marketing & Advertising", "Conference sponsorship", 450, 0, "CHK-5025");
  addEntry(getQ1Date(3, 30), "1011 - Cash", "Conference sponsorship - Check #5025", 0, 450, "CHK-5025");
  
  // Mar 31: Deposit in transit (recorded but not on bank statement yet)
  addEntry(getQ1Date(3, 31), "1011 - Cash", "Payment from client - deposited late", 2000, 0, "DEP-MAR31");
  addEntry(getQ1Date(3, 31), "1020 - Accounts Receivable", "Payment from client - deposited late", 0, 2000, "DEP-MAR31");
  
  // Mar 31: Monthly depreciation
  addEntry(getQ1Date(3, 31), "6920 - Depreciation Expense", "March depreciation expense", 500, 0, "DEP-MAR");
  addEntry(getQ1Date(3, 31), "1140 - Accumulated Depreciation", "March depreciation expense", 0, 500, "DEP-MAR");

  return entries;
};

export const processDocumentToJournalEntry = (
  fileName: string,
  existingCount: number
): JournalEntry[] => {
  const today = new Date().toISOString().split("T")[0];
  const idBase = existingCount + 1;

  // Simulate different document types with proper COA mapping
  if (fileName.toLowerCase().includes("invoice")) {
    return [
      {
        id: `${idBase}`,
        date: today,
        account: "1020 - Accounts Receivable",
        description: `Invoice from ${fileName}`,
        debit: 3500,
        credit: 0,
        reference: `INV-${idBase}`,
      },
      {
        id: `${idBase + 1}`,
        date: today,
        account: "4010 - Service Revenue",
        description: `Invoice from ${fileName}`,
        debit: 0,
        credit: 3500,
        reference: `INV-${idBase}`,
      },
    ];
  } else if (fileName.toLowerCase().includes("bill")) {
    const amount = Math.floor(Math.random() * 1000) + 200;
    return [
      {
        id: `${idBase}`,
        date: today,
        account: "6220 - Utilities",
        description: `Bill from ${fileName}`,
        debit: amount,
        credit: 0,
        reference: `BILL-${idBase}`,
      },
      {
        id: `${idBase + 1}`,
        date: today,
        account: "2011 - Accounts Payable",
        description: `Bill from ${fileName}`,
        debit: 0,
        credit: amount,
        reference: `BILL-${idBase}`,
      },
    ];
  } else if (fileName.toLowerCase().includes("receipt")) {
    const amount = Math.floor(Math.random() * 500) + 100;
    return [
      {
        id: `${idBase}`,
        date: today,
        account: "6310 - Office Supplies",
        description: `Receipt from ${fileName}`,
        debit: amount,
        credit: 0,
        reference: `RCP-${idBase}`,
      },
      {
        id: `${idBase + 1}`,
        date: today,
        account: "1011 - Cash",
        description: `Receipt from ${fileName}`,
        debit: 0,
        credit: amount,
        reference: `RCP-${idBase}`,
      },
    ];
  } else if (fileName.toLowerCase().includes("statement")) {
    // Bank statement - deposit
    const amount = Math.floor(Math.random() * 5000) + 1000;
    return [
      {
        id: `${idBase}`,
        date: today,
        account: "1011 - Cash",
        description: `Bank deposit from ${fileName}`,
        debit: amount,
        credit: 0,
        reference: `STMT-${idBase}`,
      },
      {
        id: `${idBase + 1}`,
        date: today,
        account: "1020 - Accounts Receivable",
        description: `Bank deposit from ${fileName}`,
        debit: 0,
        credit: amount,
        reference: `STMT-${idBase}`,
      },
    ];
  } else {
    // Default entry
    return [
      {
        id: `${idBase}`,
        date: today,
        account: "6940 - Bad Debt Expense",
        description: `Document: ${fileName}`,
        debit: 1000,
        credit: 0,
        reference: `DOC-${idBase}`,
      },
      {
        id: `${idBase + 1}`,
        date: today,
        account: "1011 - Cash",
        description: `Document: ${fileName}`,
        debit: 0,
        credit: 1000,
        reference: `DOC-${idBase}`,
      },
    ];
  }
};
