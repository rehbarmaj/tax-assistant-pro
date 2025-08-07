
import type { NextPage } from 'next';
import { ReportsClient } from './components/reports-client';

const ReportsPage: NextPage = () => {
  return (
    <div className="container mx-auto">
      <ReportsClient />
    </div>
  );
};

export default ReportsPage;
