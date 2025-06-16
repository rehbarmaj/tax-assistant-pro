

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

// For Accounts Module
export type AccountType =
  | 'Bank'
  | 'Cash'
  | 'Credit Card'
  | 'Loan'
  | 'Equity'
  | 'Asset'
  | 'Liability';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  accountNumber?: string;
  bankName?: string;
  balance: number;
  currency: string; // e.g., 'USD'
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

