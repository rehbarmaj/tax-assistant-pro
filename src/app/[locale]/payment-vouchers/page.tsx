
import type { NextPage } from 'next';
import { PaymentVouchersClient } from './components/payment-vouchers-client';

const PaymentVouchersPage: NextPage = () => {
  return (
    <div className="container mx-auto">
      <PaymentVouchersClient />
    </div>
  );
};

export default PaymentVouchersPage;
