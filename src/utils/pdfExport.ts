import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { JournalEntry, OpeningBalanceEntry } from "@/types";

interface PDFExportOptions {
  journalEntries: JournalEntry[];
  openingBalances: OpeningBalanceEntry[];
  activeView: string;
}

// Minimalist monochrome color scheme matching app aesthetic
const COLORS = {
  black: [0, 0, 0] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  lightGray: [248, 250, 252] as [number, number, number],
  mediumGray: [226, 232, 240] as [number, number, number],
  darkGray: [100, 100, 100] as [number, number, number],
};

export const exportToPDF = (options: PDFExportOptions) => {
  const { journalEntries, openingBalances, activeView } = options;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Minimalist Header
  doc.setFillColor(...COLORS.black);
  doc.rect(0, 0, pageWidth, 30, "F");

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(20);
  doc.setFont("courier", "bold");
  doc.text("CYNCO ACCOUNTING", 15, 15);

  doc.setFontSize(9);
  doc.setFont("courier", "normal");
  const viewNames: Record<string, string> = {
    journal: "JOURNAL ENTRIES",
    opening: "OPENING BALANCES",
    trial: "TRIAL BALANCE",
    pl: "PROFIT & LOSS STATEMENT",
    balance: "BALANCE SHEET",
    coa: "CHART OF ACCOUNTS",
    ledger: "GENERAL LEDGER",
  };
  doc.text(viewNames[activeView] || "FINANCIAL REPORT", 15, 22);

  // Date
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  
  doc.setFontSize(8);
  doc.text(dateStr, pageWidth - 15, 18, { align: "right" });

  let yPosition = 40;

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
    case "ledger":
      exportLedger(doc, journalEntries, yPosition);
      break;
    case "coa":
      exportChartOfAccounts(doc, journalEntries, yPosition);
      break;
    default:
      exportJournalEntries(doc, journalEntries, yPosition);
  }

  // Minimalist Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.darkGray);
    doc.setDrawColor(...COLORS.mediumGray);
    doc.line(15, pageHeight - 12, pageWidth - 15, pageHeight - 12);
    doc.text(
      `Cynco Accounting System | Confidential`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
    doc.text(`${i}`, pageWidth - 15, pageHeight - 8, { align: "right" });
  }

  // Save the PDF
  const fileName = `Cynco_${viewNames[activeView]?.replace(/ /g, "_") || "Report"}_${dateStr.replace(/ /g, "_")}.pdf`;
  doc.save(fileName);
};

// Journal Entries Export - Matches app display exactly
const exportJournalEntries = (doc: jsPDF, entries: JournalEntry[], startY: number) => {
  const tableData = entries.map((entry) => [
    entry.date,
    entry.reference,
    entry.account,
    entry.description,
    entry.debit > 0 ? entry.debit.toFixed(2) : "—",
    entry.credit > 0 ? entry.credit.toFixed(2) : "—",
  ]);

  const totalDebits = entries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredits = entries.reduce((sum, e) => sum + e.credit, 0);

  autoTable(doc, {
    startY: startY,
    head: [["Date", "Reference", "Account", "Description", "Debit", "Credit"]],
    body: tableData,
    foot: [["", "", "", "TOTALS:", totalDebits.toFixed(2), totalCredits.toFixed(2)]],
    theme: "plain",
    headStyles: {
      fillColor: COLORS.black,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 8,
      cellPadding: 3,
    },
    footStyles: {
      fillColor: COLORS.lightGray,
      textColor: COLORS.black,
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 3,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      font: "courier",
      lineColor: COLORS.mediumGray,
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 24 },
      2: { cellWidth: 48 },
      3: { cellWidth: 42 },
      4: { halign: "right", cellWidth: 22 },
      5: { halign: "right", cellWidth: 22 },
    },
    alternateRowStyles: {
      fillColor: COLORS.lightGray,
    },
  });
};

