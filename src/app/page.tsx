
import type { NextPage } from 'next';
import { SetupWizard } from './setup/components/setup-wizard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

const SetupPage: NextPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center items-center gap-2 mb-6">
            <Database className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Database Setup</h1>
        </div>
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle>Welcome to Tax Assistant Pro</CardTitle>
            <CardDescription>
              Let's get your application connected to your database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SetupWizard />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SetupPage;
