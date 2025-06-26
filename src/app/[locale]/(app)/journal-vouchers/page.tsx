
import type { NextPage } from 'next';
import { JournalVouchersClient } from './components/journal-vouchers-client';

const JournalVouchersPage: NextPage = () => {
  return (
    <div className="container mx-auto">
      <JournalVouchersClient />
    </div>
  );
};

export default JournalVouchersPage;
