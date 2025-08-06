export interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  parentId: string | null;
  isGroup: boolean;
  balance: number;
}

export async function getLedgerAccounts(): Promise<LedgerAccount[]> {
  // Simulate fetching data from an API or database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '101',
          code: '10100',
          name: 'Cash in Hand',
          type: 'Asset',
          parentId: '100',
          isGroup: false,
          balance: 50000,
        },
        {
          id: '102',
          code: '10200',
          name: 'Bank Account',
          type: 'Asset',
          parentId: '100',
          isGroup: false,
          balance: 150000,
        },
        {
          id: '401',
          code: '40100',
          name: 'Sales Revenue',
          type: 'Revenue',
          parentId: '400',
          isGroup: false,
          balance: 500000,
        },
        {
          id: '501',
          code: '50100',
          name: 'Cost of Goods Sold',
          type: 'Expense',
          parentId: '500',
          isGroup: false,
          balance: 300000,
        },
        {
          id: '201',
          code: '20100',
          name: 'Accounts Payable',
          type: 'Liability',
          parentId: '200',
          isGroup: false,
          balance: 75000,
        },
      ]);
    }, 500); // Simulate a network delay
  });
}