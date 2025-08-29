"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Search, Pencil, Trash2 } from 'lucide-react';
import type { PurchaseNote } from '@/lib/types';
import { initialPurchaseNotes } from '@/lib/mock-data';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/currency';
import { PrintButton } from '@/components/ui/print-button';

const PurchaseNotesPage: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState<PurchaseNote[]>(initialPurchaseNotes);

  const filteredNotes = notes.filter(
    (note) =>
      note.noteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Purchase Notes</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2" /> Add Purchase Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl">
              <DialogHeader>
                <DialogTitle>New Purchase Note</DialogTitle>
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
              placeholder="Search by Note # or Supplier"
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
                <TableHead>Note #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Supplier Name</TableHead>
                <TableHead className="text-right">Grand Total</TableHead>
                <TableHead className="text-right print-hidden">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell className="font-medium">{note.noteNumber}</TableCell>
                  <TableCell>{format(note.date, 'PPP')}</TableCell>
                  <TableCell>{note.supplierName}</TableCell>
                  <TableCell className="text-right">{formatCurrency(note.grandTotal, note.currency)}</TableCell>
                  <TableCell className="text-right print-hidden">
                    <Button variant="ghost" size="icon" disabled>
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

export default PurchaseNotesPage;
