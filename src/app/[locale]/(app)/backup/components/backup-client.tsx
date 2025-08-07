
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, Upload, Loader2, AlertCircle, DatabaseBackup } from 'lucide-react';
import { getBackupData } from '../actions';
import { useToast } from "@/hooks/use-toast";
import { useI18n } from '@/i18n/client';

export function BackupRestoreClient() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const { toast } = useToast();
  const t = useI18n();

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      const backupData = await getBackupData();
      const jsonString = JSON.stringify(backupData, (key, value) => {
        // Convert Set to Array for JSON compatibility
        if (value instanceof Set) {
          return Array.from(value);
        }
        return value;
      }, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.download = `tax-assistant-pro-backup-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: t('backupSuccessful'),
        description: t('backupDownloaded'),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('backupFailed'),
        description: t('backupError'),
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/json') {
        setRestoreFile(file);
        setRestoreError(null);
      } else {
        setRestoreError(t('invalidFileType'));
        setRestoreFile(null);
      }
    }
  };

  const handleRestore = async () => {
    if (!restoreFile) {
      setRestoreError(t('selectBackupFile'));
      return;
    }
    setIsRestoring(true);
    setRestoreError(null);

    // Simulate restore process
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real application, you would send the file content to a server action
    // to update the database. For this prototype, we'll just show a success message.
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            JSON.parse(text as string); // Validate JSON
            toast({
                title: t('restoreSuccessful'),
                description: t('restoreCompleted'),
            });
             // Reset the file input
            const fileInput = document.getElementById('restore-file') as HTMLInputElement;
            if(fileInput) fileInput.value = '';
            setRestoreFile(null);
        } catch (err) {
            setRestoreError(t('invalidJsonFile'));
        } finally {
             setIsRestoring(false);
        }
    };
    reader.onerror = () => {
        setRestoreError(t('failedToReadFile'));
        setIsRestoring(false);
    }
    reader.readAsText(restoreFile);
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
            <DatabaseBackup className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">{t('backupAndRestore')}</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Download/> {t('createBackup')}</CardTitle>
                    <CardDescription>
                       {t('createBackupDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleBackup} disabled={isBackingUp} className="w-full">
                        {isBackingUp ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>{t('creatingBackup')}</>
                        ) : (
                            t('createAndDownloadBackup')
                        )}
                    </Button>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Upload/> {t('restoreFromBackup')}</CardTitle>
                    <CardDescription>
                       {t('restoreFromBackupDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{t('warning')}</AlertTitle>
                      <AlertDescription>
                        {t('restoreWarning')}
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                        <Label htmlFor="restore-file">{t('selectBackupFileJson')}</Label>
                        <Input id="restore-file" type="file" accept=".json" onChange={handleFileChange} />
                    </div>
                    {restoreError && <p className="text-sm text-destructive">{restoreError}</p>}
                    <Button onClick={handleRestore} disabled={isRestoring || !restoreFile} className="w-full">
                        {isRestoring ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>{t('restoringData')}</>
                        ) : (
                           t('restoreFromFile')
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
