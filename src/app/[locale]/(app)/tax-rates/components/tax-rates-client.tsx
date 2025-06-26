
"use client";

import { useState, useEffect } from 'react';
import type { TaxRate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { initialTaxRates } from '@/lib/mock-data';


export function TaxRatesClient() {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTaxRate, setEditingTaxRate] = useState<TaxRate | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTaxRates(initialTaxRates);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddTaxRate = () => {
    setEditingTaxRate(null);
    setIsDialogOpen(true);
  };

  const handleEditTaxRate = (taxRate: TaxRate) => {
    setEditingTaxRate(taxRate);
    setIsDialogOpen(true);
  };

  const handleDeleteTaxRate = (id: string) => {
    // Basic check: Don't allow deletion if rate is in use (mocked)
    // In a real app, this check would be more robust, potentially involving API calls
    const isInUse = id === '1' || id === '3'; // Mocking 'GST 5%' and 'GST 18%' as in use
    if (isInUse) {
      alert("This tax rate cannot be deleted as it is currently assigned to products. Please reassign products to a different tax rate before deleting.");
      return;
    }
    setTaxRates(taxRates.filter(tr => tr.id !== id));
  };

  const handleSaveTaxRate = (taxRateData: Omit<TaxRate, 'id'> & { id?: string }) => {
    if (editingTaxRate && taxRateData.id) {
      setTaxRates(taxRates.map(tr => (tr.id === taxRateData.id ? { ...tr, ...taxRateData } : tr)));
    } else {
      setTaxRates([...taxRates, { ...taxRateData, id: String(Date.now()) } as TaxRate]);
    }
    setIsDialogOpen(false);
    setEditingTaxRate(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Tax Rate Configuration</h1>
        <Button onClick={handleAddTaxRate} variant="default" className="shadow-md hover:shadow-lg">
          <PlusCircle className="mr-2 h-5 w-5" /> Add Tax Rate
        </Button>
      </div>

      <Card className="shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Rate (%)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))
            ) : taxRates.length > 0 ? (
                taxRates.map(taxRate => (
                <TableRow key={taxRate.id}>
                  <TableCell className="font-medium">{taxRate.name}</TableCell>
                  <TableCell className="text-right">{taxRate.rate.toFixed(2)}%</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditTaxRate(taxRate)} className="hover:text-primary">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTaxRate(taxRate.id)} className="hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  No tax rates configured.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <TaxRateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveTaxRate}
        taxRate={editingTaxRate}
      />
    </div>
  );
}

interface TaxRateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taxRateData: Omit<TaxRate, 'id'> & { id?: string }) => void;
  taxRate: TaxRate | null;
}

function TaxRateDialog({ isOpen, onClose, onSave, taxRate }: TaxRateDialogProps) {
  const [formData, setFormData] = useState<Partial<TaxRate>>({});

  useEffect(() => {
    if (taxRate) {
      setFormData(taxRate);
    } else {
      setFormData({ name: '', rate: 0 });
    }
  }, [taxRate, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Omit<TaxRate, 'id'> & { id?: string });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] shadow-xl">
        <DialogHeader>
          <DialogTitle>{taxRate ? 'Edit Tax Rate' : 'Add New Tax Rate'}</DialogTitle>
          <DialogDescription>
            {taxRate ? 'Update the details of the tax rate.' : 'Fill in the information for the new tax rate.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rate" className="text-right">Rate (%)</Label>
              <Input id="rate" name="rate" type="number" step="0.01" value={formData.rate || 0} onChange={handleChange} className="col-span-3" required />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="default" className="shadow-md hover:shadow-lg">{taxRate ? 'Save Changes' : 'Create Tax Rate'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
