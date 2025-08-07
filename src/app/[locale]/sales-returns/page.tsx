
"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { useI18n } from '@/i18n/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Search, FileDown, ChevronsUpDown, Pencil, Trash2 } from 'lucide-react';
import type { SaleReturnNote } from '@/lib/types';
import { initialSaleReturnNotes } from '@/lib/mock-data';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/currency';

const SalesReturnsPage: NextPage = () => {
  const t = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState<SaleReturnNote[]>(initialSaleReturnNotes);

  const filteredNotes = notes.filter(
    (note) =>
      note.noteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('salesReturns')}</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2" /> Add Sales Return
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl">
              <DialogHeader>
                <DialogTitle>New Sales Return Note</DialogTitle>
              </DialogHeader>
              {/* Add form here */}
              <DialogFooter>
                <Button variant="outline">{t('cancel')}</Button>
                <Button>{t('save')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={`${t('search')} by Note # or Customer`}
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
                <TableHead>Return Note #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Original Note #</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell className="font-medium">{note.noteNumber}</TableCell>
                  <TableCell>{format(note.date, 'PPP')}</TableCell>
                  <TableCell>{note.customerName}</TableCell>
                  <TableCell>{note.originalSaleNoteNumber}</TableCell>
                  <TableCell className="text-right">{formatCurrency(note.grandTotal, note.currency)}</TableCell>
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

export default SalesReturnsPage;
