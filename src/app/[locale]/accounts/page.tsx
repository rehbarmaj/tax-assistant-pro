
import type { NextPage } from 'next';
import { AccountsClient } from './components/accounts-client';

const AccountsPage: NextPage = () => {
  return (
    <div className="container mx-auto">
      <AccountsClient />
    </div>
  );
};

export default AccountsPage;
