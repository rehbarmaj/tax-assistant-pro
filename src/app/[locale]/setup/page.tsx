
'use client';

import type { NextPage } from 'next';
import { SetupWizard } from './components/setup-wizard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';
import { useI18n } from '@/i18n/client';

const SetupPage: NextPage = () => {
  const t = useI18n();

  return (
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-primary/20">
          <CardHeader className="text-center">
              <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4 ring-4 ring-primary/10">
                  <Database className="h-8 w-8" />
              </div>
              <CardTitle className="text-3xl font-bold text-primary">{t('setupWizard')}</CardTitle>
              <CardDescription className="text-lg">
                  {t('setupWizardDescription')}
              </CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-8 pb-8">
              <SetupWizard />
          </CardContent>
      </Card>
  );
};

export default SetupPage;