// Opening Balances Export - Matches app display exactly
const exportOpeningBalances = (doc: jsPDF, balances: OpeningBalanceEntry[], startY: number) => {
  const tableData = balances.map((entry) => [
    entry.account,
    entry.debit > 0 ? entry.debit.toFixed(2) : "—",
    entry.credit > 0 ? entry.credit.toFixed(2) : "—",
    entry.date,
  ]);

  const totalDebits = balances.reduce((sum, e) => sum + e.debit, 0);
  const totalCredits = balances.reduce((sum, e) => sum + e.credit, 0);

  autoTable(doc, {
    startY: startY,
    head: [["Account", "Debit", "Credit", "Date"]],
    body: tableData,
    foot: [["TOTALS:", totalDebits.toFixed(2), totalCredits.toFixed(2), ""]],
    theme: "plain",
    headStyles: {
      fillColor: COLORS.black,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 8,
      cellPadding: 3,
    },
    footStyles: {
      fillColor: COLORS.lightGray,
      textColor: COLORS.black,
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 3,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      font: "courier",
      lineColor: COLORS.mediumGray,
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { halign: "right", cellWidth: 28 },
      2: { halign: "right", cellWidth: 28 },
      3: { cellWidth: 24 },
    },
    alternateRowStyles: {
      fillColor: COLORS.lightGray,
    },
  });
};

// Trial Balance Export - Matches app display exactly
const exportTrialBalance = (doc: jsPDF, entries: JournalEntry[], startY: number) => {
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
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  autoTable(doc, {
    startY: startY,
    head: [["Account", "Debit", "Credit"]],
    body: tableData,
    foot: [["TOTALS:", totalDebits.toFixed(2), totalCredits.toFixed(2)]],
    theme: "plain",
    headStyles: {
      fillColor: COLORS.black,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 8,
      cellPadding: 3,
    },
    footStyles: {
      fillColor: isBalanced ? COLORS.black : COLORS.lightGray,
      textColor: isBalanced ? COLORS.white : COLORS.black,
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 3,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      font: "courier",
      lineColor: COLORS.mediumGray,
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { cellWidth: 110 },
      1: { halign: "right", cellWidth: 40 },
      2: { halign: "right", cellWidth: 40 },
    },
    alternateRowStyles: {
      fillColor: COLORS.lightGray,
    },
  });

  // Add balance status below table
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(9);
  doc.setFont("courier", isBalanced ? "bold" : "normal");
  doc.setTextColor(...COLORS.black);
  doc.text(
    isBalanced ? "✓ Books are balanced" : "✗ Books are out of balance",
    doc.internal.pageSize.getWidth() / 2,
    finalY,
    { align: "center" }
  );
};

// Profit & Loss Export - Matches app display exactly with breakdown by account
const exportProfitLoss = (doc: jsPDF, entries: JournalEntry[], startY: number) => {
  const revenueAccounts = new Map<string, number>();
  const cogsAccounts = new Map<string, number>();
  const expenseAccounts = new Map<string, number>();

  entries.forEach((entry) => {
    const code = entry.account.split(" - ")[0];
    const balance = entry.debit - entry.credit;
    
    if (code >= "4000" && code < "5000") {
      revenueAccounts.set(entry.account, (revenueAccounts.get(entry.account) || 0) - balance);
    } else if (code >= "5000" && code < "6000") {
      cogsAccounts.set(entry.account, (cogsAccounts.get(entry.account) || 0) + balance);
    } else if (code >= "6000" && code < "8000") {
      expenseAccounts.set(entry.account, (expenseAccounts.get(entry.account) || 0) + balance);
    }
  });

  const revenue = Array.from(revenueAccounts.values()).reduce((sum, v) => sum + v, 0);
  const cogs = Array.from(cogsAccounts.values()).reduce((sum, v) => sum + v, 0);
  const expenses = Array.from(expenseAccounts.values()).reduce((sum, v) => sum + v, 0);
  const grossProfit = revenue - cogs;
  const netIncome = grossProfit - expenses;

  const tableData: any[] = [];
  
  // Revenue section
  tableData.push([{ content: "REVENUE", styles: { fontStyle: "bold", fillColor: COLORS.lightGray } }, ""]);
  Array.from(revenueAccounts.entries()).forEach(([account, amount]) => {
    tableData.push([`  ${account}`, amount.toFixed(2)]);
  });
  tableData.push([{ content: "Total Revenue:", styles: { fontStyle: "bold" } }, { content: revenue.toFixed(2), styles: { fontStyle: "bold" } }]);
  
  if (cogsAccounts.size > 0) {
    tableData.push(["", ""]);
    tableData.push([{ content: "COST OF GOODS SOLD", styles: { fontStyle: "bold", fillColor: COLORS.lightGray } }, ""]);
    Array.from(cogsAccounts.entries()).forEach(([account, amount]) => {
      tableData.push([`  ${account}`, `(${amount.toFixed(2)})`]);
    });
    tableData.push([{ content: "Total COGS:", styles: { fontStyle: "bold" } }, { content: `(${cogs.toFixed(2)})`, styles: { fontStyle: "bold" } }]);
    tableData.push([{ content: "Gross Profit:", styles: { fontStyle: "bold", fillColor: COLORS.lightGray } }, { content: grossProfit.toFixed(2), styles: { fontStyle: "bold" } }]);
  }
  
  tableData.push(["", ""]);
  tableData.push([{ content: "OPERATING EXPENSES", styles: { fontStyle: "bold", fillColor: COLORS.lightGray } }, ""]);
  Array.from(expenseAccounts.entries()).forEach(([account, amount]) => {
    tableData.push([`  ${account}`, `(${amount.toFixed(2)})`]);
  });
  tableData.push([{ content: "Total Operating Expenses:", styles: { fontStyle: "bold" } }, { content: `(${expenses.toFixed(2)})`, styles: { fontStyle: "bold" } }]);

  autoTable(doc, {
    startY: startY,
    body: tableData,
    foot: [[{ content: "NET INCOME:", styles: { fontStyle: "bold" } }, { content: netIncome.toFixed(2), styles: { fontStyle: "bold" } }]],
    theme: "plain",
    footStyles: {
      fillColor: COLORS.black,
      textColor: COLORS.white,
      fontSize: 10,
      cellPadding: 4,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      font: "courier",
      lineColor: COLORS.mediumGray,
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { cellWidth: 130 },
      1: { halign: "right", cellWidth: 50 },
    },
  });

  // Add profit margin below
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const profitMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;
  doc.setFontSize(8);
  doc.setFont("courier", "normal");
  doc.setTextColor(...COLORS.darkGray);
  doc.text(
    `Profit Margin: ${profitMargin.toFixed(1)}%`,
    doc.internal.pageSize.getWidth() / 2,
    finalY,
    { align: "center" }
  );
};

