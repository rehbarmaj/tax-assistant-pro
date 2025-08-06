"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface Step2Props {
  onBack: () => void;
  onNext: () => void;
  formData: any;
  setFormData: (data: any) => void;
}

const Step2: React.FC<Step2Props> = ({ onBack, onNext, formData, setFormData }) => {
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, preliminaryReportReview: e.target.value });
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, preliminaryReportsReviewed: checked });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2: Review Preliminary Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Review key preliminary financial reports (e.g., Trial Balance, Income Statement, Balance Sheet) and note any discrepancies or areas requiring further investigation.</p>
        <div>
          <Label htmlFor="preliminaryReportReview">Notes on Preliminary Reports:</Label>
          <Textarea
            id="preliminaryReportReview"
            value={formData.preliminaryReportReview || ''}
            onChange={handleTextareaChange}
            placeholder="Enter notes here..."
            rows={5}
          />
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Preliminary Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">Total Revenue:</p>
              <p className="text-lg font-semibold">$ [Placeholder Revenue]</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Expenses:</p>
              <p className="text-lg font-semibold">$ [Placeholder Expenses]</p>
            </div>
            <div>
              <p className="text-sm font-medium">Net Profit:</p>
              <p className="text-lg font-semibold">$ [Placeholder Net Profit]</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="preliminaryReportsReviewed"
            checked={formData.preliminaryReportsReviewed || false}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="preliminaryReportsReviewed">I have reviewed the preliminary financial reports.</Label>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={onNext} disabled={!formData.preliminaryReportsReviewed}>Next</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step2;
