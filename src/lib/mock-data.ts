import type {
  ControlGroup,
  SubControlGroup,
  ControlAccount,
  LedgerAccount,
  Product,
  TaxRate,
  JournalVoucher,
  PaymentVoucher,
  ReceiptVoucher,
  PurchaseNote,
  PurchaseReturnNote,
  SaleNote,
  SaleReturnNote,
  User,
  AppModule,
  Permission
} from './types';

// From accounts-client.tsx
export const initialControlGroups: ControlGroup[] = [
    { id: '1', code: '1', name: 'Assets', level: 1 },
    { id: '2', code: '2', name: 'Liabilities', level: 1 },
    { id: '3', code: '3', name: 'Equity', level: 1 },
    { id: '4', code: '4', name: 'Revenue', level: 1 },
    { id: '5', code: '5', name: 'Expenses', level: 1 },
];
export const initialSubControlGroups: SubControlGroup[] = [
    { id: '1.01', code: '1.01', name: 'Current Assets', controlGroupId: '1', level: 2 },
    { id: '1.02', code: '1.02', name: 'Fixed Assets', controlGroupId: '1', level: 2 },
    { id: '2.01', code: '2.01', name: 'Current Liabilities', controlGroupId: '2', level: 2 },
    { id: '4.01', code: '4.01', name: 'Sales Revenue', controlGroupId: '4', level: 2 },
    { id: '5.01', code: '5.01', name: 'Cost of Goods Sold', controlGroupId: '5', level: 2 },
    { id: '5.02', code: '5.02', name: 'Operating Expenses', controlGroupId: '5', level: 2 },
];
export const initialControlAccounts: ControlAccount[] = [
    { id: '1.01.1', code: '1.01.1', name: 'Debtors', subControlGroupId: '1.01', level: 3 },
    { id: '1.01.2', code: '1.01.2', name: 'Cash & Bank', subControlGroupId: '1.01', level: 3 },
    { id: '1.02.1', code: '1.02.1', name: 'Furniture & Fixtures', subControlGroupId: '1.02', level: 3 },
    { id: '2.01.1', code: '2.01.1', name: 'Creditors', subControlGroupId: '2.01', level: 3 },
    { id: '4.01.1', code: '4.01.1', name: 'Product Sales', subControlGroupId: '4.01', level: 3 },
    { id: '5.02.1', code: '5.02.1', name: 'General & Admin Expenses', subControlGroupId: '5.02', level: 3 },
];
export const initialLedgerAccounts: LedgerAccount[] = [
    { id: '1.01.2.001', code: '1.01.2.001', name: 'Cash on Hand', controlAccountId: '1.01.2', balance: 50000, canPost: true, level: 4, currency: 'USD' },
    { id: '1.01.1.001', code: '1.01.1.001', name: 'Client A', controlAccountId: '1.01.1', balance: 15000, canPost: true, level: 4, currency: 'USD', ntn: '1234567-8', strn: '9876543210', address: '123 Tech Park', city: 'Metropolis', province: 'Central Province', contactPerson: 'John Smith', contactNumber: '555-1234', paymentTerms: 'Net 30' },
    { id: '1.02.1.001', code: '1.02.1.001', name: 'Office Furniture', controlAccountId: '1.02.1', balance: 25000, canPost: true, level: 4, currency: 'USD' },
    { id: '2.01.1.001', code: '2.01.1.001', name: 'Vendor B', controlAccountId: '2.01.1', balance: -10000, canPost: true, level: 4, currency: 'USD', ntn: '8765432-1', strn: '0123456789', address: '456 Supply Ave', city: 'Gotham', province: 'North Province', contactPerson: 'Jane Doe', contactNumber: '555-5678', paymentTerms: 'Net 60' },
    { id: '4.01.1.001', code: '4.01.1.001', name: 'Domestic Sales', controlAccountId: '4.01.1', balance: -150000, canPost: true, level: 4, currency: 'USD' },
    { id: '5.02.1.001', code: '5.02.1.001', name: 'Rent Expense', controlAccountId: '5.02.1', balance: 20000, canPost: true, level: 4, currency: 'USD' },
];

