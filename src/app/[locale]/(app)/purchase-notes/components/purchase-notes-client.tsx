
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { PurchaseNote, DocumentItem, Product, TaxRate } from '@/lib/types';
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
import { PlusCircle, Edit, Trash2, Search, ShoppingCart, Calendar as CalendarIcon, MinusCircle, Printer } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { initialPurchaseNotes, mockProducts, mockTaxRates } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/currency';


const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "PPP");
};

export function PurchaseNotesClient() {
  const [notes, setNotes] = useState<PurchaseNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<PurchaseNote | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const currencySymbol = '$'; // Simulate fetching setting

  useEffect(() => {
    setTimeout(() => {
      setNotes(initialPurchaseNotes);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddNote = () => {
    setEditingNote(null);
    setIsDialogOpen(true);
  };
  const handleEditNote = (note: PurchaseNote) => {
    setEditingNote(note);
    setIsDialogOpen(true);
  };
  const handleDeleteNote = (id: string) => setNotes(notes.filter(n => n.id !== id));
  
  const handleSaveNote = (noteData: Omit<PurchaseNote, 'id' | 'currency'> & { id?: string }) => {
    if (editingNote && noteData.id) {
      setNotes(notes.map(n => (n.id === noteData.id ? { ...n, ...noteData, currency: 'USD' } : n)));
    } else {
      setNotes([...notes, { ...noteData, id: `pn${Date.now()}`, currency: 'USD' } as PurchaseNote]);
    }
    setIsDialogOpen(false);
    setEditingNote(null);
  };
  
  const filteredNotes = useMemo(() => notes.filter(note =>
    note.noteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.items.some(item => item.productName?.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [notes, searchTerm]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Purchase Notes</h1>
        </div>
        <Button onClick={handleAddNote} className="shadow-md hover:shadow-lg">
          <PlusCircle className="mr-2 h-5 w-5" /> Add Purchase Note
        </Button>
      </div>
      <div className="mb-6 p-4 border rounded-lg shadow-sm bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search by note #, supplier, or product..." 
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
              <TableHead>Note #</TableHead><TableHead>Date</TableHead><TableHead>Supplier</TableHead>
              <TableHead className="text-right">Total Amount</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {isLoading ? Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell><TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell><TableCell className="text-right"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              )) : filteredNotes.length > 0 ? filteredNotes.map(note => (
                <TableRow key={note.id}>
                  <TableCell className="font-medium">{note.noteNumber}</TableCell><TableCell>{formatDate(note.date)}</TableCell>
                  <TableCell>{note.supplierName}</TableCell><TableCell className="text-right">{formatCurrency(note.grandTotal, currencySymbol)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditNote(note)} className="hover:text-primary"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(note.id)} className="hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={5} className="text-center h-24">No purchase notes found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <PurchaseNoteDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSave={handleSaveNote} note={editingNote} currencySymbol={currencySymbol} />
    </div>
  );
}

// Dialog Component
interface PurchaseNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: Omit<PurchaseNote, 'id' | 'currency'> & { id?: string }) => void; 
  note: PurchaseNote | null;
  currencySymbol: string;
}

const defaultItem = (): Omit<DocumentItem, 'id'|'productName'|'taxAmount'|'totalAmount'> => ({
    productId: '', hsnSac: '', serialNumber: '', quantity: 1, unitPrice: 0, taxRateId: mockTaxRates.find(r => r.rate === 0)?.id
});

function PurchaseNoteDialog({ isOpen, onClose, onSave, note, currencySymbol }: PurchaseNoteDialogProps) {
  const [formData, setFormData] = useState<Partial<Omit<PurchaseNote, 'currency'>>>({});
  
  useEffect(() => {
    if (isOpen) {
      if (note) {
        setFormData(note);
      } else {
        setFormData({
          noteNumber: `PN${Date.now().toString().slice(-4)}`,
          date: new Date(),
          supplierName: '',
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
        item.unitPrice = product?.purchasePrice || 0;
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
    if (!formData.noteNumber || !formData.date || !formData.supplierName) {
      alert("Note #, Date, and Supplier Name are required.");
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
    onSave(finalNote as Omit<PurchaseNote, 'id' | 'currency'> & { id?: string });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="max-w-5xl shadow-xl">
      <DialogHeader>
        <DialogTitle>{note ? 'Edit Purchase Note' : 'Add New Purchase Note'}</DialogTitle>
        <DialogDescription>Fill in the details for the purchase. All fields in item rows are required.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}><div className="grid gap-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><Label htmlFor="noteNumber">Note #</Label><Input id="noteNumber" name="noteNumber" value={formData.noteNumber || ''} onChange={handleHeaderChange} required /></div>
          <div><Label htmlFor="supplierName">Supplier Name</Label><Input id="supplierName" name="supplierName" value={formData.supplierName || ''} onChange={handleHeaderChange} required /></div>
          <div><Label>Date</Label><Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />{formData.date ? formatDate(formData.date) : <span>Pick a date</span>}
          </Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.date} onSelect={(date) => setFormData(prev => ({...prev, date}))} initialFocus /></PopoverContent></Popover></div>
        </div>
        <Card><CardContent className="p-0">
          <Label className="text-base font-semibold px-4 pt-4 block">Items</Label>
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
                <TableCell><Input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} required min={1} className="h-8" /></TableCell>
                <TableCell><Input type="number" step="0.01" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)} required min={0} className="h-8" /></TableCell>
                <TableCell><Select value={item.taxRateId} onValueChange={(val) => handleItemChange(index, 'taxRateId', val)}><SelectTrigger className="h-8"><SelectValue placeholder="Select Tax" /></SelectTrigger><SelectContent>
                  {mockTaxRates.map(r => <SelectItem key={r.id} value={r.id}>{r.name} ({r.rate}%)</SelectItem>)}
                </SelectContent></Select></TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(lineTotal, currencySymbol)}</TableCell>
                <TableCell className="text-right">{formData.items.length > 1 && (<Button type="button" variant="ghost" size="icon" onClick={() => removeItemLine(index)} className="text-destructive hover:text-destructive"><MinusCircle className="h-4 w-4" /></Button>)}</TableCell>
              </TableRow>);
            })}</TableBody>
          </Table></ScrollArea>
          <div className="p-4 border-t"><Button type="button" variant="outline" size="sm" onClick={addItemLine}><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button></div>
        </CardContent></Card>
        <div className="grid md:grid-cols-2 gap-4">
            <div><Label htmlFor="narration">Narration / Notes</Label><Textarea id="narration" name="narration" value={formData.narration || ''} onChange={handleHeaderChange} rows={4} /></div>
            <Card><CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Subtotal:</span><span className="font-semibold">{formatCurrency(totals.subTotal, currencySymbol)}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Discount:</span><Input name="discountAmount" type="number" step="0.01" value={formData.discountAmount || 0} onChange={handleHeaderChange} className="h-8 w-24 text-right" /></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Tax:</span><span className="font-semibold">{formatCurrency(totals.totalTaxAmount, currencySymbol)}</span></div>
                <hr className="my-1" />
                <div className="flex justify-between items-center text-lg"><span className="font-bold">Grand Total:</span><span className="font-bold text-primary">{formatCurrency(totals.grandTotal, currencySymbol)}</span></div>
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
        <Button type="submit">{note ? 'Save Changes' : 'Create Note'}</Button>
      </DialogFooter>
      </form>
    </DialogContent></Dialog>
  );
}
