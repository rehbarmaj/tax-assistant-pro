import type { NextPage } from 'next';
import { SettingsClient } from './components/settings-client';

const SettingsPage: NextPage = () => {
  return (
    <div className="container mx-auto">
      <SettingsClient />
    </div>
  );
};

export default SettingsPage;
