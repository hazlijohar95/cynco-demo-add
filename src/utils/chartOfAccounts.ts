export interface COAAccount {
  code: string;
  name: string;
  type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";
  parentCode?: string;
  isParent: boolean;
  description?: string;
}

// Standard Chart of Accounts based on accounting principles
export const CHART_OF_ACCOUNTS: COAAccount[] = [
  // === ASSETS (1000-1999) ===
  // Current Assets (1000-1099)
  { code: "1000", name: "Assets", type: "Asset", isParent: true, description: "All company assets" },
  { code: "1010", name: "Current Assets", type: "Asset", parentCode: "1000", isParent: true, description: "Assets convertible to cash within one year" },
  { code: "1011", name: "Cash", type: "Asset", parentCode: "1010", isParent: false, description: "Cash on hand and in bank" },
  { code: "1012", name: "Petty Cash", type: "Asset", parentCode: "1010", isParent: false, description: "Small cash fund for minor expenses" },
  { code: "1020", name: "Accounts Receivable", type: "Asset", parentCode: "1010", isParent: false, description: "Money owed by customers" },
  { code: "1030", name: "Inventory", type: "Asset", parentCode: "1010", isParent: false, description: "Goods available for sale" },
  { code: "1040", name: "Prepaid Expenses", type: "Asset", parentCode: "1010", isParent: false, description: "Expenses paid in advance" },
  
  // Fixed Assets (1100-1199)
  { code: "1100", name: "Fixed Assets", type: "Asset", parentCode: "1000", isParent: true, description: "Long-term tangible assets" },
  { code: "1110", name: "Office Equipment", type: "Asset", parentCode: "1100", isParent: false, description: "Computers, furniture, machinery" },
  { code: "1120", name: "Vehicles", type: "Asset", parentCode: "1100", isParent: false, description: "Company vehicles" },
  { code: "1130", name: "Buildings", type: "Asset", parentCode: "1100", isParent: false, description: "Real estate properties" },
  { code: "1140", name: "Accumulated Depreciation", type: "Asset", parentCode: "1100", isParent: false, description: "Total depreciation of fixed assets" },

  // === LIABILITIES (2000-2999) ===
  // Current Liabilities (2000-2099)
  { code: "2000", name: "Liabilities", type: "Liability", isParent: true, description: "All company liabilities" },
  { code: "2010", name: "Current Liabilities", type: "Liability", parentCode: "2000", isParent: true, description: "Obligations due within one year" },
  { code: "2011", name: "Accounts Payable", type: "Liability", parentCode: "2010", isParent: false, description: "Money owed to suppliers" },
  { code: "2020", name: "Accrued Expenses", type: "Liability", parentCode: "2010", isParent: false, description: "Expenses incurred but not yet paid" },
  { code: "2030", name: "Sales Tax Payable", type: "Liability", parentCode: "2010", isParent: false, description: "Sales tax collected from customers" },
  { code: "2040", name: "Payroll Tax Payable", type: "Liability", parentCode: "2010", isParent: false, description: "Taxes withheld from employee wages" },
  
  // Long-term Liabilities (2100-2199)
  { code: "2100", name: "Long-term Liabilities", type: "Liability", parentCode: "2000", isParent: true, description: "Obligations due after one year" },
  { code: "2110", name: "Bank Loan", type: "Liability", parentCode: "2100", isParent: false, description: "Long-term loans from banks" },
  { code: "2120", name: "Mortgage Payable", type: "Liability", parentCode: "2100", isParent: false, description: "Real estate mortgages" },

  // === EQUITY (3000-3999) ===
  { code: "3000", name: "Equity", type: "Equity", isParent: true, description: "Owner's equity and retained earnings" },
  { code: "3010", name: "Owner's Capital", type: "Equity", parentCode: "3000", isParent: false, description: "Initial and additional capital invested" },
  { code: "3020", name: "Owner's Drawings", type: "Equity", parentCode: "3000", isParent: false, description: "Money withdrawn by owner" },
  { code: "3030", name: "Retained Earnings", type: "Equity", parentCode: "3000", isParent: false, description: "Accumulated profits" },

  // === REVENUE (4000-4999) ===
  { code: "4000", name: "Revenue", type: "Revenue", isParent: true, description: "All income sources" },
  { code: "4010", name: "Service Revenue", type: "Revenue", parentCode: "4000", isParent: false, description: "Income from services provided" },
  { code: "4020", name: "Product Sales", type: "Revenue", parentCode: "4000", isParent: false, description: "Income from product sales" },
  { code: "4030", name: "Interest Income", type: "Revenue", parentCode: "4000", isParent: false, description: "Interest earned on investments" },
  { code: "4040", name: "Other Income", type: "Revenue", parentCode: "4000", isParent: false, description: "Miscellaneous income" },

  // === COST OF GOODS SOLD (5000-5999) ===
  { code: "5000", name: "Cost of Goods Sold", type: "Expense", isParent: true, description: "Direct costs of producing goods/services" },
  { code: "5010", name: "Materials", type: "Expense", parentCode: "5000", isParent: false, description: "Raw materials and supplies" },
  { code: "5020", name: "Direct Labor", type: "Expense", parentCode: "5000", isParent: false, description: "Wages for production staff" },
  { code: "5030", name: "Shipping & Delivery", type: "Expense", parentCode: "5000", isParent: false, description: "Costs to deliver products" },

  // === OPERATING EXPENSES (6000-6999) ===
  { code: "6000", name: "Operating Expenses", type: "Expense", isParent: true, description: "Ongoing business expenses" },
  
  // Payroll (6100-6199)
  { code: "6100", name: "Payroll Expenses", type: "Expense", parentCode: "6000", isParent: true, description: "All employee-related costs" },
  { code: "6110", name: "Salaries & Wages", type: "Expense", parentCode: "6100", isParent: false, description: "Employee compensation" },
  { code: "6120", name: "Payroll Taxes", type: "Expense", parentCode: "6100", isParent: false, description: "Employer portion of payroll taxes" },
  { code: "6130", name: "Employee Benefits", type: "Expense", parentCode: "6100", isParent: false, description: "Health insurance, retirement plans" },
  
  // Facilities (6200-6299)
  { code: "6200", name: "Facilities Expenses", type: "Expense", parentCode: "6000", isParent: true, description: "Office and building costs" },
  { code: "6210", name: "Rent Expense", type: "Expense", parentCode: "6200", isParent: false, description: "Office or building rent" },
  { code: "6220", name: "Utilities", type: "Expense", parentCode: "6200", isParent: false, description: "Electricity, water, internet" },
  { code: "6230", name: "Property Tax", type: "Expense", parentCode: "6200", isParent: false, description: "Real estate taxes" },
  { code: "6240", name: "Repairs & Maintenance", type: "Expense", parentCode: "6200", isParent: false, description: "Building maintenance costs" },
  
  // Office & Admin (6300-6399)
  { code: "6300", name: "Office & Administrative", type: "Expense", parentCode: "6000", isParent: true, description: "General office expenses" },
  { code: "6310", name: "Office Supplies", type: "Expense", parentCode: "6300", isParent: false, description: "Stationery, printer supplies" },
  { code: "6320", name: "Software & Subscriptions", type: "Expense", parentCode: "6300", isParent: false, description: "Software licenses and SaaS" },
  { code: "6330", name: "Telephone & Internet", type: "Expense", parentCode: "6300", isParent: false, description: "Communication costs" },
  { code: "6340", name: "Postage & Shipping", type: "Expense", parentCode: "6300", isParent: false, description: "Mailing and shipping costs" },
  
  // Professional Services (6400-6499)
  { code: "6400", name: "Professional Services", type: "Expense", parentCode: "6000", isParent: true, description: "External professional fees" },
  { code: "6410", name: "Legal Fees", type: "Expense", parentCode: "6400", isParent: false, description: "Attorney and legal services" },
  { code: "6420", name: "Accounting Fees", type: "Expense", parentCode: "6400", isParent: false, description: "Bookkeeping and audit fees" },
  { code: "6430", name: "Consulting Fees", type: "Expense", parentCode: "6400", isParent: false, description: "Business consulting services" },
  
  // Marketing & Sales (6500-6599)
  { code: "6500", name: "Marketing & Sales", type: "Expense", parentCode: "6000", isParent: true, description: "Marketing and advertising costs" },
  { code: "6510", name: "Advertising", type: "Expense", parentCode: "6500", isParent: false, description: "Online and offline ads" },
  { code: "6520", name: "Marketing Materials", type: "Expense", parentCode: "6500", isParent: false, description: "Brochures, business cards" },
  { code: "6530", name: "Website & SEO", type: "Expense", parentCode: "6500", isParent: false, description: "Website hosting and optimization" },
  
  // Travel & Entertainment (6600-6699)
  { code: "6600", name: "Travel & Entertainment", type: "Expense", parentCode: "6000", isParent: true, description: "Business travel costs" },
  { code: "6610", name: "Travel Expenses", type: "Expense", parentCode: "6600", isParent: false, description: "Flights, hotels, transportation" },
  { code: "6620", name: "Meals & Entertainment", type: "Expense", parentCode: "6600", isParent: false, description: "Business meals and client entertainment" },
  
  // Other Expenses (6900-6999)
  { code: "6900", name: "Other Operating Expenses", type: "Expense", parentCode: "6000", isParent: true, description: "Miscellaneous operating costs" },
  { code: "6910", name: "Insurance", type: "Expense", parentCode: "6900", isParent: false, description: "Business insurance premiums" },
  { code: "6920", name: "Bank Fees", type: "Expense", parentCode: "6900", isParent: false, description: "Banking service charges" },
  { code: "6930", name: "Depreciation Expense", type: "Expense", parentCode: "6900", isParent: false, description: "Asset depreciation" },
  { code: "6940", name: "Bad Debt Expense", type: "Expense", parentCode: "6900", isParent: false, description: "Uncollectible accounts" },

  // === OTHER INCOME/EXPENSES (7000-7999) ===
  { code: "7000", name: "Other Income & Expenses", type: "Expense", isParent: true, description: "Non-operating items" },
  { code: "7010", name: "Interest Expense", type: "Expense", parentCode: "7000", isParent: false, description: "Interest on loans and debt" },
  { code: "7020", name: "Loss on Asset Disposal", type: "Expense", parentCode: "7000", isParent: false, description: "Loss from selling assets" },
  { code: "7030", name: "Gain on Asset Disposal", type: "Revenue", parentCode: "7000", isParent: false, description: "Gain from selling assets" },
];

