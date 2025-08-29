
"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Search, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { JournalVoucher, JournalEntry } from '@/lib/types';
import { initialJournalVouchers } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/currency';

const JournalVouchersPage: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vouchers, setVouchers] = useState<JournalVoucher[]>(initialJournalVouchers);

  const filteredVouchers = vouchers.filter(
    (voucher) =>
      voucher.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (voucher.narration && voucher.narration.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const getVoucherTotal = (entries: JournalEntry[]) => {
    return entries.reduce((sum, entry) => sum + entry.debit, 0);
  };

  return (
    <div className="container mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Journal Vouchers</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2" /> Add Journal Voucher
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>New Journal Voucher</DialogTitle>
              </DialogHeader>
              {/* Add form here */}
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </DialogFooter>
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
          {/* Export Dropdown can be added here */}
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voucher #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Narration</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVouchers.map((voucher) => (
                <TableRow key={voucher.id}>
                  <TableCell className="font-medium">{voucher.voucherNumber}</TableCell>
                  <TableCell>{format(voucher.date, 'PPP')}</TableCell>
                  <TableCell>{voucher.narration}</TableCell>
                  <TableCell className="text-right">{formatCurrency(getVoucherTotal(voucher.entries), voucher.currency)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
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
