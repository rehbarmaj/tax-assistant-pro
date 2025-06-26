
'use server';

import {
  initialControlGroups,
  initialSubControlGroups,
  initialControlAccounts,
  initialLedgerAccounts,
  initialProducts,
  initialTaxRates,
  initialPaymentVouchers,
  initialReceiptVouchers,
  initialJournalVouchers,
  initialPurchaseNotes,
  initialSaleNotes,
  initialPurchaseReturnNotes,
  initialSaleReturnNotes,
  initialUsers,
} from '@/lib/mock-data';
import type { ApplicationBackup } from '@/lib/types';

export async function getBackupData(): Promise<ApplicationBackup> {
  // In a real application, this would fetch data from the database.
  // Here, we're just gathering the mock data from our central source.
  return {
    controlGroups: initialControlGroups,
    subControlGroups: initialSubControlGroups,
    controlAccounts: initialControlAccounts,
    ledgerAccounts: initialLedgerAccounts,
    products: initialProducts,
    taxRates: initialTaxRates,
    paymentVouchers: initialPaymentVouchers,
    receiptVouchers: initialReceiptVouchers,
    journalVouchers: initialJournalVouchers,
    purchaseNotes: initialPurchaseNotes,
    saleNotes: initialSaleNotes,
    purchaseReturnNotes: initialPurchaseReturnNotes,
    saleReturnNotes: initialSaleReturnNotes,
    users: initialUsers,
  };
}
