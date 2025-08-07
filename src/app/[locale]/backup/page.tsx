
"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, AlertTriangle, Loader2 } from 'lucide-react';
import { useI18n } from '@/i18n/client';
import type { ApplicationBackup } from '@/lib/types';
import {
  initialControlGroups,
  initialSubControlGroups,
  initialControlAccounts,
  initialLedgerAccounts,
  mockProducts as initialProducts,
  initialTaxRates,
  initialPaymentVouchers,
  initialReceiptVouchers,
  initialJournalVouchers,
  initialPurchaseNotes,
  initialSaleNotes,
  initialPurchaseReturnNotes,
  initialSaleReturnNotes,
  initialUsers
} from '@/lib/mock-data';

const BackupRestorePage: NextPage = () => {
  const t = useI18n();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateBackup = () => {
    setIsCreating(true);
    setError(null);
    try {
      // In a real app, you would fetch this data from your state management or API
      const backupData: ApplicationBackup = {
        controlGroups: initialControlGroups,
        subControlGroups: initialSubControlGroups,
        controlAccounts: initialControlAccounts,
        ledgerAccounts: initialLedgerAccounts,
        products: initialProducts,
        taxRates: initialTaxRates,
        paymentVouchers: initialPaymentVouchers,
        receiptVouchers: initialReceiptVouchers,
        journalVouchers: initialJournalVouchers,
        purchaseNotes: initialPurchaseNotes,
        saleNotes: initialSaleNotes,
        purchaseReturnNotes: initialPurchaseReturnNotes,
        saleReturnNotes: initialSaleReturnNotes,
        users: initialUsers,
      };

      const jsonString = JSON.stringify(backupData, (key, value) => {
        if (value instanceof Set) {
          return Array.from(value);
        }
        return value;
      }, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tax_assistant_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: t('backupSuccessful'),
        description: t('backupDownloaded'),
      });
    } catch (err) {
      console.error(err);
      setError(t('backupError'));
    } finally {
      setIsCreating(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setError(t('selectBackupFile'));
      return;
    }

    if (file.type !== 'application/json') {
      setError(t('invalidFileType'));
      return;
    }

    setIsRestoring(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error(t('failedToReadFile'));
        }
        const data = JSON.parse(text);
        // Here you would typically validate the data structure and then
        // dispatch actions to update your application state.
        // For this demo, we'll just log it and show a success message.
        console.log('Restored data:', data);
        toast({
          title: t('restoreSuccessful'),
          description: t('restoreCompleted'),
        });
      } catch (err) {
        console.error(err);
        setError(t('invalidJsonFile'));
      } finally {
        setIsRestoring(false);
      }
    };
    reader.onerror = () => {
      setError(t('failedToReadFile'));
      setIsRestoring(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{t('backupAndRestore')}</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('createBackup')}</CardTitle>
            <CardDescription>{t('createBackupDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCreateBackup} disabled={isCreating} className="w-full">
              {isCreating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('creatingBackup')}</>
              ) : (
                <><Download className="mr-2" /> {t('createAndDownloadBackup')}</>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('restoreFromBackup')}</CardTitle>
            <CardDescription>{t('restoreFromBackupDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('warning')}</AlertTitle>
              <AlertDescription>{t('restoreWarning')}</AlertDescription>
            </Alert>
            <Button asChild className="w-full" disabled={isRestoring}>
              <label htmlFor="backup-upload">
                {isRestoring ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('restoringData')}</>
                ) : (
                  <><Upload className="mr-2" /> {t('restoreFromFile')}</>
                )}
                <input
                  id="backup-upload"
                  type="file"
                  accept=".json"
                  className="sr-only"
                  onChange={handleFileChange}
                  disabled={isRestoring}
                />
              </label>
            </Button>
          </CardContent>
        </Card>
      </div>

       {error && (
        <Alert variant="destructive" className="mt-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('error')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BackupRestorePage;
