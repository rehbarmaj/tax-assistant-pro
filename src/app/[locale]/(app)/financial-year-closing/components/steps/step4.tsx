"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Step4Props {
  onBack: () => void;
  finalizeClosing: (data: any) => void;
  reviewData: any;
  formData: any;
  setFormData: (data: any) => void;
}

const Step4: React.FC<Step4Props> = ({ onBack, finalizeClosing, reviewData, formData, setFormData }) => {

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, reviewedAndConfirmed: checked });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Final Review and Confirmation</h2>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Summary:</h3>
        <pre className="p-4 border rounded bg-muted/50 text-sm">{JSON.stringify(reviewData, null, 2)}</pre>
      </div>
      <div className="mb-4">
        <p>Please review all the information carefully before finalizing the financial year closing.</p>
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="reviewedAndConfirmed"
            checked={formData.reviewedAndConfirmed}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="reviewedAndConfirmed">
            I have reviewed the final financial statements and confirm they are accurate.
          </Label>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={() => finalizeClosing(formData)} disabled={!formData.reviewedAndConfirmed}>Finish</Button>
      </div>
    </div>
  );
};

export default Step4;