// Helper function to get account by code
export const getAccountByCode = (code: string): COAAccount | undefined => {
  return CHART_OF_ACCOUNTS.find(acc => acc.code === code);
};

// Helper function to get account by name (for backward compatibility)
export const getAccountByName = (name: string): COAAccount | undefined => {
  return CHART_OF_ACCOUNTS.find(acc => 
    acc.name.toLowerCase() === name.toLowerCase()
  );
};

// Helper function to get all sub-accounts of a parent
export const getSubAccounts = (parentCode: string): COAAccount[] => {
  return CHART_OF_ACCOUNTS.filter(acc => acc.parentCode === parentCode);
};

// Helper function to get account hierarchy
export const getAccountHierarchy = (code: string): string => {
  const account = getAccountByCode(code);
  if (!account) return "";
  
  if (!account.parentCode) return account.name;
  
  const parent = getAccountByCode(account.parentCode);
  if (!parent) return account.name;
  
  return `${getAccountHierarchy(account.parentCode)} > ${account.name}`;
};

// Helper function to get account options for dropdowns
export const getAccountOptions = (): string[] => {
  return CHART_OF_ACCOUNTS
    .filter(acc => !acc.isParent) // Only show leaf accounts, not parent categories
    .map(acc => `${acc.code} - ${acc.name}`);
};
