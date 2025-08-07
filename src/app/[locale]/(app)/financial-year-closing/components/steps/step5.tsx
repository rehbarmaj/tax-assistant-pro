"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useCurrentLocale } from '@/i18n/client';

const Step5: React.FC = () => {
  const locale = useCurrentLocale();
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg shadow-lg bg-card">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Process Complete</h2>
      <p className="text-muted-foreground mb-6">
        The financial year has been successfully closed. All reports are finalized and balances have been carried forward.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href={`/${locale}/dashboard`}>Return to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
           <Link href={`/${locale}/reports`}>View Final Reports</Link>
        </Button>
      </div>
    </div>
  );
};

export default Step5;