// Balance Sheet Export - Matches app display exactly with opening balances
const exportBalanceSheet = (
  doc: jsPDF,
  entries: JournalEntry[],
  openingBalances: OpeningBalanceEntry[],
  startY: number
) => {
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
  const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01;

  const tableData: any[] = [];
  
  // Assets
  tableData.push([{ content: "ASSETS", styles: { fontStyle: "bold", fillColor: COLORS.lightGray } }, ""]);
  Array.from(assetAccounts.entries()).forEach(([account, amount]) => {
    tableData.push([`  ${account}`, amount.toFixed(2)]);
  });
  tableData.push([{ content: "Total Assets", styles: { fontStyle: "bold", fillColor: COLORS.black, textColor: COLORS.white } }, { content: totalAssets.toFixed(2), styles: { fontStyle: "bold", fillColor: COLORS.black, textColor: COLORS.white } }]);
  
  tableData.push(["", ""]);
  
  // Liabilities
  tableData.push([{ content: "LIABILITIES", styles: { fontStyle: "bold", fillColor: COLORS.lightGray } }, ""]);
  Array.from(liabilityAccounts.entries()).forEach(([account, amount]) => {
    tableData.push([`  ${account}`, amount.toFixed(2)]);
  });
  tableData.push([{ content: "Total Liabilities", styles: { fontStyle: "bold" } }, { content: totalLiabilities.toFixed(2), styles: { fontStyle: "bold" } }]);
  
  tableData.push(["", ""]);
  
  // Equity
  tableData.push([{ content: "EQUITY", styles: { fontStyle: "bold", fillColor: COLORS.lightGray } }, ""]);
  Array.from(equityAccounts.entries()).forEach(([account, amount]) => {
    tableData.push([`  ${account}`, amount.toFixed(2)]);
  });
  tableData.push([{ content: "Total Equity", styles: { fontStyle: "bold" } }, { content: totalEquity.toFixed(2), styles: { fontStyle: "bold" } }]);

  autoTable(doc, {
    startY: startY,
    body: tableData,
    foot: [[{ content: "Total Liabilities + Equity", styles: { fontStyle: "bold" } }, { content: (totalLiabilities + totalEquity).toFixed(2), styles: { fontStyle: "bold" } }]],
    theme: "plain",
    footStyles: {
      fillColor: COLORS.black,
      textColor: COLORS.white,
      fontSize: 9,
      cellPadding: 4,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      font: "courier",
      lineColor: COLORS.mediumGray,
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { cellWidth: 130 },
      1: { cellWidth: 50, halign: "right" },
    },
  });

  // Balance equation check
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(9);
  doc.setFont("courier", "bold");
  doc.setTextColor(...COLORS.black);
  doc.text(
    isBalanced ? "✓ Assets = Liabilities + Equity (Balanced)" : "✗ Books are out of balance",
    doc.internal.pageSize.getWidth() / 2,
    finalY,
    { align: "center" }
  );
};

