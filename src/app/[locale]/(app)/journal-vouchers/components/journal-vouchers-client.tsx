
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { JournalVoucher, JournalEntry } from '@/lib/types';
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
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Edit, Trash2, Search, BookCopy, Calendar as CalendarIcon, MinusCircle, Printer } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from '@/components/ui/scroll-area';
import { initialJournalVouchers } from '@/lib/mock-data';

const defaultJournalEntry = (): Omit<JournalEntry, 'id'> => ({
  accountName: '',
  debit: 0,
  credit: 0,
  narration: '',
});

const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount);
};

const formatDate = (date: Date | string) => {
  if (typeof date === 'string') {
    return format(parseISO(date), "PPP");
  }
  return format(date, "PPP");
};

export function JournalVouchersClient() {
  const [vouchers, setVouchers] = useState<JournalVoucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<JournalVoucher | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVouchers(initialJournalVouchers);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddVoucher = () => {
    setEditingVoucher(null);
    setIsDialogOpen(true);
  };

  const handleEditVoucher = (voucher: JournalVoucher) => {
    setEditingVoucher(voucher);
    setIsDialogOpen(true);
  };

  const handleDeleteVoucher = (id: string) => {
    setVouchers(vouchers.filter(v => v.id !== id));
  };

  const handleSaveVoucher = (voucherData: Omit<JournalVoucher, 'id' | 'currency'> & { id?: string }) => {
    if (editingVoucher && voucherData.id) {
      setVouchers(vouchers.map(v => (v.id === voucherData.id ? { ...v, ...voucherData, currency: 'USD' } : v)));
    } else {
      setVouchers([...vouchers, { ...voucherData, id: String(Date.now()), currency: 'USD' } as JournalVoucher]);
    }
    setIsDialogOpen(false);
    setEditingVoucher(null);
  };
  
  const filteredVouchers = useMemo(() => vouchers.filter(voucher =>
    voucher.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (voucher.narration && voucher.narration.toLowerCase().includes(searchTerm.toLowerCase())) ||
    voucher.entries.some(entry => entry.accountName.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [vouchers, searchTerm]);

  const calculateTotals = (entries: JournalEntry[]) => {
    return entries.reduce((acc, entry) => {
      acc.debit += entry.debit || 0;
      acc.credit += entry.credit || 0;
      return acc;
    }, { debit: 0, credit: 0 });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
            <BookCopy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Journal Vouchers</h1>
        </div>
        <Button onClick={handleAddVoucher} variant="default" className="shadow-md hover:shadow-lg">
          <PlusCircle className="mr-2 h-5 w-5" /> Add Journal Voucher
        </Button>
      </div>

      <div className="mb-6 p-4 border rounded-lg shadow-sm bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search by voucher #, narration, or account name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voucher #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Narration</TableHead>
                <TableHead className="text-right">Total Debit</TableHead>
                <TableHead className="text-right">Total Credit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : filteredVouchers.length > 0 ? (
                filteredVouchers.map(voucher => {
                  const totals = calculateTotals(voucher.entries);
                  return (
                    <TableRow key={voucher.id}>
                      <TableCell className="font-medium">{voucher.voucherNumber}</TableCell>
                      <TableCell>{formatDate(voucher.date)}</TableCell>
                      <TableCell className="truncate max-w-xs">{voucher.narration || 'N/A'}</TableCell>
                      <TableCell className="text-right">{formatCurrency(totals.debit, voucher.currency)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(totals.credit, voucher.currency)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditVoucher(voucher)} className="hover:text-primary">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteVoucher(voucher.id)} className="hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No journal vouchers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <JournalVoucherDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveVoucher}
        voucher={editingVoucher}
      />
    </div>
  );
}

interface JournalVoucherDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (voucherData: Omit<JournalVoucher, 'id' | 'currency'> & { id?: string }) => void; 
  voucher: JournalVoucher | null;
}

function JournalVoucherDialog({ isOpen, onClose, onSave, voucher }: JournalVoucherDialogProps) {
  const [formData, setFormData] = useState<Partial<Omit<JournalVoucher, 'currency'>>>({ entries: [defaultJournalEntry()] });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (isOpen) {
      if (voucher) {
        setFormData({
            ...voucher,
            // Ensure entries always have an ID for key purposes in rendering
            entries: voucher.entries.map(e => ({ ...e, id: e.id || String(Math.random())}))
        });
        setSelectedDate(voucher.date ? new Date(voucher.date) : new Date());
      } else {
        const defaultDate = new Date();
        setFormData({
          voucherNumber: '',
          date: defaultDate,
          narration: '',
          entries: [{ ...defaultJournalEntry(), id: String(Math.random()) }],
        });
        setSelectedDate(defaultDate);
      }
    }
  }, [voucher, isOpen]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, date: selectedDate }));
  }, [selectedDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEntryChange = (index: number, field: keyof JournalEntry, value: string | number) => {
    const newEntries = [...(formData.entries || [])];
    if (field === 'debit' || field === 'credit') {
        newEntries[index] = { ...newEntries[index], [field]: parseFloat(value as string) || 0 };
    } else {
        newEntries[index] = { ...newEntries[index], [field]: value };
    }
    setFormData(prev => ({ ...prev, entries: newEntries }));
  };

  const addEntryLine = () => {
    setFormData(prev => ({
      ...prev,
      entries: [...(prev.entries || []), { ...defaultJournalEntry(), id: String(Math.random()) }],
    }));
  };

  const removeEntryLine = (index: number) => {
    const newEntries = [...(formData.entries || [])];
    newEntries.splice(index, 1);
    setFormData(prev => ({ ...prev, entries: newEntries }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.voucherNumber || !formData.date || !formData.entries || formData.entries.length === 0) {
        alert("Voucher #, Date, and at least one entry are required.");
        return;
    }
    const totals = formData.entries.reduce((acc, entry) => {
        acc.debit += entry.debit || 0;
        acc.credit += entry.credit || 0;
        return acc;
    }, {debit: 0, credit: 0});

    if (totals.debit !== totals.credit) {
        alert(`Total debits (${formatCurrency(totals.debit)}) must equal total credits (${formatCurrency(totals.credit)}).`);
        return;
    }
    // Remove temporary 'id' from entries before saving if it was only for client-side keying
    const entriesToSave = formData.entries.map(({ id, ...rest}) => rest);

    onSave({ ...formData, entries: entriesToSave } as Omit<JournalVoucher, 'id' | 'currency'> & { id?: string });
  };

  const currentTotals = useMemo(() => {
    if (!formData.entries) return { debit: 0, credit: 0 };
    return formData.entries.reduce((acc, entry) => {
      acc.debit += Number(entry.debit) || 0;
      acc.credit += Number(entry.credit) || 0;
      return acc;
    }, { debit: 0, credit: 0 });
  }, [formData.entries]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl shadow-xl">
        <DialogHeader>
          <DialogTitle>{voucher ? 'Edit Journal Voucher' : 'Add New Journal Voucher'}</DialogTitle>
          <DialogDescription>
            Fill in the details for the journal voucher. Ensure total debits equal total credits.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="voucherNumber">Voucher #</Label>
                <Input id="voucherNumber" name="voucherNumber" value={formData.voucherNumber || ''} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn( "w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? formatDate(selectedDate) : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="md:col-span-3">
                <Label htmlFor="narration">Overall Narration</Label>
                <Textarea id="narration" name="narration" value={formData.narration || ''} onChange={handleInputChange} rows={2} />
              </div>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Label className="text-base font-semibold px-4 pt-4 block">Journal Entries</Label>
                <ScrollArea className="h-[250px] p-4">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30%]">Account Name</TableHead>
                        <TableHead className="w-[15%] text-right">Debit</TableHead>
                        <TableHead className="w-[15%] text-right">Credit</TableHead>
                        <TableHead className="w-[30%]">Line Narration</TableHead>
                        <TableHead className="w-[10%] text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.entries?.map((entry, index) => (
                        <TableRow key={entry.id || index}>
                          <TableCell>
                            <Input 
                              value={entry.accountName} 
                              onChange={(e) => handleEntryChange(index, 'accountName', e.target.value)} 
                              placeholder="e.g., Cash, Sales Revenue"
                              required
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              step="0.01" 
                              value={entry.debit} 
                              onChange={(e) => handleEntryChange(index, 'debit', e.target.value)}
                              className="text-right"
                              disabled={!!entry.credit && entry.credit > 0}
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              step="0.01" 
                              value={entry.credit} 
                              onChange={(e) => handleEntryChange(index, 'credit', e.target.value)}
                              className="text-right"
                              disabled={!!entry.debit && entry.debit > 0}
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={entry.narration || ''} 
                              onChange={(e) => handleEntryChange(index, 'narration', e.target.value)}
                              placeholder="Optional line specific note" 
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            {formData.entries && formData.entries.length > 1 && (
                              <Button type="button" variant="ghost" size="icon" onClick={() => removeEntryLine(index)} className="text-destructive hover:text-destructive">
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <div className="p-4 border-t">
                   <Button type="button" variant="outline" size="sm" onClick={addEntryLine}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Line
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center p-4 border-t bg-muted/50">
                  <div className="text-sm font-semibold">
                    Totals:
                  </div>
                  <div className={`flex gap-4 font-semibold ${currentTotals.debit !== currentTotals.credit ? 'text-destructive' : 'text-green-600'}`}>
                    <span>Debits: {formatCurrency(currentTotals.debit)}</span>
                    <span>Credits: {formatCurrency(currentTotals.credit)}</span>
                  </div>
              </CardFooter>
            </Card>
            {currentTotals.debit !== currentTotals.credit && (
                <p className="text-sm text-destructive text-center">
                    Total debits and credits must match. Current difference: {formatCurrency(Math.abs(currentTotals.debit - currentTotals.credit))}
                </p>
            )}
          </div>
          <DialogFooter className="no-print flex items-center gap-2 pt-6 mt-4 border-t">
            <Button type="button" variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <div className="flex-grow" />
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="default" className="shadow-md hover:shadow-lg">{voucher ? 'Save Changes' : 'Create Voucher'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
