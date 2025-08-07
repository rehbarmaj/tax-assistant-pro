
import type { NextPage } from 'next';
import { UserRightsClient } from './components/user-rights-client';

const UserRightsPage: NextPage = () => {
  return (
    <div className="container mx-auto">
      <UserRightsClient />
    </div>
  );
};

export default UserRightsPage;
