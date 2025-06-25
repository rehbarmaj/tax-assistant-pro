
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { SaleReturnNote, DocumentItem, Product, TaxRate } from '@/lib/types';
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
import { PlusCircle, Edit, Trash2, Search, Redo2, Calendar as CalendarIcon, MinusCircle, Printer } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// MOCK DATA - In a real app, this would come from an API
const mockTaxRates: TaxRate[] = [
  { id: 'rate1', name: 'GST 5%', rate: 5 },
  { id: 'rate2', name: 'GST 12%', rate: 12 },
  { id: 'rate3', name: 'GST 18%', rate: 18 },
  { id: 'rate4', name: 'No Tax', rate: 0 },
];
const mockProducts: Product[] = [
  { id: '1', code: 'P001', name: 'Premium Keyboard', unit: 'pcs', purchasePrice: 45, salePrice: 75, hsnSac: '847160', taxRateId: 'rate3' },
  { id: '2', code: 'P002', name: 'Optical Mouse', unit: 'pcs', purchasePrice: 10, salePrice: 20, hsnSac: '847160', taxRateId: 'rate2' },
  { id: '3', code: 'P003', name: '27-inch Monitor', unit: 'pcs', purchasePrice: 150, salePrice: 250, hsnSac: '852852', taxRateId: 'rate3' },
];
const initialSaleReturnNotes: SaleReturnNote[] = [
  { 
    id: 'srn1', 
    noteNumber: 'SRN001', 
    date: new Date('2023-10-12'), 
    customerName: 'Global Corp',
    originalSaleNoteNumber: 'SN001',
    items: [
      { id: 'item1', productId: '3', productName: '27-inch Monitor', hsnSac: '852852', serialNumber: 'SN-MON-101', quantity: 1, unitPrice: 250, taxRateId: 'rate3', taxAmount: 45, totalAmount: 295 },
    ],
    subTotal: 250,
    discountAmount: 0,
    totalTaxAmount: 45,
    grandTotal: 295,
    currency: 'USD'
  },
];

const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount);
};
const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "PPP");
};

export function SalesReturnsClient() {
  const [notes, setNotes] = useState<SaleReturnNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<SaleReturnNote | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setNotes(initialSaleReturnNotes);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddNote = () => {
    setEditingNote(null);
    setIsDialogOpen(true);
  };
  const handleEditNote = (note: SaleReturnNote) => {
    setEditingNote(note);
    setIsDialogOpen(true);
  };
  const handleDeleteNote = (id: string) => setNotes(notes.filter(n => n.id !== id));
  
  const handleSaveNote = (noteData: Omit<SaleReturnNote, 'id' | 'currency'> & { id?: string }) => {
    if (editingNote && noteData.id) {
      setNotes(notes.map(n => (n.id === noteData.id ? { ...n, ...noteData, currency: 'USD' } : n)));
    } else {
      setNotes([...notes, { ...noteData, id: `srn${Date.now()}`, currency: 'USD' } as SaleReturnNote]);
    }
    setIsDialogOpen(false);
    setEditingNote(null);
  };
  
  const filteredNotes = useMemo(() => notes.filter(note =>
    note.noteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.originalSaleNoteNumber.toLowerCase().includes(searchTerm.toLowerCase())
  ), [notes, searchTerm]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
            <Redo2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Sales Returns</h1>
        </div>
        <Button onClick={handleAddNote} className="shadow-md hover:shadow-lg">
          <PlusCircle className="mr-2 h-5 w-5" /> Add Sales Return
        </Button>
      </div>
      <div className="mb-6 p-4 border rounded-lg shadow-sm bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search by return note #, customer, or original note #..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Return #</TableHead><TableHead>Date</TableHead><TableHead>Customer</TableHead>
              <TableHead>Original Note #</TableHead>
              <TableHead className="text-right">Total Amount</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {isLoading ? Array.from({ length: 1 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell><TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell><TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              )) : filteredNotes.length > 0 ? filteredNotes.map(note => (
                <TableRow key={note.id}>
                  <TableCell className="font-medium">{note.noteNumber}</TableCell><TableCell>{formatDate(note.date)}</TableCell>
                  <TableCell>{note.customerName}</TableCell>
                  <TableCell>{note.originalSaleNoteNumber}</TableCell>
                  <TableCell className="text-right">{formatCurrency(note.grandTotal, note.currency)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditNote(note)} className="hover:text-primary"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(note.id)} className="hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={6} className="text-center h-24">No sales returns found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <SaleReturnNoteDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSave={handleSaveNote} note={editingNote} />
    </div>
  );
}

// Dialog Component
interface SaleReturnNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: Omit<SaleReturnNote, 'id' | 'currency'> & { id?: string }) => void; 
  note: SaleReturnNote | null;
}

