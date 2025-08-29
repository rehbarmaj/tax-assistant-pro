"use client";

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, Search, Pencil, Trash2, CalendarIcon } from 'lucide-react';
import type { PaymentVoucher } from '@/lib/types';
import { initialPaymentVouchers, initialLedgerAccounts } from '@/lib/mock-data';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/currency';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchableAccountDropdown from '@/components/ui/searchable-account-dropdown';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PrintButton } from '@/components/ui/print-button';


const voucherSchema = z.object({
  id: z.string().optional(),
  date: z.date({ required_error: "A date is required." }),
  partyId: z.string().min(1, "Please select a party."),
  paymentMode: z.string().min(1, "Please select a payment mode."),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
  narration: z.string().optional(),
});

type VoucherFormValues = z.infer<typeof voucherSchema>;

const PaymentVouchersPage: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vouchers, setVouchers] = useState<PaymentVoucher[]>(initialPaymentVouchers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<PaymentVoucher | null>(null);
  const { toast } = useToast();

  const creditors = initialLedgerAccounts.filter(acc => acc.controlAccountId === '2.01.1');

  const form = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      amount: 0,
      narration: "",
    },
  });
  
  useEffect(() => {
    if (editingVoucher) {
      const party = creditors.find(p => p.name === editingVoucher.partyName);
      form.reset({
        ...editingVoucher,
        partyId: party?.id || '',
      });
    } else {
      form.reset({
        id: '',
        date: new Date(),
        partyId: '',
        paymentMode: '',
        amount: 0,
        narration: '',
      });
    }
  }, [editingVoucher, form, creditors]);

  const onSubmit = (data: VoucherFormValues) => {
    const party = creditors.find(p => p.id === data.partyId);
    if (!party) return;

    if (editingVoucher) {
      // Update existing voucher
      const updatedVoucher = { ...editingVoucher, ...data, partyName: party.name };
      setVouchers(prev => prev.map(v => v.id === editingVoucher.id ? updatedVoucher : v));
      toast({ title: "Success", description: "Payment voucher updated successfully." });
    } else {
      // Add new voucher
      const newVoucher: PaymentVoucher = {
        id: `pv_${Date.now()}`,
        voucherNumber: `PV${(vouchers.length + 1).toString().padStart(3, '0')}`,
        date: data.date,
        partyName: party.name,
        amount: data.amount,
        paymentMode: data.paymentMode as any,
        narration: data.narration,
        currency: 'USD',
      };
      setVouchers(prev => [newVoucher, ...prev]);
      toast({ title: "Success", description: "Payment voucher created successfully." });
    }
    
    setIsDialogOpen(false);
    setEditingVoucher(null);
  };
  
  const handleAddNew = () => {
    setEditingVoucher(null);
    setIsDialogOpen(true);
  };
  
  const handleEdit = (voucher: PaymentVoucher) => {
    setEditingVoucher(voucher);
    setIsDialogOpen(true);
  };

  const filteredVouchers = vouchers.filter(
    (voucher) =>
      voucher.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.partyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Payment Vouchers</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2" /> Add Payment Voucher
            </Button>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingVoucher ? 'Edit Payment Voucher' : 'New Payment Voucher'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                  "w-full pl-3 text-left font-normal",
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
                   <FormField
                    control={form.control}
                    name="partyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Party (Creditor)</FormLabel>
                        <FormControl>
                          <SearchableAccountDropdown
                            accounts={creditors}
                            value={creditors.find(acc => acc.id === field.value)}
                            onSelect={(account) => field.onChange(account?.id || '')}
                            placeholder="Select a creditor"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentMode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Mode</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a mode" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Cash">Cash</SelectItem>
                              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                              <SelectItem value="Cheque">Cheque</SelectItem>
                              <SelectItem value="Card">Card</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
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
                        <FormLabel>Narration</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Optional narration..." {...field} />
                        </FormControl>
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

        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by Voucher # or Party"
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
                <TableHead>Party Name</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right print-hidden">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVouchers.map((voucher) => (
                <TableRow key={voucher.id}>
                  <TableCell className="font-medium">{voucher.voucherNumber}</TableCell>
                  <TableCell>{format(voucher.date, 'PPP')}</TableCell>
                  <TableCell>{voucher.partyName}</TableCell>
                  <TableCell>{voucher.paymentMode}</TableCell>
                  <TableCell className="text-right">{formatCurrency(voucher.amount, voucher.currency)}</TableCell>
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

export default PaymentVouchersPage;
