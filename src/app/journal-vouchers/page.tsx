"use client";

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { PlusCircle, Search, Pencil, Trash2, CalendarIcon, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import type { JournalVoucher, JournalEntry } from '@/lib/types';
import { initialJournalVouchers, initialLedgerAccounts } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/currency';
import SearchableAccountDropdown from '@/components/ui/searchable-account-dropdown';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { PrintButton } from '@/components/ui/print-button';

const journalEntrySchema = z.object({
  id: z.string().optional(),
  accountId: z.string().min(1, "Account is required."),
  debit: z.coerce.number().min(0).default(0),
  credit: z.coerce.number().min(0).default(0),
  narration: z.string().optional(),
});

const journalVoucherSchema = z.object({
  id: z.string().optional(),
  date: z.date({ required_error: "A date is required." }),
  narration: z.string().optional(),
  entries: z.array(journalEntrySchema).min(2, "At least two entries are required."),
}).refine(data => {
    const totalDebit = data.entries.reduce((sum, entry) => sum + entry.debit, 0);
    const totalCredit = data.entries.reduce((sum, entry) => sum + entry.credit, 0);
    return Math.abs(totalDebit - totalCredit) < 0.001; // Use a small tolerance for float comparison
}, {
    message: "Total debits must equal total credits.",
    path: ["entries"],
});

type VoucherFormValues = z.infer<typeof journalVoucherSchema>;

const JournalVouchersPage: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vouchers, setVouchers] = useState<JournalVoucher[]>(initialJournalVouchers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<JournalVoucher | null>(null);
  const { toast } = useToast();

  const form = useForm<VoucherFormValues>({
    resolver: zodResolver(journalVoucherSchema),
    defaultValues: {
      entries: [{ accountId: '', debit: 0, credit: 0 }, { accountId: '', debit: 0, credit: 0 }],
      narration: "",
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "entries",
  });
  
  useEffect(() => {
    if (editingVoucher) {
      const formValues = {
        ...editingVoucher,
        entries: editingVoucher.entries.map(e => ({
          id: e.id,
          accountId: initialLedgerAccounts.find(acc => acc.name === e.accountName)?.id || '',
          debit: e.debit,
          credit: e.credit,
          narration: e.narration,
        }))
      };
      form.reset(formValues);
    } else {
      form.reset({
        id: '',
        date: new Date(),
        narration: '',
        entries: [{ accountId: '', debit: 0, credit: 0 }, { accountId: '', debit: 0, credit: 0 }]
      });
    }
  }, [editingVoucher, form]);

  const entries = useWatch({ control: form.control, name: 'entries' });
  const totalDebit = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  const totalCredit = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);

  const onSubmit = (data: VoucherFormValues) => {
    const voucherData = {
        date: data.date,
        narration: data.narration,
        currency: 'USD',
        entries: data.entries.map(e => ({
            id: e.id || `je_${Math.random()}`,
            accountName: initialLedgerAccounts.find(acc => acc.id === e.accountId)?.name || 'Unknown',
            debit: e.debit,
            credit: e.credit,
            narration: e.narration,
        }))
    };

    if (editingVoucher) {
      const updatedVoucher = { ...editingVoucher, ...voucherData };
      setVouchers(prev => prev.map(v => v.id === editingVoucher.id ? updatedVoucher : v));
      toast({ title: "Success", description: "Journal voucher updated successfully." });
    } else {
      const newVoucher: JournalVoucher = {
        id: `jv_${Date.now()}`,
        voucherNumber: `JV${(vouchers.length + 1).toString().padStart(3, '0')}`,
        ...voucherData
      };
      setVouchers(prev => [newVoucher, ...prev]);
      toast({ title: "Success", description: "Journal voucher created successfully." });
    }
    
    setIsDialogOpen(false);
    setEditingVoucher(null);
  };
  
  const handleAddNew = () => {
    setEditingVoucher(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (voucher: JournalVoucher) => {
    setEditingVoucher(voucher);
    setIsDialogOpen(true);
  };
  
  const getVoucherTotal = (entries: JournalEntry[]) => {
    return entries.reduce((sum, entry) => sum + entry.debit, 0);
  };
  
  const filteredVouchers = vouchers.filter(
    (voucher) =>
      voucher.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (voucher.narration && voucher.narration.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Journal Vouchers</h1>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2" /> Add Journal Voucher
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{editingVoucher ? 'Edit Journal Voucher' : 'New Journal Voucher'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                  <FormField
                    control={form.control}
                    name="narration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overall Narration</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Optional narration for the whole voucher..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-start gap-2">
                        <div className="grid grid-cols-12 gap-2 flex-1">
                          <FormField
                            control={form.control}
                            name={`entries.${index}.accountId`}
                            render={({ field }) => (
                              <FormItem className="col-span-6">
                                <FormControl>
                                  <SearchableAccountDropdown
                                    accounts={initialLedgerAccounts}
                                    value={initialLedgerAccounts.find(acc => acc.id === field.value)}
                                    onSelect={(account) => field.onChange(account?.id || '')}
                                    placeholder="Select an account"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`entries.${index}.debit`}
                            render={({ field }) => (
                              <FormItem className="col-span-3">
                                <FormControl>
                                  <Input type="number" placeholder="Debit" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`entries.${index}.credit`}
                            render={({ field }) => (
                              <FormItem className="col-span-3">
                                <FormControl>
                                  <Input type="number" placeholder="Credit" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length <= 2}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ accountId: '', debit: 0, credit: 0 })}
                  >
                    <PlusCircle className="mr-2" /> Add Row
                  </Button>

                  <Separator />

                  <div className="flex justify-end gap-4 font-mono font-bold text-lg pr-12">
                      <span>{formatCurrency(totalDebit)}</span>
                      <span className={Math.abs(totalDebit - totalCredit) > 0.001 ? 'text-destructive' : ''}>{formatCurrency(totalCredit)}</span>
                  </div>
                  
                   {form.formState.errors.entries && (
                    <div className="text-sm font-medium text-destructive flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {form.formState.errors.entries.message}
                    </div>
                   )}

                  <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by Voucher # or Narration"
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
                <TableHead>Voucher #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Narration</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-right print-hidden">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVouchers.map((voucher) => (
                <TableRow key={voucher.id}>
                  <TableCell className="font-medium">{voucher.voucherNumber}</TableCell>
                  <TableCell>{format(voucher.date, 'PPP')}</TableCell>
                  <TableCell>{voucher.narration}</TableCell>
                  <TableCell className="text-right">{formatCurrency(getVoucherTotal(voucher.entries), voucher.currency)}</TableCell>
                  <TableCell className="text-right print-hidden">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(voucher)}>
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

export default JournalVouchersPage;
