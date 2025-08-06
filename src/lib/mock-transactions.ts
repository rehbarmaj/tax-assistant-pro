import { mockChartOfAccounts } from "./mock-chart-of-accounts";

interface MockTransaction {
  id: string;
  date: string;
  accountId: string;
  type: "Debit" | "Credit";
  amount: number;
  description: string;
}

// Helper function to get a random ledger account ID
const getRandomLedgerAccountId = (): string => {
  const allLedgerAccounts = mockChartOfAccounts.flatMap(category =>
    category.subcategories.flatMap(subcategory => subcategory.accounts)
  );
  const randomIndex = Math.floor(Math.random() * allLedgerAccounts.length);
  return allLedgerAccounts[randomIndex].id;
};

export const mockTransactions: MockTransaction[] = [
  // Month 1
  {
    id: "txn-001",
    date: "2023-10-15",
    accountId: getRandomLedgerAccountId(),
    type: "Debit",
    amount: 1500.00,
    description: "Initial investment",
  },
  {
    id: "txn-002",
    date: "2023-10-20",
    accountId: getRandomLedgerAccountId(),
    type: "Credit",
    amount: 500.00,
    description: "Rent payment",
  },
  {
    id: "txn-003",
    date: "2023-10-25",
    accountId: getRandomLedgerAccountId(),
    type: "Debit",
    amount: 250.75,
    description: "Office supplies purchase",
  },
  // Month 2
  {
    id: "txn-004",
    date: "2023-11-05",
    accountId: getRandomLedgerAccountId(),
    type: "Credit",
    amount: 1200.00,
    description: "Consulting services revenue",
  },
  {
    id: "txn-005",
    date: "2023-11-10",
    accountId: getRandomLedgerAccountId(),
    type: "Debit",
    amount: 300.00,
    description: "Travel expenses",
  },
  {
    id: "txn-006",
    date: "2023-11-18",
    accountId: getRandomLedgerAccountId(),
    type: "Credit",
    amount: 800.00,
    description: "Product sales",
  },
  // Month 3
  {
    id: "txn-007",
    date: "2023-12-01",
    accountId: getRandomLedgerAccountId(),
    type: "Debit",
    amount: 450.00,
    description: "Marketing costs",
  },
  {
    id: "txn-008",
    date: "2023-12-10",
    accountId: getRandomLedgerAccountId(),
    type: "Credit",
    amount: 2000.00,
    description: "Service income",
  },
  {
    id: "txn-009",
    date: "2023-12-19",
    accountId: getRandomLedgerAccountId(),
    type: "Debit",
    amount: 100.00,
    description: "Bank fees",
  },
  {
    id: "txn-010",
    date: "2023-12-28",
    accountId: getRandomLedgerAccountId(),
    type: "Credit",
    amount: 600.00,
    description: "Miscellaneous revenue",
  },
];