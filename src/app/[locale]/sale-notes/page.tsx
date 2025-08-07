
import type { NextPage } from 'next';
import { SaleNotesClient } from './components/sale-notes-client';

const SaleNotesPage: NextPage = () => {
  return (
    <div className="container mx-auto">
      <SaleNotesClient />
    </div>
  );
};

export default SaleNotesPage;
