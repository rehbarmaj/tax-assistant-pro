
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface Step3Props {
  formData: {
    adjustingEntries: { id: number; date: string; account: string; debit: number; credit: number; description: string }[];
  };
  setFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step3: React.FC<Step3Props> = ({ formData, setFormData, onNext, onBack }) => {

  const handleAddEntry = () => {
    const newEntry = {
      id: Date.now(),
      date: '',
      account: '',
      debit: 0,
      credit: 0,
      description: ''
    };
    setFormData((prev: any) => ({
      ...prev,
      adjustingEntries: [...prev.adjustingEntries, newEntry]
    }));
  };

  const handleUpdateEntry = (index: number, field: string, value: string | number) => {
    setFormData((prev: any) => {
      const newEntries = [...prev.adjustingEntries];
      newEntries[index] = { ...newEntries[index], [field]: value };
      return { ...prev, adjustingEntries: newEntries };
    });
  };

  const handleRemoveEntry = (id: number) => {
    setFormData((prev: any) => ({
      ...prev,
      adjustingEntries: prev.adjustingEntries.filter((entry: any) => entry.id !== id)
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Step 3: Make Necessary Adjustments</h2>
      <p className="text-muted-foreground">
        Review the preliminary reports and enter any required adjustments to the financial data.
      </p>

      {formData.adjustingEntries.map((entry, index) => (
        <div key={entry.id} className="border p-4 rounded-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`date-${index}`}>Date</Label>
              <Input id={`date-${index}`} type="date" value={entry.date} onChange={(e) => handleUpdateEntry(index, 'date', e.target.value)} />
            </div>
            <div>
              <Label htmlFor={`account-${index}`}>Account</Label>
              <Input id={`account-${index}`} type="text" value={entry.account} onChange={(e) => handleUpdateEntry(index, 'account', e.target.value)} placeholder="e.g., Depreciation Expense" />
            </div>
            <div>
              <Label htmlFor={`debit-${index}`}>Debit</Label>
              <Input id={`debit-${index}`} type="number" value={entry.debit} onChange={(e) => handleUpdateEntry(index, 'debit', parseFloat(e.target.value))} placeholder="0.00" />
            </div>
            <div>
              <Label htmlFor={`credit-${index}`}>Credit</Label>
              <Input id={`credit-${index}`} type="number" value={entry.credit} onChange={(e) => handleUpdateEntry(index, 'credit', parseFloat(e.target.value))} placeholder="0.00" />
            </div>
          </div>
          <div>
            <Label htmlFor={`description-${index}`}>Description</Label>
            <Textarea id={`description-${index}`} value={entry.description} onChange={(e) => handleUpdateEntry(index, 'description', e.target.value)} placeholder="Reason for adjustment" />
          </div>
          <div className="flex justify-end">
            <Button variant="destructive" size="sm" onClick={() => handleRemoveEntry(entry.id)}>
              <MinusCircle className="mr-2 h-4 w-4" /> Remove Entry
            </Button>
          </div>
        </div>
      ))}

      <div>
        <Button type="button" variant="outline" size="sm" onClick={handleAddEntry}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Adjustment Entry
        </Button>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};

export default Step3;