// From journal-vouchers-client.tsx
export const initialJournalVouchers: JournalVoucher[] = [
  { 
    id: 'jv1', 
    voucherNumber: 'JV001', 
    date: new Date('2023-10-15'), 
    narration: 'To record depreciation for the month', 
    currency: 'USD',
    entries: [
      { id: 'e1-1', accountName: 'Depreciation Expense', debit: 500, credit: 0, narration: 'Office Equipment Depreciation' },
      { id: 'e1-2', accountName: 'Accumulated Depreciation - Office Equipment', debit: 0, credit: 500 },
    ] 
  },
  { 
    id: 'jv2', 
    voucherNumber: 'JV002', 
    date: new Date('2023-10-20'), 
    narration: 'To correct misclassified expense', 
    currency: 'USD',
    entries: [
      { id: 'e2-1', accountName: 'Office Supplies Expense', debit: 75, credit: 0 },
      { id: 'e2-2', accountName: 'Miscellaneous Expense', debit: 0, credit: 75, narration: 'Correction of earlier entry' },
    ]
  },
];

// From payment-vouchers-client.tsx
export const initialPaymentVouchers: PaymentVoucher[] = [
  { id: 'pv1', voucherNumber: 'PV001', date: new Date('2023-10-01'), partyName: 'Office Supplies Inc.', amount: 150.75, paymentMode: 'Bank Transfer', narration: 'Monthly office supplies', currency: 'USD' },
  { id: 'pv2', voucherNumber: 'PV002', date: new Date('2023-10-05'), partyName: 'Utility Services Co.', amount: 275.00, paymentMode: 'Cheque', narration: 'Electricity bill', currency: 'USD' },
  { id: 'pv3', voucherNumber: 'PV003', date: new Date('2023-10-10'), partyName: 'Freelancer John Doe', amount: 500.00, paymentMode: 'UPI', narration: 'Content writing services', currency: 'USD' },
];

// From products-client.tsx and others
export const mockTaxRates: TaxRate[] = [
  { id: 'rate1', name: 'GST 5%', rate: 5 },
  { id: 'rate2', name: 'GST 12%', rate: 12 },
  { id: 'rate3', name: 'GST 18%', rate: 18 },
  { id: 'rate4', name: 'No Tax', rate: 0 },
];
export const mockProducts: Product[] = [
  { id: '1', code: 'P001', name: 'Premium Keyboard', unit: 'pcs', purchasePrice: 45, salePrice: 75, hsnSac: '847160', taxRateId: 'rate3' },
  { id: '2', code: 'P002', name: 'Optical Mouse', unit: 'pcs', purchasePrice: 10, salePrice: 20, hsnSac: '847160', taxRateId: 'rate2' },
  { id: '3', code: 'P003', name: '27-inch Monitor', unit: 'pcs', purchasePrice: 150, salePrice: 250, hsnSac: '852852', taxRateId: 'rate3' },
];

// Re-exporting for clarity in different modules that might use it
export const initialProducts = mockProducts;


// From purchase-notes-client.tsx
export const initialPurchaseNotes: PurchaseNote[] = [
  { 
    id: 'pn1', 
    noteNumber: 'PN001', 
    date: new Date('2023-10-01'), 
    supplierName: 'Tech Supplies Inc.',
    items: [
      { id: 'item1', productId: '1', productName: 'Premium Keyboard', hsnSac: '847160', serialNumber: 'SN-KBD-001', quantity: 10, unitPrice: 45, taxRateId: 'rate3', taxAmount: 81, totalAmount: 531 },
      { id: 'item2', productId: '2', productName: 'Optical Mouse', hsnSac: '847160', serialNumber: 'SN-MOU-005', quantity: 20, unitPrice: 10, taxRateId: 'rate2', taxAmount: 24, totalAmount: 224 },
    ],
    subTotal: 650,
    discountAmount: 0,
    totalTaxAmount: 105,
    grandTotal: 755,
    currency: 'USD'
  },
];

// From purchase-returns-client.tsx
export const initialPurchaseReturnNotes: PurchaseReturnNote[] = [
  { 
    id: 'prn1', 
    noteNumber: 'PRN001', 
    date: new Date('2023-10-10'), 
    supplierName: 'Tech Supplies Inc.',
    originalPurchaseNoteNumber: 'PN001',
    items: [
      { id: 'item1', productId: '2', productName: 'Optical Mouse', hsnSac: '847160', serialNumber: 'SN-MOU-005', quantity: 5, unitPrice: 10, taxRateId: 'rate2', taxAmount: 6, totalAmount: 56 },
    ],
    subTotal: 50,
    discountAmount: 0,
    totalTaxAmount: 6,
    grandTotal: 56,
    currency: 'USD'
  },
];