const defaultItem = (): Omit<DocumentItem, 'id'|'productName'|'taxAmount'|'totalAmount'> => ({
    productId: '', hsnSac: '', serialNumber: '', quantity: 1, unitPrice: 0, taxRateId: mockTaxRates.find(r => r.rate === 0)?.id
});

function SaleReturnNoteDialog({ isOpen, onClose, onSave, note }: SaleReturnNoteDialogProps) {
  const [formData, setFormData] = useState<Partial<Omit<SaleReturnNote, 'currency'>>>({});
  
  useEffect(() => {
    if (isOpen) {
      if (note) {
        setFormData(note);
      } else {
        setFormData({
          noteNumber: `SRN${Date.now().toString().slice(-4)}`,
          date: new Date(),
          customerName: '',
          originalSaleNoteNumber: '',
          items: [{ ...defaultItem(), id: String(Math.random()) }],
          discountAmount: 0,
          narration: '',
        });
      }
    }
  }, [note, isOpen]);

  const totals = useMemo(() => {
    const subTotal = formData.items?.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0) || 0;
    const totalTaxAmount = formData.items?.reduce((acc, item) => {
        const rate = mockTaxRates.find(r => r.id === item.taxRateId)?.rate || 0;
        return acc + (item.quantity * item.unitPrice * (rate / 100));
    }, 0) || 0;
    const grandTotal = subTotal - (formData.discountAmount || 0) + totalTaxAmount;
    return { subTotal, totalTaxAmount, grandTotal };
  }, [formData.items, formData.discountAmount]);

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleItemChange = (index: number, field: keyof DocumentItem, value: any) => {
    const newItems = [...(formData.items || [])];
    const item = { ...newItems[index] };
    
    if (field === 'productId') {
        const product = mockProducts.find(p => p.id === value);
        item.productId = value;
        item.productName = product?.name || '';
        item.unitPrice = product?.salePrice || 0;
        item.taxRateId = product?.taxRateId;
        item.hsnSac = product?.hsnSac || '';
    } else if (field === 'quantity' || field === 'unitPrice') {
        (item as any)[field] = parseFloat(value) || 0;
    } else {
        (item as any)[field] = value;
    }

    newItems[index] = item;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItemLine = () => setFormData(prev => ({ ...prev, items: [...(prev.items || []), { ...defaultItem(), id: String(Math.random()) }] }));
  const removeItemLine = (index: number) => {
    const newItems = [...(formData.items || [])];
    newItems.splice(index, 1);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.noteNumber || !formData.date || !formData.customerName || !formData.originalSaleNoteNumber) {
      alert("Return Note #, Date, Customer Name and Original Note # are required.");
      return;
    }
    const finalItems = (formData.items || []).map(item => {
        const rate = mockTaxRates.find(r => r.id === item.taxRateId)?.rate || 0;
        const taxAmount = item.quantity * item.unitPrice * (rate / 100);
        return {
            ...item,
            taxAmount,
            totalAmount: (item.quantity * item.unitPrice) + taxAmount
        };
    });
    const finalNote = { ...formData, ...totals, items: finalItems };
    onSave(finalNote as Omit<SaleReturnNote, 'id' | 'currency'> & { id?: string });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="max-w-5xl shadow-xl">
      <DialogHeader>
        <DialogTitle>{note ? 'Edit Sales Return' : 'Add New Sales Return'}</DialogTitle>
        <DialogDescription>Fill in the details for the sales return.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}><div className="grid gap-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div><Label htmlFor="noteNumber">Return #</Label><Input id="noteNumber" name="noteNumber" value={formData.noteNumber || ''} onChange={handleHeaderChange} required /></div>
          <div><Label htmlFor="customerName">Customer Name</Label><Input id="customerName" name="customerName" value={formData.customerName || ''} onChange={handleHeaderChange} required /></div>
          <div><Label>Date</Label><Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />{formData.date ? formatDate(formData.date) : <span>Pick a date</span>}
          </Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.date} onSelect={(date) => setFormData(prev => ({...prev, date}))} initialFocus /></PopoverContent></Popover></div>
          <div><Label htmlFor="originalSaleNoteNumber">Original Note #</Label><Input id="originalSaleNoteNumber" name="originalSaleNoteNumber" value={formData.originalSaleNoteNumber || ''} onChange={handleHeaderChange} required /></div>
        </div>
        <Card><CardContent className="p-0">
          <Label className="text-base font-semibold px-4 pt-4 block">Returned Items</Label>
          <ScrollArea className="h-[250px] p-4"><Table className="min-w-full">
            <TableHeader><TableRow>
              <TableHead className="w-[25%]">Product</TableHead>
              <TableHead className="w-[20%]">HSN / Serial #</TableHead>
              <TableHead className="w-[10%]">Qty</TableHead>
              <TableHead className="w-[10%]">Unit Price</TableHead>
              <TableHead className="w-[15%]">Tax Rate</TableHead>
              <TableHead className="w-[15%] text-right">Line Total</TableHead>
              <TableHead className="w-[5%]">Act</TableHead>
            </TableRow></TableHeader>
            <TableBody>{formData.items?.map((item, index) => {
              const lineSubtotal = item.quantity * item.unitPrice;
              const taxRateValue = mockTaxRates.find(r => r.id === item.taxRateId)?.rate || 0;
              const lineTax = lineSubtotal * (taxRateValue / 100);
              const lineTotal = lineSubtotal + lineTax;
              return (<TableRow key={item.id || index}>
                <TableCell><Select value={item.productId} onValueChange={(val) => handleItemChange(index, 'productId', val)} required><SelectTrigger><SelectValue placeholder="Select Product" /></SelectTrigger><SelectContent>
                  {mockProducts.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent></Select></TableCell>
                <TableCell>
                  <Input value={item.hsnSac || ''} onChange={(e) => handleItemChange(index, 'hsnSac', e.target.value)} placeholder="HSN/SAC" className="mb-1 h-8" />
                  <Input value={item.serialNumber || ''} onChange={(e) => handleItemChange(index, 'serialNumber', e.target.value)} placeholder="Serial #" className="h-8" />
                </TableCell>
                <TableCell><Input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} required min={1} className="h-8"/></TableCell>
                <TableCell><Input type="number" step="0.01" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)} required min={0} className="h-8" /></TableCell>
                <TableCell><Select value={item.taxRateId} onValueChange={(val) => handleItemChange(index, 'taxRateId', val)}><SelectTrigger className="h-8"><SelectValue placeholder="Select Tax" /></SelectTrigger><SelectContent>
                  {mockTaxRates.map(r => <SelectItem key={r.id} value={r.id}>{r.name} ({r.rate}%)</SelectItem>)}
                </SelectContent></Select></TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(lineTotal)}</TableCell>
                <TableCell className="text-right">{formData.items.length > 1 && (<Button type="button" variant="ghost" size="icon" onClick={() => removeItemLine(index)} className="text-destructive hover:text-destructive"><MinusCircle className="h-4 w-4" /></Button>)}</TableCell>
              </TableRow>);
            })}</TableBody>
          </Table></ScrollArea>
          <div className="p-4 border-t"><Button type="button" variant="outline" size="sm" onClick={addItemLine}><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button></div>
        </CardContent></Card>
        <div className="grid md:grid-cols-2 gap-4">
            <div><Label htmlFor="narration">Narration / Notes</Label><Textarea id="narration" name="narration" value={formData.narration || ''} onChange={handleHeaderChange} rows={4} /></div>
            <Card><CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Subtotal:</span><span className="font-semibold">{formatCurrency(totals.subTotal)}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Discount:</span><Input name="discountAmount" type="number" step="0.01" value={formData.discountAmount || 0} onChange={handleHeaderChange} className="h-8 w-24 text-right" /></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Tax:</span><span className="font-semibold">{formatCurrency(totals.totalTaxAmount)}</span></div>
                <hr className="my-1" />
                <div className="flex justify-between items-center text-lg"><span className="font-bold">Grand Total:</span><span className="font-bold text-primary">{formatCurrency(totals.grandTotal)}</span></div>
            </CardContent></Card>
        </div>
      </div>
      <DialogFooter className="no-print flex items-center gap-2 pt-6 mt-4 border-t">
        <Button type="button" variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print
        </Button>
        <div className="flex-grow" />
        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
        <Button type="submit">{note ? 'Save Changes' : 'Create Return Note'}</Button>
      </DialogFooter>
      </form>
    </DialogContent></Dialog>
  );
}
