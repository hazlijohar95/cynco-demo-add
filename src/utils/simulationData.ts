import type { JournalEntry } from "@/components/SpreadsheetPanel";
import { CHART_OF_ACCOUNTS, getAccountByCode, getAccountByName } from "./chartOfAccounts";

// Generate sample journal entries for simulation
export const generateSampleEntries = (): JournalEntry[] => {
  const today = new Date().toISOString().split("T")[0];
  
  return [
    {
      id: "1",
      date: today,
      account: "1011 - Cash",
      description: "Initial capital investment",
      debit: 50000,
      credit: 0,
      reference: "INV-001",
    },
    {
      id: "2",
      date: today,
      account: "3010 - Owner's Capital",
      description: "Initial capital investment",
      debit: 0,
      credit: 50000,
      reference: "INV-001",
    },
    {
      id: "3",
      date: today,
      account: "1110 - Office Equipment",
      description: "Purchase of computers and furniture",
      debit: 8000,
      credit: 0,
      reference: "PO-001",
    },
    {
      id: "4",
      date: today,
      account: "1011 - Cash",
      description: "Purchase of computers and furniture",
      debit: 0,
      credit: 8000,
      reference: "PO-001",
    },
    {
      id: "5",
      date: today,
      account: "1020 - Accounts Receivable",
      description: "Client invoice for services",
      debit: 12000,
      credit: 0,
      reference: "INV-100",
    },
    {
      id: "6",
      date: today,
      account: "4010 - Service Revenue",
      description: "Client invoice for services",
      debit: 0,
      credit: 12000,
      reference: "INV-100",
    },
    {
      id: "7",
      date: today,
      account: "6210 - Rent Expense",
      description: "Monthly office rent",
      debit: 2500,
      credit: 0,
      reference: "BILL-001",
    },
    {
      id: "8",
      date: today,
      account: "1011 - Cash",
      description: "Monthly office rent",
      debit: 0,
      credit: 2500,
      reference: "BILL-001",
    },
    {
      id: "9",
      date: today,
      account: "6220 - Utilities",
      description: "Electricity and internet",
      debit: 450,
      credit: 0,
      reference: "BILL-002",
    },
    {
      id: "10",
      date: today,
      account: "2011 - Accounts Payable",
      description: "Electricity and internet",
      debit: 0,
      credit: 450,
      reference: "BILL-002",
    },
    {
      id: "11",
      date: today,
      account: "1011 - Cash",
      description: "Payment received from client",
      debit: 6000,
      credit: 0,
      reference: "PAY-001",
    },
    {
      id: "12",
      date: today,
      account: "1020 - Accounts Receivable",
      description: "Payment received from client",
      debit: 0,
      credit: 6000,
      reference: "PAY-001",
    },
    {
      id: "13",
      date: today,
      account: "6110 - Salaries & Wages",
      description: "Staff salaries",
      debit: 5000,
      credit: 0,
      reference: "PAY-002",
    },
    {
      id: "14",
      date: today,
      account: "1011 - Cash",
      description: "Staff salaries",
      debit: 0,
      credit: 5000,
      reference: "PAY-002",
    },
  ];
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
