
"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, AlertTriangle, Loader2, Database } from 'lucide-react';
import type { ApplicationBackup } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
import { initializeDatabase } from './actions';

const BackupRestorePage: NextPage = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateBackup = () => {
    setIsCreating(true);
    setError(null);
    try {
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
        title: "Backup Successful",
        description: "Your application data has been downloaded.",
      });
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred while creating the backup.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setError("Please select a backup file to restore.");
      return;
    }

    if (file.type !== 'application/json') {
      setError("Invalid file type. Please upload a .json file.");
      return;
    }

    setIsRestoring(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("Failed to read the backup file.");
        }
        const data = JSON.parse(text);
        console.log('Restored data:', data);
        toast({
          title: "Restore Successful",
          description: "Your data has been restored.",
        });
      } catch (err) {
        console.error(err);
        setError("The selected file is not a valid JSON backup file.");
      } finally {
        setIsRestoring(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the backup file.");
      setIsRestoring(false);
    };
    reader.readAsText(file);
  };

  const handleInitializeDb = async () => {
    setIsInitializing(true);
    setError(null);
    const result = await initializeDatabase();
    if (result.success) {
      toast({
        title: 'Database Initialized',
        description: result.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Initialization Failed',
        description: result.message,
      });
      setError(result.message);
    }
    setIsInitializing(false);
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Backup, Restore & Database</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create a Backup</CardTitle>
            <CardDescription>Download a complete backup of your application data as a single JSON file.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCreateBackup} disabled={isCreating} className="w-full">
              {isCreating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Backup...</>
              ) : (
                <><Download className="mr-2" /> Create & Download Backup</>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Restore from Backup</CardTitle>
            <CardDescription>Upload a backup file to restore your application's state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>Restoring will overwrite all current data.</AlertDescription>
            </Alert>
            <Button asChild className="w-full" disabled={isRestoring}>
              <label htmlFor="backup-upload">
                {isRestoring ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Restoring...</>
                ) : (
                  <><Upload className="mr-2" /> Restore From File</>
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

        <Card className="md:col-span-2 lg:col-span-1 border-primary/50">
          <CardHeader>
            <CardTitle>Initialize Database</CardTitle>
            <CardDescription>Set up the required tables in your database for the first time.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Danger Zone</AlertTitle>
              <AlertDescription>
                This will attempt to create all necessary tables. Running this on a database with existing tables of the same name may cause errors or data loss.
              </AlertDescription>
            </Alert>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full" disabled={isInitializing}>
                  {isInitializing ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Initializing...</>
                  ) : (
                    <><Database className="mr-2" /> Initialize Database</>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will create a new set of tables in the database configured in your environment variables. 
                    This cannot be undone. Ensure your `.env` file is configured correctly.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleInitializeDb}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
          </CardContent>
        </Card>

      </div>

       {error && (
        <Alert variant="destructive" className="mt-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BackupRestorePage;
