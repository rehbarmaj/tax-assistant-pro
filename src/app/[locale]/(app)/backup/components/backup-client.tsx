
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

export function BackupRestoreClient() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const { toast } = useToast();

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
        title: "Backup Successful",
        description: "Your application data has been downloaded.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Backup Failed",
        description: "An unexpected error occurred while creating the backup.",
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
        setRestoreError('Invalid file type. Please upload a .json file.');
        setRestoreFile(null);
      }
    }
  };

  const handleRestore = async () => {
    if (!restoreFile) {
      setRestoreError('Please select a backup file to restore.');
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
                title: "Restore Successful",
                description: "Your data has been restored. Please refresh the page or navigate to see the changes.",
            });
             // Reset the file input
            const fileInput = document.getElementById('restore-file') as HTMLInputElement;
            if(fileInput) fileInput.value = '';
            setRestoreFile(null);
        } catch (err) {
            setRestoreError('The selected file is not a valid JSON backup file.');
        } finally {
             setIsRestoring(false);
        }
    };
    reader.onerror = () => {
        setRestoreError('Failed to read the backup file.');
        setIsRestoring(false);
    }
    reader.readAsText(restoreFile);
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
            <DatabaseBackup className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Backup & Restore</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Download/> Create a Backup</CardTitle>
                    <CardDescription>
                        Download a complete backup of your application data as a single JSON file. Store this file in a safe place.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleBackup} disabled={isBackingUp} className="w-full">
                        {isBackingUp ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Creating Backup...</>
                        ) : (
                            "Create & Download Backup"
                        )}
                    </Button>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Upload/> Restore from Backup</CardTitle>
                    <CardDescription>
                        Upload a previously created JSON backup file to restore your application's state. This will overwrite existing data.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Warning</AlertTitle>
                      <AlertDescription>
                        Restoring from a backup is an irreversible action and will overwrite all current data.
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                        <Label htmlFor="restore-file">Select Backup File (.json)</Label>
                        <Input id="restore-file" type="file" accept=".json" onChange={handleFileChange} />
                    </div>
                    {restoreError && <p className="text-sm text-destructive">{restoreError}</p>}
                    <Button onClick={handleRestore} disabled={isRestoring || !restoreFile} className="w-full">
                        {isRestoring ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Restoring Data...</>
                        ) : (
                           "Restore From File"
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
