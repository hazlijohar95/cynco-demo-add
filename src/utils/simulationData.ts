import type { JournalEntry } from "@/components/SpreadsheetPanel";

// Generate sample journal entries for simulation
export const generateSampleEntries = (): JournalEntry[] => {
  const today = new Date().toISOString().split("T")[0];
  
  return [
    {
      id: "1",
      date: today,
      account: "Cash",
      description: "Initial capital investment",
      debit: 50000,
      credit: 0,
      reference: "INV-001",
    },
    {
      id: "2",
      date: today,
      account: "Equity - Capital",
      description: "Initial capital investment",
      debit: 0,
      credit: 50000,
      reference: "INV-001",
    },
    {
      id: "3",
      date: today,
      account: "Office Equipment",
      description: "Purchase of computers and furniture",
      debit: 8000,
      credit: 0,
      reference: "PO-001",
    },
    {
      id: "4",
      date: today,
      account: "Cash",
      description: "Purchase of computers and furniture",
      debit: 0,
      credit: 8000,
      reference: "PO-001",
    },
    {
      id: "5",
      date: today,
      account: "Accounts Receivable",
      description: "Client invoice for services",
      debit: 12000,
      credit: 0,
      reference: "INV-100",
    },
    {
      id: "6",
      date: today,
      account: "Service Revenue",
      description: "Client invoice for services",
      debit: 0,
      credit: 12000,
      reference: "INV-100",
    },
    {
      id: "7",
      date: today,
      account: "Rent Expense",
      description: "Monthly office rent",
      debit: 2500,
      credit: 0,
      reference: "BILL-001",
    },
    {
      id: "8",
      date: today,
      account: "Cash",
      description: "Monthly office rent",
      debit: 0,
      credit: 2500,
      reference: "BILL-001",
    },
    {
      id: "9",
      date: today,
      account: "Utilities Expense",
      description: "Electricity and internet",
      debit: 450,
      credit: 0,
      reference: "BILL-002",
    },
    {
      id: "10",
      date: today,
      account: "Accounts Payable",
      description: "Electricity and internet",
      debit: 0,
      credit: 450,
      reference: "BILL-002",
    },
    {
      id: "11",
      date: today,
      account: "Cash",
      description: "Payment received from client",
      debit: 6000,
      credit: 0,
      reference: "PAY-001",
    },
    {
      id: "12",
      date: today,
      account: "Accounts Receivable",
      description: "Payment received from client",
      debit: 0,
      credit: 6000,
      reference: "PAY-001",
    },
    {
      id: "13",
      date: today,
      account: "Salary Expense",
      description: "Staff salaries",
      debit: 5000,
      credit: 0,
      reference: "PAY-002",
    },
    {
      id: "14",
      date: today,
      account: "Cash",
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

  // Simulate different document types
  if (fileName.toLowerCase().includes("invoice")) {
    return [
      {
        id: `${idBase}`,
        date: today,
        account: "Accounts Receivable",
        description: `Invoice from ${fileName}`,
        debit: 3500,
        credit: 0,
        reference: `INV-${idBase}`,
      },
      {
        id: `${idBase + 1}`,
        date: today,
        account: "Service Revenue",
        description: `Invoice from ${fileName}`,
        debit: 0,
        credit: 3500,
        reference: `INV-${idBase}`,
      },
    ];
  } else if (fileName.toLowerCase().includes("bill") || fileName.toLowerCase().includes("receipt")) {
    const amount = Math.floor(Math.random() * 1000) + 200;
    return [
      {
        id: `${idBase}`,
        date: today,
        account: "Operating Expense",
        description: `Bill from ${fileName}`,
        debit: amount,
        credit: 0,
        reference: `BILL-${idBase}`,
      },
      {
        id: `${idBase + 1}`,
        date: today,
        account: "Accounts Payable",
        description: `Bill from ${fileName}`,
        debit: 0,
        credit: amount,
        reference: `BILL-${idBase}`,
      },
    ];
  } else {
    // Default entry
    return [
      {
        id: `${idBase}`,
        date: today,
        account: "Miscellaneous",
        description: `Document: ${fileName}`,
        debit: 1000,
        credit: 0,
        reference: `DOC-${idBase}`,
      },
      {
        id: `${idBase + 1}`,
        date: today,
        account: "Cash",
        description: `Document: ${fileName}`,
        debit: 0,
        credit: 1000,
        reference: `DOC-${idBase}`,
      },
    ];
  }
};
