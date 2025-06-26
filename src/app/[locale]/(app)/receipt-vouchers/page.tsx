
import type { NextPage } from 'next';
import { ReceiptVouchersClient } from './components/receipt-vouchers-client';

const ReceiptVouchersPage: NextPage = () => {
  return (
    <div className="container mx-auto">
      <ReceiptVouchersClient />
    </div>
  );
};

export default ReceiptVouchersPage;
