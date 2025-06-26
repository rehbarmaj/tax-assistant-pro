
"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2, Wand2 } from 'lucide-react';
import { estimateTaxAction } from '@/app/(app)/income-tax-estimator/actions';
import type { EstimatedTaxResult } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useI18n } from '@/i18n/client';

const IncomeTaxEstimatorPage: NextPage = () => {
  const [profitData, setProfitData] = useState('');
  const [estimationResult, setEstimationResult] = useState<EstimatedTaxResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const t = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setEstimationResult(null);

    if (!profitData.trim()) {
      setError(t('profitDataEmpty'));
      setIsLoading(false);
      return;
    }

    try {
      const result = await estimateTaxAction({ profitData });
      if (result.error) {
        setError(result.error);
        toast({
          variant: "destructive",
          title: t('estimationError'),
          description: result.error,
        });
      } else if (result.data) {
        setEstimationResult(result.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('unknownError');
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: t('estimationFailed'),
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Wand2 className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold text-primary">{t('aiTaxEstimator')}</CardTitle>
          </div>
          <CardDescription>
            {t('aiTaxEstimatorDescription')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="profitData" className="text-lg font-semibold">{t('profitData')}</Label>
              <Textarea
                id="profitData"
                value={profitData}
                onChange={(e) => setProfitData(e.target.value)}
                placeholder={t('profitDataPlaceholder')}
                rows={8}
                className="shadow-inner focus:ring-2 focus:ring-primary"
                aria-describedby="profitDataHelp"
              />
              <p id="profitDataHelp" className="text-sm text-muted-foreground">
                {t('profitDataHelp')}
              </p>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('error')}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full shadow-md hover:shadow-lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('estimating')}
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {t('estimateTax')}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {estimationResult && (
        <Card className="mt-8 shadow-xl animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              {estimationResult.isAccurate ? (
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              ) : (
                <AlertCircle className="h-7 w-7 text-yellow-500" />
              )}
              {t('estimationResult')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">{t('estimatedQuarterlyTax')}</Label>
              <p className="text-2xl font-semibold text-primary">{estimationResult.estimatedTax}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">{t('accuracy')}</Label>
              <p className={`text-lg font-medium ${estimationResult.isAccurate ? 'text-green-600' : 'text-yellow-600'}`}>
                {estimationResult.isAccurate ? t('accuracyConsidered') : t('accuracyNeedsInfo')}
              </p>
            </div>
            {estimationResult.additionalDataNeeded && (
              <Alert variant={estimationResult.isAccurate ? "default" : "default"} className="bg-accent/20 border-accent/50">
                <AlertCircle className="h-4 w-4 text-accent" />
                <AlertTitle className="text-accent">{t('additionalDataNeeded')}</AlertTitle>
                <AlertDescription>{estimationResult.additionalDataNeeded}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IncomeTaxEstimatorPage;
