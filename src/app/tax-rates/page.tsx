"use client";

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Search, Pencil, Trash2 } from 'lucide-react';
import type { TaxRate } from '@/lib/types';
import { initialTaxRates } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { PrintButton } from '@/components/ui/print-button';

const taxRateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tax rate name is required.'),
  rate: z.coerce.number().min(0, 'Rate must be a positive number.'),
});

type TaxRateFormValues = z.infer<typeof taxRateSchema>;

const TaxRatesPage: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [taxRates, setTaxRates] = useState<TaxRate[]>(initialTaxRates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTaxRate, setEditingTaxRate] = useState<TaxRate | null>(null);
  const { toast } = useToast();

  const form = useForm<TaxRateFormValues>({
    resolver: zodResolver(taxRateSchema),
    defaultValues: {
      name: '',
      rate: 0,
    },
  });

  useEffect(() => {
    if (editingTaxRate) {
      form.reset(editingTaxRate);
    } else {
      form.reset({
        id: '',
        name: '',
        rate: 0,
      });
    }
  }, [editingTaxRate, form]);

  const onSubmit = (data: TaxRateFormValues) => {
    if (editingTaxRate) {
      const updatedRate = { ...editingTaxRate, ...data };
      setTaxRates(prev => prev.map(r => r.id === editingTaxRate.id ? updatedRate : r));
      toast({ title: 'Success', description: 'Tax rate has been updated.' });
    } else {
      const newTaxRate: TaxRate = {
        id: `TR${Math.random().toString(36).substr(2, 9)}`,
        ...data,
      };
      setTaxRates(prev => [...prev, newTaxRate]);
      toast({ title: 'Success', description: 'New tax rate has been added.' });
    }
    
    setIsDialogOpen(false);
    setEditingTaxRate(null);
  };

  const handleAddNew = () => {
    setEditingTaxRate(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (rate: TaxRate) => {
    setEditingTaxRate(rate);
    setIsDialogOpen(true);
  };

  const filteredTaxRates = taxRates.filter(
    (rate) =>
      rate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Tax Rates</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2" /> Add Tax Rate
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTaxRate ? 'Edit Tax Rate' : 'New Tax Rate'}</DialogTitle>
              </DialogHeader>
               <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input placeholder="e.g., GST 18%" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rate (%)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 18" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                placeholder="Search by Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
            </div>
            <PrintButton />
        </div>

        <div id="print-content" className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Rate (%)</TableHead>
                <TableHead className="text-right print-hidden">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTaxRates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell className="font-medium">{rate.name}</TableCell>
                  <TableCell className="text-right">{rate.rate.toFixed(2)}</TableCell>
                  <TableCell className="text-right print-hidden">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(rate)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TaxRatesPage;
