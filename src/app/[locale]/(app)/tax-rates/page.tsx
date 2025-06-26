
import type { NextPage } from 'next';
import { TaxRatesClient } from './components/tax-rates-client';

const TaxRatesPage: NextPage = () => {
  return (
    <div className="container mx-auto">
      <TaxRatesClient />
    </div>
  );
};

export default TaxRatesPage;
