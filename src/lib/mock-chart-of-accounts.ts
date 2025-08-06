import { LedgerAccount } from "./types";

export interface AccountCategory {
  id: string;
  name: string;
  subcategories?: AccountCategory[];
  accounts?: LedgerAccount[];
}

export const mockChartOfAccounts: AccountCategory[] = [
  {
    id: "1000",
    name: "Assets",
    subcategories: [
      {
        id: "1100",
        name: "Current Assets",
        accounts: [
          { id: "1110", code: "1110", name: "Cash", category: "Current Assets" },
          { id: "1120", code: "1120", name: "Accounts Receivable", category: "Current Assets" },
          { id: "1130", code: "1130", name: "Inventory", category: "Current Assets" },
          { id: "1140", code: "1140", name: "Prepaid Expenses", category: "Current Assets" },
        ],
      },
      {
        id: "1200",
        name: "Non-Current Assets",
        accounts: [
          { id: "1210", code: "1210", name: "Property, Plant, and Equipment", category: "Non-Current Assets" },
          { id: "1220", code: "1225", name: "Accumulated Depreciation", category: "Non-Current Assets" },
          { id: "1230", code: "1230", name: "Long-Term Investments", category: "Non-Current Assets" },
        ],
      },
    ],
  },
  {
    id: "2000",
    name: "Liabilities",
    subcategories: [
      {
        id: "2100",
        name: "Current Liabilities",
        accounts: [
          { id: "2110", code: "2110", name: "Accounts Payable", category: "Current Liabilities" },
          { id: "2120", code: "2120", name: "Salaries Payable", category: "Current Liabilities" },
          { id: "2130", code: "2130", name: "Unearned Revenue", category: "Current Liabilities" },
        ],
      },
      {
        id: "2200",
        name: "Non-Current Liabilities",
        accounts: [
          { id: "2210", code: "2210", name: "Long-Term Debt", category: "Non-Current Liabilities" },
        ],
      },
    ],
  },
  {
    id: "3000",
    name: "Equity",
    accounts: [
      { id: "3100", code: "3100", name: "Owner's Equity", category: "Equity" },
      { id: "3200", code: "3200", name: "Retained Earnings", category: "Equity" },
    ],
  },
  {
    id: "4000",
    name: "Revenue",
    accounts: [
      { id: "4100", code: "4100", name: "Sales Revenue", category: "Revenue" },
      { id: "4200", code: "4200", name: "Service Revenue", category: "Revenue" },
    ],
  },
  {
    id: "5000",
    name: "Expenses",
    subcategories: [
      {
        id: "5100",
        name: "Operating Expenses",
        accounts: [
          { id: "5110", code: "5110", name: "Salaries Expense", category: "Operating Expenses" },
          { id: "5120", code: "5120", name: "Rent Expense", category: "Operating Expenses" },
          { id: "5130", code: "5130", name: "Utilities Expense", category: "Operating Expenses" },
          { id: "5140", code: "5140", name: "Supplies Expense", category: "Operating Expenses" },
          { id: "5150", code: "5150", name: "Depreciation Expense", category: "Operating Expenses" },
        ],
      },
      {
        id: "5200",
        name: "Other Expenses",
        accounts: [
          { id: "5210", code: "5210", name: "Interest Expense", category: "Other Expenses" },
        ],
      },
    ],
  },
];