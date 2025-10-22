import { getAccountByCode, getAccountByName } from "./chartOfAccounts";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

export const validateAccount = (account: string): ValidationResult => {
  if (!account || account.trim() === "") {
    return { isValid: false, error: "Account is required" };
  }

  // Extract code from "1011 - Cash" format
  const code = account.split("-")[0].trim();
  const accountData = getAccountByCode(code);

  if (!accountData) {
    return { isValid: false, error: "Account not found in chart of accounts" };
  }

  if (accountData.isParent) {
    return { isValid: false, error: "Cannot use parent account. Select a sub-account." };
  }

  return { isValid: true };
};

export const validateAmount = (amount: number, fieldName: string = "Amount"): ValidationResult => {
  if (amount < 0) {
    return { isValid: false, error: `${fieldName} cannot be negative` };
  }

  if (amount === 0) {
    return { isValid: true, warning: `${fieldName} is zero` };
  }

  if (amount > 1000000) {
    return { isValid: true, warning: `${fieldName} is unusually large` };
  }

  return { isValid: true };
};

export const validateDate = (dateStr: string): ValidationResult => {
  if (!dateStr || dateStr.trim() === "") {
    return { isValid: false, error: "Date is required" };
  }

  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(date.getTime())) {
    return { isValid: false, error: "Invalid date format" };
  }

  if (date > today) {
    return { isValid: false, error: "Date cannot be in the future" };
  }

  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  if (date < twoYearsAgo) {
    return { isValid: true, warning: "Date is more than 2 years ago" };
  }

  return { isValid: true };
};

export const validateReference = (reference: string): ValidationResult => {
  if (!reference || reference.trim() === "") {
    return { isValid: true, warning: "Reference is empty" };
  }

  return { isValid: true };
};

export const validateJournalEntry = (entry: {
  date: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
  reference: string;
}) => {
  const results = {
    date: validateDate(entry.date),
    account: validateAccount(entry.account),
    debit: validateAmount(entry.debit, "Debit"),
    credit: validateAmount(entry.credit, "Credit"),
    reference: validateReference(entry.reference),
  };

  // Check if both debit and credit have values
  if (entry.debit > 0 && entry.credit > 0) {
    results.debit = { isValid: false, error: "Entry cannot have both debit and credit" };
  }

  // Check if neither debit nor credit have values
  if (entry.debit === 0 && entry.credit === 0) {
    results.debit = { isValid: false, error: "Entry must have either debit or credit" };
  }

  const hasError = Object.values(results).some(r => !r.isValid);
  const hasWarning = Object.values(results).some(r => r.warning);

  return { results, hasError, hasWarning };
};

export const checkForDuplicates = (
  entries: Array<{ date: string; account: string; debit: number; credit: number; description: string }>,
  currentEntry: { date: string; account: string; debit: number; credit: number; description: string },
  currentId?: string
): boolean => {
  return entries.some((entry: any) => 
    entry.id !== currentId &&
    entry.date === currentEntry.date &&
    entry.account === currentEntry.account &&
    entry.debit === currentEntry.debit &&
    entry.credit === currentEntry.credit &&
    entry.description === currentEntry.description
  );
};
