

// For Chart of Accounts (COA) Module
export interface ControlGroup {
  id: string; // e.g., '1'
  code: string; // e.g., '1'
  name: 'Assets' | 'Liabilities' | 'Equity' | 'Revenue' | 'Expenses';
  level: 1;
}

export interface SubControlGroup {
  id: string; // e.g., '1.01'
  code: string; // e.g., '1.01'
  name: string;
  controlGroupId: string; // Parent ID
  level: 2;
}

export interface ControlAccount {
  id: string; // e.g., '1.01.1'
  code: string; // e.g., '1.01.1'
  name: string;
  subControlGroupId: string; // Parent ID
  level: 3;
}

export interface LedgerAccount {
  id: string; // e.g., '1.01.1.001'
  code: string; // e.g., '1.01.1.001'
  name: string;
  controlAccountId: string; // Parent ID
  balance: number;
  canPost: boolean; // Direct postings allowed only to ledger accounts
  level: 4;
  currency: string; // e.g., 'USD'
  // Optional party information
  ntn?: string; 
  strn?: string;
  address?: string;
  city?: string;
  province?: string;
  contactPerson?: string;
  contactNumber?: string;
  paymentTerms?: string;
}

export type ChartOfAccount = ControlGroup | SubControlGroup | ControlAccount | LedgerAccount;

export interface Product {
  id: string;
  code: string;
  name: string;
  unit: string;
  purchasePrice: number;
  salePrice: number;
  hsnSac: string;
  taxRateId?: string; // Optional: A product might not have a tax rate or it's part of a group
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number; // Percentage, e.g., 18 for 18%
}

// For Dashboard Summary
export interface DashboardSummary {
  inventoryValue: number;
  salesTaxLiability: number;
  estimatedIncomeTax: number;
  lowStockItems: number;
}

// For Income Tax Estimator
export interface EstimatedTaxResult {
  estimatedTax: string;
  isAccurate: boolean;
  additionalDataNeeded?: string;
}

// For Voucher Modules
export type VoucherMode = 'Cash' | 'Bank Transfer' | 'Cheque' | 'UPI' | 'Card' | 'Other';

export interface PaymentVoucher {
  id: string;
  voucherNumber: string;
  date: Date;
  partyName: string;
  amount: number;
  paymentMode: VoucherMode;
  narration?: string;
  currency: string;
}

export interface ReceiptVoucher {
  id: string;
  voucherNumber: string;
  date: Date;
  partyName: string;
  amount: number;
  receiptMode: VoucherMode;
  narration?: string;
  currency: string;
}

// For Journal Voucher Module
export interface JournalEntry {
  id: string; // Unique ID for the entry line
  accountName: string; // For display, simple text input for now. Could be linked to Account['id'] later.
  debit: number;
  credit: number;
  narration?: string; // Narration specific to this line item
}

export interface JournalVoucher {
  id: string;
  voucherNumber: string;
  date: Date;
  narration?: string; // Overall narration for the voucher
  entries: JournalEntry[];
  currency: string; // e.g., 'USD'
}

// For Purchase and Sale Notes
export interface DocumentItem {
  id: string; // Unique ID for the document line item
  productId: string;
  productName?: string; // Denormalized for display
  hsnSac?: string; // Denormalized HSN/SAC code
  serialNumber?: string; // Optional serial number for the item
  quantity: number;
  unitPrice: number;
  taxRateId?: string;
  taxAmount: number;
  totalAmount: number; // (quantity * unitPrice) + taxAmount
}

interface BaseDocument {
  id:string;
  noteNumber: string;
  date: Date;
  subTotal: number; // Sum of (quantity * unitPrice) for all items
  discountAmount: number;
  totalTaxAmount: number; // Sum of taxAmount for all items
  grandTotal: number; // subTotal - discountAmount + totalTaxAmount
  currency: string;
  items: DocumentItem[];
  narration?: string;
}

export interface PurchaseNote extends BaseDocument {
  supplierName: string;
}

export interface SaleNote extends BaseDocument {
  customerName: string;
}

export interface PurchaseReturnNote extends BaseDocument {
  supplierName: string;
  originalPurchaseNoteNumber: string;
}

export interface SaleReturnNote extends BaseDocument {
  customerName: string;
  originalSaleNoteNumber: string;
}

// For User Rights Management
export type Permission = 'view' | 'add' | 'edit' | 'delete';
export type AppModule = 
  | 'products' | 'tax-rates' | 'accounts' | 'parties'
  | 'purchase-notes' | 'purchase-returns' | 'sale-notes' | 'sales-returns'
  | 'payment-vouchers' | 'receipt-vouchers' | 'journal-vouchers'
  | 'reports' | 'user-rights';

export interface UserPermission {
  module: AppModule;
  rights: Set<Permission>;
}

export interface User {
  id: string; // e.g., 'user-1'
  userId: string; // The display ID, e.g., 'EMP001'
  login: string; // The login name, e.g., 'john.doe'
  passwordHash: string; // Should always be a hash
  permissions: UserPermission[];
}

// For Backup & Restore
export interface ApplicationBackup {
  controlGroups: ControlGroup[];
  subControlGroups: SubControlGroup[];
  controlAccounts: ControlAccount[];
  ledgerAccounts: LedgerAccount[];
  products: Product[];
  taxRates: TaxRate[];
  paymentVouchers: PaymentVoucher[];
  receiptVouchers: ReceiptVoucher[];
  journalVouchers: JournalVoucher[];
  purchaseNotes: PurchaseNote[];
  saleNotes: SaleNote[];
  purchaseReturnNotes: PurchaseReturnNote[];
  saleReturnNotes: SaleReturnNote[];
  users: User[];
}
