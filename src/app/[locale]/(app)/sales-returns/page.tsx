
import type { NextPage } from 'next';
import { SalesReturnsClient } from './components/sales-returns-client';

const SalesReturnsPage: NextPage = () => {
  return (
    <div className="container mx-auto">
      <SalesReturnsClient />
    </div>
  );
};

export default SalesReturnsPage;