// Ledger Export - Account-by-account breakdown
const exportLedger = (doc: jsPDF, entries: JournalEntry[], startY: number) => {
  const ledgerMap = new Map<string, { date: string; description: string; debit: number; credit: number; balance: number }[]>();

  entries.forEach((entry) => {
    if (!ledgerMap.has(entry.account)) {
      ledgerMap.set(entry.account, []);
    }
    const ledger = ledgerMap.get(entry.account)!;
    const prevBalance = ledger.length > 0 ? ledger[ledger.length - 1].balance : 0;
    const balance = prevBalance + entry.debit - entry.credit;
    
    ledger.push({
      date: entry.date,
      description: entry.description,
      debit: entry.debit,
      credit: entry.credit,
      balance,
    });
  });

  let currentY = startY;

  Array.from(ledgerMap.entries()).forEach(([account, accountEntries], index) => {
    if (index > 0) {
      currentY = (doc as any).lastAutoTable.finalY + 15;
      if (currentY > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        currentY = 20;
      }
    }

    // Account header
    doc.setFillColor(...COLORS.black);
    doc.rect(15, currentY, doc.internal.pageSize.getWidth() - 30, 8, "F");
    doc.setTextColor(...COLORS.white);
    doc.setFontSize(9);
    doc.setFont("courier", "bold");
    doc.text(account, 17, currentY + 5);

    const tableData = accountEntries.map((entry) => [
      entry.date,
      entry.description,
      entry.debit > 0 ? entry.debit.toFixed(2) : "—",
      entry.credit > 0 ? entry.credit.toFixed(2) : "—",
      entry.balance.toFixed(2),
    ]);

    autoTable(doc, {
      startY: currentY + 10,
      head: [["Date", "Description", "Debit", "Credit", "Balance"]],
      body: tableData,
      theme: "plain",
      headStyles: {
        fillColor: COLORS.lightGray,
        textColor: COLORS.black,
        fontStyle: "bold",
        fontSize: 7,
        cellPadding: 2,
      },
      styles: {
        fontSize: 7,
        cellPadding: 2,
        font: "courier",
        lineColor: COLORS.mediumGray,
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 80 },
        2: { halign: "right", cellWidth: 25 },
        3: { halign: "right", cellWidth: 25 },
        4: { halign: "right", cellWidth: 28, fontStyle: "bold" },
      },
      alternateRowStyles: {
        fillColor: COLORS.lightGray,
      },
    });
  });
};

// Chart of Accounts Export
const exportChartOfAccounts = (doc: jsPDF, entries: JournalEntry[], startY: number) => {
  const accountsUsed = new Set(entries.map((e) => e.account));
  const tableData = Array.from(accountsUsed).map((account) => {
    const code = account.split(" - ")[0];
    const name = account.split(" - ").slice(1).join(" - ") || account;
    let type = "Other";
    if (code >= "1000" && code < "2000") type = "Asset";
    else if (code >= "2000" && code < "3000") type = "Liability";
    else if (code >= "3000" && code < "4000") type = "Equity";
    else if (code >= "4000" && code < "5000") type = "Revenue";
    else if (code >= "5000" && code < "8000") type = "Expense";

    return [code, name, type];
  });

  autoTable(doc, {
    startY: startY,
    head: [["Code", "Account Name", "Type"]],
    body: tableData.sort((a, b) => a[0].localeCompare(b[0])),
    theme: "plain",
    headStyles: {
      fillColor: COLORS.black,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 8,
      cellPadding: 3,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      font: "courier",
      lineColor: COLORS.mediumGray,
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { cellWidth: 25, fontStyle: "bold" },
      1: { cellWidth: 120 },
      2: { cellWidth: 35, halign: "center" },
    },
    alternateRowStyles: {
      fillColor: COLORS.lightGray,
    },
  });
};
