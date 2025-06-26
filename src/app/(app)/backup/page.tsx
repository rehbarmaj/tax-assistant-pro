import type { NextPage } from 'next';
import { BackupRestoreClient } from './components/backup-client';

const BackupRestorePage: NextPage = () => {
  return (
    <div className="container mx-auto">
      <BackupRestoreClient />
    </div>
  );
};

export default BackupRestorePage;