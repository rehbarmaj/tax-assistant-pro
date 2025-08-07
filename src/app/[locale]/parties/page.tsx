
import type { NextPage } from 'next';
import { PartiesClient } from './components/parties-client';

const PartiesPage: NextPage = () => {
  return (
    <div className="container mx-auto">
      <PartiesClient />
    </div>
  );
};

export default PartiesPage;
