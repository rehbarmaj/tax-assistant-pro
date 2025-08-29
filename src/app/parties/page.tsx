
"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, FileDown, ChevronsUpDown, Pencil, Trash2 } from 'lucide-react';
import { initialLedgerAccounts, initialControlAccounts } from '@/lib/mock-data';
import type { LedgerAccount } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const partySchema = z.object({
  name: z.string().min(1, 'Party name is required.'),
  type: z.enum(['1.01.1', '2.01.1'], { required_error: 'Party type is required.' }), // Debtors or Creditors
  ntn: z.string().optional(),
  strn: z.string().optional(),
  contactPerson: z.string().optional(),
  contactNumber: z.string().optional(),
});

type PartyFormValues = z.infer<typeof partySchema>;

const PartiesPage: NextPage = () => {
  const [parties, setParties] = useState<LedgerAccount[]>(initialLedgerAccounts.filter(acc => acc.controlAccountId === '1.01.1' || acc.controlAccountId === '2.01.1'));
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<PartyFormValues>({
    resolver: zodResolver(partySchema),
    defaultValues: {
      name: '',
      ntn: '',
      strn: '',
      contactPerson: '',
      contactNumber: '',
    },
  });
  
  const onSubmit = (data: PartyFormValues) => {
    const parentAccount = initialControlAccounts.find(acc => acc.id === data.type);
    if (!parentAccount) {
      toast({ variant: 'destructive', title: 'Error', description: 'Invalid party type.' });
      return;
    }

    const maxCode = parties
        .filter(p => p.controlAccountId === data.type)
        .map(p => parseInt(p.code.split('.').pop() || '0'))
        .reduce((max, num) => Math.max(max, num), 0);

    const newCode = `${data.type}.${(maxCode + 1).toString().padStart(3, '0')}`;
    
    const newParty: LedgerAccount = {
        id: `L${Math.random().toString(36).substr(2, 9)}`,
        code: newCode,
        name: data.name,
        controlAccountId: data.type,
        balance: 0,
        canPost: true,
        level: 4,
        currency: 'USD',
        ntn: data.ntn,
        strn: data.strn,
        contactPerson: data.contactPerson,
        contactNumber: data.contactNumber,
    };

    setParties(prev => [...prev, newParty]);
    toast({ title: 'Success', description: 'New party has been added.' });
    form.reset();
    setIsDialogOpen(false);
  };

  const filteredParties = parties.filter(
    (party) =>
      party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (party.ntn && party.ntn.includes(searchTerm)) ||
      (party.strn && party.strn.includes(searchTerm))
  );

  return (
    <div className="container mx-auto">
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Clients & Vendors</h1>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2" /> Add Party
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Add New Client or Vendor</DialogTitle>
                    </DialogHeader>
                     <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                             <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Party Name</FormLabel>
                                  <FormControl><Input placeholder="e.g., Global Corp" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                             <FormField
                              control={form.control}
                              name="type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Party Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="1.01.1">Client (Debtor)</SelectItem>
                                      <SelectItem value="2.01.1">Vendor (Creditor)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <FormField
                              control={form.control}
                              name="ntn"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>NTN</FormLabel>
                                  <FormControl><Input placeholder="National Tax Number" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                             <FormField
                              control={form.control}
                              name="strn"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>STRN</FormLabel>
                                  <FormControl><Input placeholder="Sales Tax Registration Number" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                           <div className="grid grid-cols-2 gap-4">
                             <FormField
                              control={form.control}
                              name="contactPerson"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contact Person</FormLabel>
                                  <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                             <FormField
                              control={form.control}
                              name="contactNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contact Number</FormLabel>
                                  <FormControl><Input placeholder="e.g., 555-1234" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <DialogFooter>
                              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                              <Button type="submit">Save Party</Button>
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
                    placeholder="Search by Name, NTN, or STRN"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
                </div>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                        <FileDown className="mr-2" /> Export
                        <ChevronsUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                        <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>NTN</TableHead>
                    <TableHead>STRN</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Contact Number</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredParties.map((party) => (
                    <TableRow key={party.id}>
                        <TableCell className="font-medium">{party.name}</TableCell>
                        <TableCell>{party.ntn || 'N/A'}</TableCell>
                        <TableCell>{party.strn || 'N/A'}</TableCell>
                        <TableCell>{party.contactPerson || 'N/A'}</TableCell>
                        <TableCell>{party.contactNumber || 'N/A'}</TableCell>
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

export default PartiesPage;
