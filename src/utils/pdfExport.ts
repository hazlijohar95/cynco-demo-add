import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { JournalEntry } from "@/components/SpreadsheetPanel";
import type { OpeningBalanceEntry } from "@/components/spreadsheet/OpeningBalance";

interface PDFExportOptions {
  journalEntries: JournalEntry[];
  openingBalances: OpeningBalanceEntry[];
  activeView: string;
}

// Premium color scheme - proper tuple types
const COLORS = {
  primary: [99, 102, 241] as [number, number, number],
  secondary: [148, 163, 184] as [number, number, number],
  success: [34, 197, 94] as [number, number, number],
  danger: [239, 68, 68] as [number, number, number],
  dark: [15, 23, 42] as [number, number, number],
  light: [248, 250, 252] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],
};

export const exportToPDF = (options: PDFExportOptions) => {
  const { journalEntries, openingBalances, activeView } = options;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Company Header - Premium Design
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Cynco Accounting", 15, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Financial Statement Report", 15, 28);

  // Date and Time
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US");
  
  doc.setFontSize(9);
  doc.text(`Generated: ${dateStr} at ${timeStr}`, pageWidth - 15, 20, { align: "right" });
  doc.text(`Page 1`, pageWidth - 15, 28, { align: "right" });

  // Reset text color for content
  doc.setTextColor(...COLORS.dark);

  let yPosition = 45;

  // Export based on active view
  switch (activeView) {
    case "journal":
      exportJournalEntries(doc, journalEntries, yPosition);
      break;
    case "opening":
      exportOpeningBalances(doc, openingBalances, yPosition);
      break;
    case "trial":
      exportTrialBalance(doc, journalEntries, yPosition);
      break;
    case "pl":
      exportProfitLoss(doc, journalEntries, yPosition);
      break;
    case "balance":
      exportBalanceSheet(doc, journalEntries, openingBalances, yPosition);
      break;
    case "coa":
      exportChartOfAccounts(doc, journalEntries, yPosition);
      break;
    default:
      exportJournalEntries(doc, journalEntries, yPosition);
  }

  // Footer on all pages
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.secondary);
    doc.setDrawColor(...COLORS.border);
    doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
    doc.text(
      `© ${now.getFullYear()} Cynco Accounting | Confidential`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 15, pageHeight - 10, { align: "right" });
  }

  // Save the PDF
  const fileName = `Cynco_${activeView}_${now.toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
};

// Journal Entries Export
const exportJournalEntries = (doc: jsPDF, entries: JournalEntry[], startY: number) => {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Journal Entries", 15, startY);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.secondary);
  doc.text(`Total Entries: ${entries.length}`, 15, startY + 7);

  const tableData = entries.map((entry) => [
    entry.date,
    entry.reference,
    entry.account,
    entry.description,
    entry.debit > 0 ? entry.debit.toFixed(2) : "-",
    entry.credit > 0 ? entry.credit.toFixed(2) : "-",
  ]);

  const totalDebits = entries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredits = entries.reduce((sum, e) => sum + e.credit, 0);

  autoTable(doc, {
    startY: startY + 12,
    head: [["Date", "Reference", "Account", "Description", "Debit", "Credit"]],
    body: tableData,
    foot: [["", "", "", "TOTALS:", totalDebits.toFixed(2), totalCredits.toFixed(2)]],
    theme: "striped",
    headStyles: {
      fillColor: COLORS.primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    footStyles: {
      fillColor: COLORS.light,
      textColor: COLORS.dark,
      fontStyle: "bold",
      fontSize: 9,
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      font: "helvetica",
    },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 25 },
      2: { cellWidth: 50 },
      3: { cellWidth: 45 },
      4: { halign: "right", cellWidth: 20 },
      5: { halign: "right", cellWidth: 20 },
    },
  });
};

// Opening Balances Export
const exportOpeningBalances = (doc: jsPDF, balances: OpeningBalanceEntry[], startY: number) => {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Opening Balances", 15, startY);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.secondary);
  doc.text(`Balance Sheet accounts at period start`, 15, startY + 7);

  const tableData = balances.map((entry) => [
    entry.date,
    entry.account,
    entry.debit > 0 ? entry.debit.toFixed(2) : "-",
    entry.credit > 0 ? entry.credit.toFixed(2) : "-",
  ]);

  const totalDebits = balances.reduce((sum, e) => sum + e.debit, 0);
  const totalCredits = balances.reduce((sum, e) => sum + e.credit, 0);

  autoTable(doc, {
    startY: startY + 12,
    head: [["Date", "Account", "Debit", "Credit"]],
    body: tableData,
    foot: [["TOTALS:", "", totalDebits.toFixed(2), totalCredits.toFixed(2)]],
    theme: "striped",
    headStyles: {
      fillColor: COLORS.primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    footStyles: {
      fillColor: COLORS.light,
      textColor: COLORS.dark,
      fontStyle: "bold",
      fontSize: 9,
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 100 },
      2: { halign: "right", cellWidth: 30 },
      3: { halign: "right", cellWidth: 30 },
    },
  });
};

// Trial Balance Export
const exportTrialBalance = (doc: jsPDF, entries: JournalEntry[], startY: number) => {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Trial Balance", 15, startY);

  const accounts = new Map<string, { debit: number; credit: number }>();
  entries.forEach((entry) => {
    if (!accounts.has(entry.account)) {
      accounts.set(entry.account, { debit: 0, credit: 0 });
    }
    const account = accounts.get(entry.account)!;
    account.debit += entry.debit;
    account.credit += entry.credit;
  });

  const tableData = Array.from(accounts.entries()).map(([account, totals]) => [
    account,
    totals.debit.toFixed(2),
    totals.credit.toFixed(2),
  ]);

  const totalDebits = Array.from(accounts.values()).reduce((sum, a) => sum + a.debit, 0);
  const totalCredits = Array.from(accounts.values()).reduce((sum, a) => sum + a.credit, 0);

  autoTable(doc, {
    startY: startY + 12,
    head: [["Account", "Debit", "Credit"]],
    body: tableData,
    foot: [["TOTALS:", totalDebits.toFixed(2), totalCredits.toFixed(2)]],
    theme: "striped",
    headStyles: {
      fillColor: COLORS.primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    footStyles: {
      fillColor: totalDebits === totalCredits ? COLORS.success : COLORS.danger,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { halign: "right", cellWidth: 35 },
      2: { halign: "right", cellWidth: 35 },
    },
  });
};

// Profit & Loss Export
const exportProfitLoss = (doc: jsPDF, entries: JournalEntry[], startY: number) => {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Profit & Loss Statement", 15, startY);

  const revenue = entries
    .filter((e) => {
      const code = e.account.split(" - ")[0];
      return code >= "4000" && code < "5000";
    })
    .reduce((sum, e) => sum + e.credit - e.debit, 0);

  const cogs = entries
    .filter((e) => {
      const code = e.account.split(" - ")[0];
      return code >= "5000" && code < "6000";
    })
    .reduce((sum, e) => sum + e.debit - e.credit, 0);

  const expenses = entries
    .filter((e) => {
      const code = e.account.split(" - ")[0];
      return code >= "6000" && code < "8000";
    })
    .reduce((sum, e) => sum + e.debit - e.credit, 0);

  const grossProfit = revenue - cogs;
  const netIncome = grossProfit - expenses;

  const tableData = [
    ["REVENUE", "", revenue.toFixed(2)],
    ["", "", ""],
    ["COST OF GOODS SOLD", "", `(${cogs.toFixed(2)})`],
    ["", "Gross Profit", grossProfit.toFixed(2)],
    ["", "", ""],
    ["OPERATING EXPENSES", "", `(${expenses.toFixed(2)})`],
  ];

  autoTable(doc, {
    startY: startY + 12,
    body: tableData,
    foot: [["", "NET INCOME", netIncome.toFixed(2)]],
    theme: "plain",
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    footStyles: {
      fillColor: netIncome >= 0 ? COLORS.success : COLORS.danger,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 11,
    },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: "bold" },
      1: { cellWidth: 60, halign: "right", fontStyle: "bold" },
      2: { cellWidth: 40, halign: "right", fontStyle: "bold" },
    },
    didParseCell: (data) => {
      if (data.row.index === 3 || data.row.index === 1 || data.row.index === 4) {
        data.cell.styles.fillColor = COLORS.light;
      }
    },
  });
};

// Balance Sheet Export
const exportBalanceSheet = (
  doc: jsPDF,
  entries: JournalEntry[],
  openingBalances: OpeningBalanceEntry[],
  startY: number
) => {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Balance Sheet", 15, startY);

  const categorizeAccount = (accountStr: string) => {
    const code = accountStr.split(" - ")[0];
    if (code >= "1000" && code < "2000") return "asset";
    if (code >= "2000" && code < "3000") return "liability";
    if (code >= "3000" && code < "4000") return "equity";
    return "other";
  };

  const assetAccounts = new Map<string, number>();
  const liabilityAccounts = new Map<string, number>();
  const equityAccounts = new Map<string, number>();

  // Process opening balances
  openingBalances.forEach((entry) => {
    const category = categorizeAccount(entry.account);
    const balance = entry.debit - entry.credit;
    if (category === "asset") {
      assetAccounts.set(entry.account, (assetAccounts.get(entry.account) || 0) + balance);
    } else if (category === "liability") {
      liabilityAccounts.set(entry.account, (liabilityAccounts.get(entry.account) || 0) - balance);
    } else if (category === "equity") {
      equityAccounts.set(entry.account, (equityAccounts.get(entry.account) || 0) - balance);
    }
  });

  // Process current entries
  entries.forEach((entry) => {
    const category = categorizeAccount(entry.account);
    const balance = entry.debit - entry.credit;
    if (category === "asset") {
      assetAccounts.set(entry.account, (assetAccounts.get(entry.account) || 0) + balance);
    } else if (category === "liability") {
      liabilityAccounts.set(entry.account, (liabilityAccounts.get(entry.account) || 0) - balance);
    } else if (category === "equity") {
      equityAccounts.set(entry.account, (equityAccounts.get(entry.account) || 0) - balance);
    }
  });

  const totalAssets = Array.from(assetAccounts.values()).reduce((sum, v) => sum + v, 0);
  const totalLiabilities = Array.from(liabilityAccounts.values()).reduce((sum, v) => sum + v, 0);
  const totalEquity = Array.from(equityAccounts.values()).reduce((sum, v) => sum + v, 0);

  const tableData = [
    ["ASSETS", ""],
    ...Array.from(assetAccounts.entries()).map(([account, amount]) => [
      `  ${account}`,
      amount.toFixed(2),
    ]),
    ["Total Assets", totalAssets.toFixed(2)],
    ["", ""],
    ["LIABILITIES", ""],
    ...Array.from(liabilityAccounts.entries()).map(([account, amount]) => [
      `  ${account}`,
      amount.toFixed(2),
    ]),
    ["Total Liabilities", totalLiabilities.toFixed(2)],
    ["", ""],
    ["EQUITY", ""],
    ...Array.from(equityAccounts.entries()).map(([account, amount]) => [
      `  ${account}`,
      amount.toFixed(2),
    ]),
    ["Total Equity", totalEquity.toFixed(2)],
  ];

  autoTable(doc, {
    startY: startY + 12,
    body: tableData,
    foot: [["Total Liabilities + Equity", (totalLiabilities + totalEquity).toFixed(2)]],
    theme: "plain",
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    footStyles: {
      fillColor: COLORS.primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 130 },
      1: { cellWidth: 50, halign: "right", fontStyle: "bold" },
    },
    didParseCell: (data) => {
      const text = data.cell.text[0];
      if (text === "ASSETS" || text === "LIABILITIES" || text === "EQUITY") {
        data.cell.styles.fillColor = COLORS.light;
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fontSize = 10;
      } else if (text.startsWith("Total")) {
        data.cell.styles.fillColor = COLORS.light;
        data.cell.styles.fontStyle = "bold";
      }
    },
  });
};

// Chart of Accounts Export
const exportChartOfAccounts = (doc: jsPDF, entries: JournalEntry[], startY: number) => {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Chart of Accounts", 15, startY);

  const accountsUsed = new Set(entries.map((e) => e.account));
  const tableData = Array.from(accountsUsed).map((account) => {
    const code = account.split(" - ")[0];
    const name = account.split(" - ")[1] || account;
    let type = "Other";
    if (code >= "1000" && code < "2000") type = "Asset";
    else if (code >= "2000" && code < "3000") type = "Liability";
    else if (code >= "3000" && code < "4000") type = "Equity";
    else if (code >= "4000" && code < "5000") type = "Revenue";
    else if (code >= "5000" && code < "8000") type = "Expense";

    return [code, name, type];
  });

  autoTable(doc, {
    startY: startY + 12,
    head: [["Code", "Account Name", "Type"]],
    body: tableData.sort((a, b) => a[0].localeCompare(b[0])),
    theme: "striped",
    headStyles: {
      fillColor: COLORS.primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 25, fontStyle: "bold" },
      1: { cellWidth: 120 },
      2: { cellWidth: 35, halign: "center" },
    },
  });
};
