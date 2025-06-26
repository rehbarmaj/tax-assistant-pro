
import type { NextPage } from 'next';
import { PurchaseNotesClient } from './components/purchase-notes-client';

const PurchaseNotesPage: NextPage = () => {
  return (
    <div className="container mx-auto">
      <PurchaseNotesClient />
    </div>
  );
};

export default PurchaseNotesPage;
