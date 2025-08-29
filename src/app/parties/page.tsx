
"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
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
} from '@/components/ui/dialog';
import { PlusCircle, Search, FileDown, ChevronsUpDown, Pencil, Trash2 } from 'lucide-react';
import { initialLedgerAccounts } from '@/lib/mock-data';
import type { LedgerAccount } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PartiesPage: NextPage = () => {
  // We only show accounts that are parties (Debtors or Creditors)
  const [parties, setParties] = useState<LedgerAccount[]>(initialLedgerAccounts.filter(acc => acc.controlAccountId === '1.01.1' || acc.controlAccountId === '2.01.1'));
  const [searchTerm, setSearchTerm] = useState('');

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
                 <Dialog>
                    <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2" /> Add Party
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Add New Client or Vendor</DialogTitle>
                    </DialogHeader>
                    {/* Add party form here */}
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
