
"use client";

import type { PaymentVoucher, ReceiptVoucher, JournalVoucher, JournalEntry } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/currency';
import { initialLedgerAccounts } from '@/lib/mock-data';

type Voucher = PaymentVoucher | ReceiptVoucher | JournalVoucher;

interface PrintableVoucherProps {
  voucher: Voucher;
}

const isPaymentVoucher = (voucher: Voucher): voucher is PaymentVoucher => 'paymentMode' in voucher;
const isReceiptVoucher = (voucher: Voucher): voucher is ReceiptVoucher => 'receiptMode' in voucher;
const isJournalVoucher = (voucher: Voucher): voucher is JournalVoucher => 'entries' in voucher;

export const PrintableVoucher: React.FC<PrintableVoucherProps> = ({ voucher }) => {
  const getVoucherType = () => {
    if (isPaymentVoucher(voucher)) return 'Payment Voucher';
    if (isReceiptVoucher(voucher)) return 'Receipt Voucher';
    if (isJournalVoucher(voucher)) return 'Journal Voucher';
    return 'Voucher';
  };

  const renderJournalEntries = (entries: JournalEntry[]) => (
    <div className="mt-4 border rounded-lg">
      <table className="min-w-full divide-y">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Account</th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">Debit</th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">Credit</th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y">
          {entries.map(entry => (
            <tr key={entry.id}>
              <td className="px-4 py-2 whitespace-nowrap text-sm">{entry.accountName}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">{entry.debit > 0 ? formatCurrency(entry.debit) : '-'}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">{entry.credit > 0 ? formatCurrency(entry.credit) : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
   const getAmount = () => {
    if (isJournalVoucher(voucher)) {
        return voucher.entries.reduce((sum, entry) => sum + entry.debit, 0);
    }
    return (voucher as PaymentVoucher | ReceiptVoucher).amount;
   }

  return (
    <div className="p-4 bg-white text-black">
      <Card className="shadow-none border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Tax Assistant Pro Inc.</CardTitle>
          <CardDescription className="text-lg">{getVoucherType()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div><strong>Voucher #:</strong> {voucher.voucherNumber}</div>
            <div className="text-right"><strong>Date:</strong> {format(voucher.date, 'PPP')}</div>
            
            {isPaymentVoucher(voucher) && <>
              <div><strong>Paid To:</strong> {voucher.partyName}</div>
              <div className="text-right"><strong>Payment Mode:</strong> {voucher.paymentMode}</div>
            </>}

            {isReceiptVoucher(voucher) && <>
              <div><strong>Received From:</strong> {voucher.partyName}</div>
              <div className="text-right"><strong>Receipt Mode:</strong> {voucher.receiptMode}</div>
            </>}
          </div>

          <div className="mt-6">
            <strong>Narration:</strong>
            <p className="text-muted-foreground italic">{voucher.narration || 'N/A'}</p>
          </div>
          
          {isJournalVoucher(voucher) && renderJournalEntries(voucher.entries)}

        </CardContent>
        <CardFooter className="flex flex-col items-end space-y-8 mt-8 pt-4 border-t">
          <div className="text-xl font-bold">
            Total Amount: {formatCurrency(getAmount(), voucher.currency)}
          </div>
          <div className="grid grid-cols-2 gap-24 text-center w-full mt-16 pt-16">
            <div className="border-t pt-2">Prepared By</div>
            <div className="border-t pt-2">Approved By</div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
