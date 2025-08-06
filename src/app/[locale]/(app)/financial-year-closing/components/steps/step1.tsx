'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { ChangeEvent, FormEvent } from 'react';

interface Step1Props {
 onNext: (data: any) => void;
 formData: {
  fiscalYear: string,
  checklist: {
    allTransactionsRecorded: boolean,
    bankStatementsReconciled: boolean,
    accrualsReviewed: boolean
  }
 };
 setFormData: (data: any) => void;
}

const Step1 = ({ onNext, formData, setFormData }: Step1Props) => {
  const { fiscalYear, checklist } = formData;

  const handleFiscalYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, fiscalYear: e.target.value });
  };
  
  const handleChecklistChange = (key: keyof typeof checklist, checked: boolean) => {
    setFormData({ 
      ...formData, 
      checklist: { ...checklist, [key]: checked }
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (fiscalYear && checklist.allTransactionsRecorded && checklist.bankStatementsReconciled && checklist.accrualsReviewed) {
      onNext(formData);
    }
  };

  const canProceed = fiscalYear && checklist.allTransactionsRecorded && checklist.bankStatementsReconciled && checklist.accrualsReviewed;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fiscalYear">Fiscal Year to Close</Label>
        <Input
          id="fiscalYear"
          type="text"
          value={fiscalYear}
          onChange={handleFiscalYearChange}
          placeholder="e.g., 2023-2024"
          required
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Pre-closing Checklist</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="allTransactionsRecorded"
            checked={checklist.allTransactionsRecorded}
            onCheckedChange={(checked) => handleChecklistChange('allTransactionsRecorded', !!checked)}
          />
          <Label htmlFor="allTransactionsRecorded">All transactions for the year are recorded</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="bankStatementsReconciled"
            checked={checklist.bankStatementsReconciled}
            onCheckedChange={(checked) => handleChecklistChange('bankStatementsReconciled', !!checked)}
          />
          <Label htmlFor="bankStatementsReconciled">Bank statements are reconciled</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="accrualsReviewed"
            checked={checklist.accrualsReviewed}
            onCheckedChange={(checked) => handleChecklistChange('accrualsReviewed', !!checked)}
          />
          <Label htmlFor="accrualsReviewed">Accruals and prepayments are reviewed and adjusted</Label>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button type="submit" disabled={!canProceed}>Next</Button>
      </div>
    </form>
  );
};

export default Step1;
