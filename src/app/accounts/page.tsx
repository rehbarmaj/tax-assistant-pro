
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
import { PlusCircle, Search, FileDown, ChevronsUpDown, Pencil, Trash2 } from 'lucide-react';
import type { ChartOfAccount, LedgerAccount, ControlAccount } from '@/lib/types';
import {
  initialControlGroups,
  initialSubControlGroups,
  initialControlAccounts,
  initialLedgerAccounts,
} from '@/lib/mock-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SearchableAccountDropdown from '@/components/ui/searchable-account-dropdown';
import { useToast } from '@/hooks/use-toast';


const accountSchema = z.object({
  code: z.string().min(1, 'Account code is required.'),
  name: z.string().min(1, 'Account name is required.'),
  controlAccountId: z.string().min(1, 'Parent account is required.'),
});

type AccountFormValues = z.infer<typeof accountSchema>;


const AccountsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([
    ...initialControlGroups,
    ...initialSubControlGroups,
    ...initialControlAccounts,
    ...initialLedgerAccounts,
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      code: '',
      name: '',
      controlAccountId: '',
    },
  });

  const onSubmit = (data: AccountFormValues) => {
    console.log('New Account Data:', data);
    const parentAccount = initialControlAccounts.find(acc => acc.id === data.controlAccountId);
    if (!parentAccount) {
        toast({ variant: 'destructive', title: 'Error', description: 'Invalid parent account selected.' });
        return;
    }
    
    const newAccount: LedgerAccount = {
        id: `L${Math.random().toString(36).substr(2, 9)}`,
        code: data.code,
        name: data.name,
        controlAccountId: data.controlAccountId,
        balance: 0,
        canPost: true,
        level: 4,
        currency: 'USD'
    };
    
    setAccounts(prev => [...prev, newAccount]);
    toast({ title: 'Success', description: 'New ledger account has been added.' });
    form.reset();
    setIsDialogOpen(false);
  };


  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderAccountRow = (account: ChartOfAccount) => (
    <TableRow key={account.id} className={account.level === 1 ? 'bg-secondary/50 font-bold' : ''}>
      <TableCell style={{ paddingLeft: `${(account.level - 1) * 1.5 + 1}rem` }}>
        {account.code}
      </TableCell>
      <TableCell>{account.name}</TableCell>
      <TableCell>{account.level}</TableCell>
      <TableCell>
        {(account as LedgerAccount).balance !== undefined
          ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: (account as LedgerAccount).currency || 'USD',
            }).format((account as LedgerAccount).balance)
          : 'N/A'}
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="container mx-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Chart of Accounts</h1>
            <div className="flex items-center gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2" /> Add Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Ledger Account</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Code</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 1.01.2.002" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Petty Cash" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="controlAccountId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parent Control Account</FormLabel>
                            <FormControl>
                                <SearchableAccountDropdown
                                    accounts={initialControlAccounts}
                                    value={initialControlAccounts.find(acc => acc.id === field.value)}
                                    onSelect={(account) => field.onChange(account?.id || '')}
                                />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <DialogClose asChild>
                           <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search..."
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
                  <TableHead>Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts
                  .sort((a, b) => a.code.localeCompare(b.code))
                  .map(renderAccountRow)}
              </TableBody>
            </Table>
          </div>
        </div>
    </div>
  );
};

export default AccountsPage;
