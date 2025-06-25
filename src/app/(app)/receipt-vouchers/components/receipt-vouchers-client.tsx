
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { ReceiptVoucher, VoucherMode } from '@/lib/types';
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
import { PlusCircle, Edit, Trash2, Search, ArrowBigDownDash, Calendar as CalendarIcon, Printer } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

const initialReceiptVouchers: ReceiptVoucher[] = [
  { id: 'rv1', voucherNumber: 'RV001', date: new Date('2023-10-02'), partyName: 'Client A Services', amount: 1200.00, receiptMode: 'Bank Transfer', narration: 'Payment for project X', currency: 'USD' },
  { id: 'rv2', voucherNumber: 'RV002', date: new Date('2023-10-08'), partyName: 'Customer B Goods', amount: 350.50, receiptMode: 'Cash', narration: 'Sale of product Y', currency: 'USD' },
  { id: 'rv3', voucherNumber: 'RV003', date: new Date('2023-10-12'), partyName: 'Client C Consulting', amount: 2500.00, receiptMode: 'Cheque', narration: 'Consulting fees', currency: 'USD' },
];

const voucherModeOptions: { value: VoucherMode; label: string }[] = [
  { value: 'Cash', label: 'Cash' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'Cheque', label: 'Cheque' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Card', label: 'Card' },
  { value: 'Other', label: 'Other' },
];

export function ReceiptVouchersClient() {
  const [vouchers, setVouchers] = useState<ReceiptVoucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<ReceiptVoucher | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVouchers(initialReceiptVouchers);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddVoucher = () => {
    setEditingVoucher(null);
    setIsDialogOpen(true);
  };

  const handleEditVoucher = (voucher: ReceiptVoucher) => {
    setEditingVoucher(voucher);
    setIsDialogOpen(true);
  };

  const handleDeleteVoucher = (id: string) => {
    setVouchers(vouchers.filter(v => v.id !== id));
  };

  const handleSaveVoucher = (voucherData: Omit<ReceiptVoucher, 'id' | 'currency'> & { id?: string }) => {
    if (editingVoucher && voucherData.id) {
      setVouchers(vouchers.map(v => (v.id === voucherData.id ? { ...v, ...voucherData, currency: 'USD' } : v)));
    } else {
      setVouchers([...vouchers, { ...voucherData, id: String(Date.now()), currency: 'USD' } as ReceiptVoucher]);
    }
    setIsDialogOpen(false);
    setEditingVoucher(null);
  };
  
  const filteredVouchers = useMemo(() => vouchers.filter(voucher =>
    voucher.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (voucher.narration && voucher.narration.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [vouchers, searchTerm]);

  const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
      return format(parseISO(date), "PPP");
    }
    return format(date, "PPP");
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
            <ArrowBigDownDash className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Receipt Vouchers</h1>
        </div>
        <Button onClick={handleAddVoucher} variant="default" className="shadow-md hover:shadow-lg">
          <PlusCircle className="mr-2 h-5 w-5" /> Add Receipt Voucher
        </Button>
      </div>

      <div className="mb-6 p-4 border rounded-lg shadow-sm bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search by voucher #, party, or narration..." 
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
                <TableHead>Party Name</TableHead>
                <TableHead>Receipt Mode</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Narration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : filteredVouchers.length > 0 ? (
                filteredVouchers.map(voucher => (
                  <TableRow key={voucher.id}>
                    <TableCell className="font-medium">{voucher.voucherNumber}</TableCell>
                    <TableCell>{formatDate(voucher.date)}</TableCell>
                    <TableCell>{voucher.partyName}</TableCell>
                    <TableCell>{voucher.receiptMode}</TableCell>
                    <TableCell className="text-right">{formatCurrency(voucher.amount, voucher.currency)}</TableCell>
                    <TableCell className="truncate max-w-xs">{voucher.narration || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditVoucher(voucher)} className="hover:text-primary">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteVoucher(voucher.id)} className="hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No receipt vouchers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <VoucherDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveVoucher}
        voucher={editingVoucher}
        voucherType="Receipt"
      />
    </div>
  );
}

interface VoucherDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (voucherData: Omit<ReceiptVoucher, 'id' | 'currency'> & { id?: string }) => void;
  voucher: ReceiptVoucher | null;
  voucherType: 'Payment' | 'Receipt';
}

function VoucherDialog({ isOpen, onClose, onSave, voucher, voucherType }: VoucherDialogProps) {
  const [formData, setFormData] = useState<Partial<Omit<ReceiptVoucher, 'currency'>>>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (isOpen) {
      if (voucher) {
        setFormData(voucher);
        setSelectedDate(voucher.date ? new Date(voucher.date) : new Date());
      } else {
        const defaultDate = new Date();
        setFormData({
          voucherNumber: '',
          date: defaultDate,
          partyName: '',
          receiptMode: voucherModeOptions[0].value, // Default to first mode
          amount: 0,
          narration: '',
        });
        setSelectedDate(defaultDate);
      }
    }
  }, [voucher, isOpen]);
  
  useEffect(() => {
    setFormData(prev => ({ ...prev, date: selectedDate }));
  }, [selectedDate]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value as VoucherMode }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.voucherNumber || !formData.partyName || !formData.date || formData.amount === undefined) {
        alert("Voucher #, Date, Party Name, and Amount are required.");
        return;
    }
    onSave(formData as Omit<ReceiptVoucher, 'id' | 'currency'> & { id?: string });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] shadow-xl">
        <DialogHeader>
          <DialogTitle>{voucher ? `Edit ${voucherType} Voucher` : `Add New ${voucherType} Voucher`}</DialogTitle>
          <DialogDescription>
            Fill in the information for the {voucherType.toLowerCase()} voucher.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="voucherNumber" className="text-right">Voucher #</Label>
              <Input id="voucherNumber" name="voucherNumber" value={formData.voucherNumber || ''} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "col-span-3 justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="partyName" className="text-right">Party Name</Label>
              <Input id="partyName" name="partyName" value={formData.partyName || ''} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="receiptMode" className="text-right">Mode</Label>
              <Select name="receiptMode" value={formData.receiptMode} onValueChange={(value) => handleSelectChange('receiptMode', value)} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  {voucherModeOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">Amount</Label>
              <Input id="amount" name="amount" type="number" step="0.01" value={formData.amount || 0} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="narration" className="text-right">Narration</Label>
              <Textarea id="narration" name="narration" value={formData.narration || ''} onChange={handleChange} className="col-span-3" rows={3}/>
            </div>
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
