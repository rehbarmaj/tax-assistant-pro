
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle, Rocket, Server, KeyRound, User, Database } from 'lucide-react';
import { testDatabaseConnection } from '../actions';
import { useCurrentLocale, useI18n } from '@/i18n/client';

const dbConfigSchema = z.object({
    host: z.string().min(1, 'Host is required.'),
    dbName: z.string().min(1, 'Database name is required.'),
    user: z.string().min(1, 'Username is required.'),
    password: z.string().optional(),
});

type FormValues = z.infer<typeof dbConfigSchema>;

export function SetupWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const locale = useCurrentLocale();
  const t = useI18n();

  const form = useForm<FormValues>({
    resolver: zodResolver(dbConfigSchema),
    defaultValues: {
      host: 'localhost',
      dbName: '',
      user: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    const result = await testDatabaseConnection(data);
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage(result.message);
      setCurrentStep(3);
    } else {
      setError(result.message);
    }
  };

  const progressValue = (currentStep / 3) * 100;

  return (
    <div className="space-y-8">
      <Progress value={progressValue} className="w-full" />

      {currentStep === 1 && (
        <div className="text-center space-y-4 animate-in fade-in-50 duration-500">
          <Rocket className="h-12 w-12 mx-auto text-primary" />
          <h2 className="text-2xl font-semibold">{t('welcomeToApp')}</h2>
          <p className="text-muted-foreground">{t('welcomeDescription')}</p>
          <Button size="lg" onClick={() => setCurrentStep(2)}>
            {t('getStarted')}
          </Button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="animate-in fade-in-50 duration-500">
          <h2 className="text-2xl font-semibold text-center mb-6">{t('databaseCredentials')}</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dbHost')}</FormLabel>
                       <div className="relative">
                           <Server className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                           <FormControl><Input placeholder={t('dbHostPlaceholder')} {...field} className="pl-10" /></FormControl>
                       </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dbName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dbName')}</FormLabel>
                       <div className="relative">
                           <Database className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <FormControl><Input placeholder={t('dbNamePlaceholder')} {...field} className="pl-10" /></FormControl>
                       </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dbUser')}</FormLabel>
                      <div className="relative">
                           <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                           <FormControl><Input placeholder={t('dbUserPlaceholder')} {...field} className="pl-10" /></FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dbPassword')}</FormLabel>
                       <div className="relative">
                           <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                           <FormControl><Input type="password" placeholder={t('dbPasswordPlaceholder')} {...field} className="pl-10" /></FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{t('connectionFailed')}</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between items-center">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                  {t('back')}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('testAndSave')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {currentStep === 3 && (
        <div className="text-center space-y-4 animate-in fade-in-50 duration-500">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
            <h2 className="text-2xl font-semibold">{t('setupComplete')}</h2>
            <p className="text-muted-foreground">{successMessage}</p>
            <Button size="lg" onClick={() => router.push(`/${locale}/dashboard`)}>
                {t('goToDashboard')}
            </Button>
        </div>
      )}
    </div>
  );
}
