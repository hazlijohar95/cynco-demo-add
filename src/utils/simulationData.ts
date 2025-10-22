import type { JournalEntry } from "@/components/SpreadsheetPanel";
import { CHART_OF_ACCOUNTS, getAccountByCode, getAccountByName } from "./chartOfAccounts";

// Helper to get date relative to today
const getDateDaysAgo = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

// Generate realistic 3-month business simulation for "TechConsult Solutions LLC"
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

  // === MONTH 1: Business Formation & Setup (90 days ago) ===
  
  // Day 90: Owner invests capital to start business
  const day90 = getDateDaysAgo(90);
  addEntry(day90, "1011 - Cash", "Initial capital investment by owner", 100000, 0, "CAP-001");
  addEntry(day90, "3010 - Owner's Capital", "Initial capital investment by owner", 0, 100000, "CAP-001");

  // Day 88: Purchase office equipment and furniture
  const day88 = getDateDaysAgo(88);
  addEntry(day88, "1110 - Office Equipment", "Purchase: 3 laptops, desks, chairs", 12500, 0, "PO-001");
  addEntry(day88, "1011 - Cash", "Purchase: 3 laptops, desks, chairs", 0, 12500, "PO-001");

  // Day 87: Pay 3 months rent in advance (first + last + deposit)
  const day87 = getDateDaysAgo(87);
  addEntry(day87, "1040 - Prepaid Expenses", "Office rent: 3 months prepaid", 9000, 0, "RENT-001");
  addEntry(day87, "1011 - Cash", "Office rent: 3 months prepaid", 0, 9000, "RENT-001");

  // Day 85: Purchase office supplies and software licenses
  const day85 = getDateDaysAgo(85);
  addEntry(day85, "6310 - Office Supplies", "Stationery, printer supplies", 850, 0, "SUP-001");
  addEntry(day85, "1011 - Cash", "Stationery, printer supplies", 0, 850, "SUP-001");

  // Day 84: Software subscriptions (annual)
  const day84 = getDateDaysAgo(84);
  addEntry(day84, "1040 - Prepaid Expenses", "Annual software licenses (Slack, GitHub)", 2400, 0, "SOFT-001");
  addEntry(day84, "1011 - Cash", "Annual software licenses (Slack, GitHub)", 0, 2400, "SOFT-001");

  // Day 82: First client project - invoice issued
  const day82 = getDateDaysAgo(82);
  addEntry(day82, "1020 - Accounts Receivable", "Invoice to ABC Corp - Website redesign", 25000, 0, "INV-1001");
  addEntry(day82, "4010 - Service Revenue", "Invoice to ABC Corp - Website redesign", 0, 25000, "INV-1001");

  // Day 80: Hire employees - record first payroll
  const day80 = getDateDaysAgo(80);
  addEntry(day80, "6110 - Salaries & Wages", "Salaries: 2 developers + 1 designer", 18000, 0, "PAY-001");
  addEntry(day80, "1011 - Cash", "Salaries: 2 developers + 1 designer", 0, 18000, "PAY-001");

  // Day 78: Utilities bill received (on credit)
  const day78 = getDateDaysAgo(78);
  addEntry(day78, "6220 - Utilities", "Internet, electricity, water", 580, 0, "BILL-001");
  addEntry(day78, "2011 - Accounts Payable", "Internet, electricity, water", 0, 580, "BILL-001");

  // === MONTH 2: Growing Operations (60 days ago) ===

  // Day 75: Receive payment from first client (50% deposit)
  const day75 = getDateDaysAgo(75);
  addEntry(day75, "1011 - Cash", "Payment from ABC Corp (50% deposit)", 12500, 0, "PAY-101");
  addEntry(day75, "1020 - Accounts Receivable", "Payment from ABC Corp (50% deposit)", 0, 12500, "PAY-101");

  // Day 73: Second client project
  const day73 = getDateDaysAgo(73);
  addEntry(day73, "1020 - Accounts Receivable", "Invoice to XYZ Ltd - Mobile app development", 42000, 0, "INV-1002");
  addEntry(day73, "4010 - Service Revenue", "Invoice to XYZ Ltd - Mobile app development", 0, 42000, "INV-1002");

  // Day 70: Pay utilities bill
  const day70 = getDateDaysAgo(70);
  addEntry(day70, "2011 - Accounts Payable", "Payment for utilities BILL-001", 580, 0, "PAY-102");
  addEntry(day70, "1011 - Cash", "Payment for utilities BILL-001", 0, 580, "PAY-102");

  // Day 68: Marketing expenses
  const day68 = getDateDaysAgo(68);
  addEntry(day68, "6230 - Marketing & Advertising", "Google Ads campaign + business cards", 2200, 0, "MKT-001");
  addEntry(day68, "1011 - Cash", "Google Ads campaign + business cards", 0, 2200, "MKT-001");

  // Day 65: Professional services (lawyer + accountant setup)
  const day65 = getDateDaysAgo(65);
  addEntry(day65, "6240 - Professional Fees", "Legal + accounting setup fees", 3500, 0, "PROF-001");
  addEntry(day65, "2011 - Accounts Payable", "Legal + accounting setup fees", 0, 3500, "PROF-001");

  // Day 63: Second payroll
  const day63 = getDateDaysAgo(63);
  addEntry(day63, "6110 - Salaries & Wages", "Monthly salaries - 3 staff members", 18000, 0, "PAY-002");
  addEntry(day63, "1011 - Cash", "Monthly salaries - 3 staff members", 0, 18000, "PAY-002");

  // Day 60: Record rent expense for month 1 (from prepaid)
  const day60 = getDateDaysAgo(60);
  addEntry(day60, "6210 - Rent Expense", "Office rent expense - Month 1", 3000, 0, "RENT-002");
  addEntry(day60, "1040 - Prepaid Expenses", "Office rent expense - Month 1", 0, 3000, "RENT-002");

  // Day 58: Third client project (smaller project)
  const day58 = getDateDaysAgo(58);
  addEntry(day58, "1020 - Accounts Receivable", "Invoice to StartupCo - Branding consultation", 8500, 0, "INV-1003");
  addEntry(day58, "4010 - Service Revenue", "Invoice to StartupCo - Branding consultation", 0, 8500, "INV-1003");

  // === MONTH 3: Mature Operations (30 days ago) ===

  // Day 55: Small business loan obtained
  const day55 = getDateDaysAgo(55);
  addEntry(day55, "1011 - Cash", "Business loan from Community Bank", 50000, 0, "LOAN-001");
  addEntry(day55, "2020 - Notes Payable", "Business loan from Community Bank", 0, 50000, "LOAN-001");

  // Day 52: Purchase additional equipment with loan
  const day52 = getDateDaysAgo(52);
  addEntry(day52, "1110 - Office Equipment", "Server equipment + monitors", 15000, 0, "PO-002");
  addEntry(day52, "1011 - Cash", "Server equipment + monitors", 0, 15000, "PO-002");

  // Day 50: Full payment from first client
  const day50 = getDateDaysAgo(50);
  addEntry(day50, "1011 - Cash", "Final payment from ABC Corp", 12500, 0, "PAY-103");
  addEntry(day50, "1020 - Accounts Receivable", "Final payment from ABC Corp", 0, 12500, "PAY-103");

  // Day 48: Payment from StartupCo
  const day48 = getDateDaysAgo(48);
  addEntry(day48, "1011 - Cash", "Payment from StartupCo - full amount", 8500, 0, "PAY-104");
  addEntry(day48, "1020 - Accounts Receivable", "Payment from StartupCo - full amount", 0, 8500, "PAY-104");

  // Day 45: Third payroll + bonus
  const day45 = getDateDaysAgo(45);
  addEntry(day45, "6110 - Salaries & Wages", "Salaries + performance bonuses", 21000, 0, "PAY-003");
  addEntry(day45, "1011 - Cash", "Salaries + performance bonuses", 0, 21000, "PAY-003");

  // Day 43: Pay professional services
  const day43 = getDateDaysAgo(43);
  addEntry(day43, "2011 - Accounts Payable", "Payment for legal/accounting fees", 3500, 0, "PAY-105");
  addEntry(day43, "1011 - Cash", "Payment for legal/accounting fees", 0, 3500, "PAY-105");

  // Day 40: Utilities for month 2
  const day40 = getDateDaysAgo(40);
  addEntry(day40, "6220 - Utilities", "Utilities - Month 2", 620, 0, "BILL-002");
  addEntry(day40, "2011 - Accounts Payable", "Utilities - Month 2", 0, 620, "BILL-002");

  // Day 38: Fourth client project
  const day38 = getDateDaysAgo(38);
  addEntry(day38, "1020 - Accounts Receivable", "Invoice to FinTech Inc - API integration", 35000, 0, "INV-1004");
  addEntry(day38, "4010 - Service Revenue", "Invoice to FinTech Inc - API integration", 0, 35000, "INV-1004");

  // Day 35: Insurance payment (annual)
  const day35 = getDateDaysAgo(35);
  addEntry(day35, "1040 - Prepaid Expenses", "Business liability insurance - annual", 3600, 0, "INS-001");
  addEntry(day35, "1011 - Cash", "Business liability insurance - annual", 0, 3600, "INS-001");

  // Day 32: Partial payment from XYZ Ltd
  const day32 = getDateDaysAgo(32);
  addEntry(day32, "1011 - Cash", "Partial payment from XYZ Ltd (30%)", 12600, 0, "PAY-106");
  addEntry(day32, "1020 - Accounts Receivable", "Partial payment from XYZ Ltd (30%)", 0, 12600, "PAY-106");

  // Day 30: Record rent expense for month 2
  const day30 = getDateDaysAgo(30);
  addEntry(day30, "6210 - Rent Expense", "Office rent expense - Month 2", 3000, 0, "RENT-003");
  addEntry(day30, "1040 - Prepaid Expenses", "Office rent expense - Month 2", 0, 3000, "RENT-003");

  // Day 28: Team building event
  const day28 = getDateDaysAgo(28);
  addEntry(day28, "6230 - Marketing & Advertising", "Team building offsite event", 1800, 0, "TEAM-001");
  addEntry(day28, "1011 - Cash", "Team building offsite event", 0, 1800, "TEAM-001");

  // Day 25: Fourth payroll
  const day25 = getDateDaysAgo(25);
  addEntry(day25, "6110 - Salaries & Wages", "Monthly salaries - 3 staff", 18000, 0, "PAY-004");
  addEntry(day25, "1011 - Cash", "Monthly salaries - 3 staff", 0, 18000, "PAY-004");

  // Day 22: Pay utilities bill
  const day22 = getDateDaysAgo(22);
  addEntry(day22, "2011 - Accounts Payable", "Payment for utilities BILL-002", 620, 0, "PAY-107");
  addEntry(day22, "1011 - Cash", "Payment for utilities BILL-002", 0, 620, "PAY-107");

  // Day 20: Office supplies replenishment
  const day20 = getDateDaysAgo(20);
  addEntry(day20, "6310 - Office Supplies", "Office supplies + snacks for team", 425, 0, "SUP-002");
  addEntry(day20, "1011 - Cash", "Office supplies + snacks for team", 0, 425, "SUP-002");

  // Day 18: Loan payment (principal + interest)
  const day18 = getDateDaysAgo(18);
  addEntry(day18, "2020 - Notes Payable", "Loan principal payment - Month 1", 1500, 0, "LOAN-002");
  addEntry(day18, "6930 - Interest Expense", "Loan interest payment - Month 1", 250, 0, "LOAN-002");
  addEntry(day18, "1011 - Cash", "Loan payment (principal + interest)", 0, 1750, "LOAN-002");

  // Day 15: Fifth client project
  const day15 = getDateDaysAgo(15);
  addEntry(day15, "1020 - Accounts Receivable", "Invoice to RetailCo - E-commerce platform", 28000, 0, "INV-1005");
  addEntry(day15, "4010 - Service Revenue", "Invoice to RetailCo - E-commerce platform", 0, 28000, "INV-1005");

  // Day 12: Payment from FinTech Inc (50% deposit)
  const day12 = getDateDaysAgo(12);
  addEntry(day12, "1011 - Cash", "Payment from FinTech Inc (50% deposit)", 17500, 0, "PAY-108");
  addEntry(day12, "1020 - Accounts Receivable", "Payment from FinTech Inc (50% deposit)", 0, 17500, "PAY-108");

  // Day 10: Travel expenses for client meeting
  const day10 = getDateDaysAgo(10);
  addEntry(day10, "6240 - Professional Fees", "Client meeting travel expenses", 1250, 0, "TRAVEL-001");
  addEntry(day10, "1011 - Cash", "Client meeting travel expenses", 0, 1250, "TRAVEL-001");

  // Day 7: Remaining payment from XYZ Ltd
  const day7 = getDateDaysAgo(7);
  addEntry(day7, "1011 - Cash", "Final payment from XYZ Ltd", 29400, 0, "PAY-109");
  addEntry(day7, "1020 - Accounts Receivable", "Final payment from XYZ Ltd", 0, 29400, "PAY-109");

  // Day 5: Monthly utilities
  const day5 = getDateDaysAgo(5);
  addEntry(day5, "6220 - Utilities", "Utilities - Month 3", 595, 0, "BILL-003");
  addEntry(day5, "2011 - Accounts Payable", "Utilities - Month 3", 0, 595, "BILL-003");

  // Day 3: Software renewal (monthly)
  const day3 = getDateDaysAgo(3);
  addEntry(day3, "6240 - Professional Fees", "Monthly cloud hosting + SaaS tools", 850, 0, "SOFT-002");
  addEntry(day3, "1011 - Cash", "Monthly cloud hosting + SaaS tools", 0, 850, "SOFT-002");

  // Day 1: Record depreciation for equipment
  const day1 = getDateDaysAgo(1);
  addEntry(day1, "6920 - Depreciation Expense", "Quarterly depreciation - office equipment", 1375, 0, "DEP-001");
  addEntry(day1, "1140 - Accumulated Depreciation", "Quarterly depreciation - office equipment", 0, 1375, "DEP-001");

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