// From receipt-vouchers-client.tsx
export const initialReceiptVouchers: ReceiptVoucher[] = [
  { id: 'rv1', voucherNumber: 'RV001', date: new Date('2023-10-02'), partyName: 'Client A Services', amount: 1200.00, receiptMode: 'Bank Transfer', narration: 'Payment for project X', currency: 'USD' },
  { id: 'rv2', voucherNumber: 'RV002', date: new Date('2023-10-08'), partyName: 'Customer B Goods', amount: 350.50, receiptMode: 'Cash', narration: 'Sale of product Y', currency: 'USD' },
  { id: 'rv3', voucherNumber: 'RV003', date: new Date('2023-10-12'), partyName: 'Client C Consulting', amount: 2500.00, receiptMode: 'Cheque', narration: 'Consulting fees', currency: 'USD' },
];

// From sale-notes-client.tsx
export const initialSaleNotes: SaleNote[] = [
  { 
    id: 'sn1', 
    noteNumber: 'SN001', 
    date: new Date('2023-10-05'), 
    customerName: 'Global Corp',
    items: [
      { id: 'item1', productId: '3', productName: '27-inch Monitor', hsnSac: '852852', serialNumber: 'SN-MON-101', quantity: 2, unitPrice: 250, taxRateId: 'rate3', taxAmount: 90, totalAmount: 590 },
    ],
    subTotal: 500,
    discountAmount: 0,
    totalTaxAmount: 90,
    grandTotal: 590,
    currency: 'USD'
  },
];

// From sales-returns-client.tsx
export const initialSaleReturnNotes: SaleReturnNote[] = [
  { 
    id: 'srn1', 
    noteNumber: 'SRN001', 
    date: new Date('2023-10-12'), 
    customerName: 'Global Corp',
    originalSaleNoteNumber: 'SN001',
    items: [
      { id: 'item1', productId: '3', productName: '27-inch Monitor', hsnSac: '852852', serialNumber: 'SN-MON-101', quantity: 1, unitPrice: 250, taxRateId: 'rate3', taxAmount: 45, totalAmount: 295 },
    ],
    subTotal: 250,
    discountAmount: 0,
    totalTaxAmount: 45,
    grandTotal: 295,
    currency: 'USD'
  },
];

// From tax-rates-client.tsx
export const initialTaxRates: TaxRate[] = [
  { id: '1', name: 'GST 5%', rate: 5 },
  { id: '2', name: 'GST 12%', rate: 12 },
  { id: '3', name: 'GST 18%', rate: 18 },
  { id: '4', name: 'VAT 20%', rate: 20 },
  { id: '5', name: 'No Tax', rate: 0 },
];

// From user-rights-client.tsx
export const ALL_MODULES: { key: AppModule, name: string }[] = [
    { key: 'products', name: 'Products' },
    { key: 'tax-rates', name: 'Tax Rates' },
    { key: 'accounts', name: 'Accounts' },
    { key: 'parties', name: 'Parties' },
    { key: 'purchase-notes', name: 'Purchase Notes' },
    { key: 'sale-notes', name: 'Sale Notes' },
    { key: 'payment-vouchers', name: 'Payment Vouchers' },
    { key: 'receipt-vouchers', name: 'Receipt Vouchers' },
    { key: 'journal-vouchers', name: 'Journal Vouchers' },
    { key: 'reports', name: 'Reports' },
    { key: 'user-rights', name: 'User Rights' },
];

export const ALL_PERMISSIONS: Permission[] = ['view', 'add', 'edit', 'delete'];

export const initialUsers: User[] = [
  {
    id: '1',
    userId: 'ADMIN',
    login: 'admin',
    passwordHash: 'hashed_password_1',
    permissions: ALL_MODULES.map(m => ({ module: m.key, rights: new Set<Permission>(ALL_PERMISSIONS) }))
  },
  {
    id: '2',
    userId: 'DATAENTRY',
    login: 'data.entry',
    passwordHash: 'hashed_password_2',
    permissions: [
      { module: 'products', rights: new Set(['view', 'add', 'edit']) },
      { module: 'parties', rights: new Set(['view', 'add', 'edit']) },
      { module: 'purchase-notes', rights: new Set(['view', 'add']) },
      { module: 'sale-notes', rights: new Set(['view', 'add']) },
    ]
  }
];