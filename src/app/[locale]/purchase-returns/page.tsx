
import type { NextPage } from 'next';
import { PurchaseReturnsClient } from './components/purchase-returns-client';

const PurchaseReturnsPage: NextPage = () => {
  return (
    <div className="container mx-auto">
      <PurchaseReturnsClient />
    </div>
  );
};

export default PurchaseReturnsPage;
