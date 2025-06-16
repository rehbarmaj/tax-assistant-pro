
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Account, AccountType } from '@/lib/types';
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
import { PlusCircle, Edit, Trash2, Search, Landmark } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const initialAccounts: Account[] = [
  { id: '1', name: 'Main Checking Account', type: 'Bank', accountNumber: '**** **** **** 1234', bankName: 'City Bank', balance: 15025.75, currency: 'USD' },
  { id: '2', name: 'Petty Cash', type: 'Cash', balance: 300.00, currency: 'USD' },
  { id: '3', name: 'Business Visa Rewards', type: 'Credit Card', accountNumber: '**** **** **** 5678', bankName: 'Capital One', balance: -2500.50, currency: 'USD' },
  { id: '4', name: 'Startup Loan', type: 'Loan', balance: -50000.00, currency: 'USD' },
  { id: '5', name: 'Owner\'s Equity', type: 'Equity', balance: 75000.00, currency: 'USD' },
];

const accountTypeOptions: { value: AccountType; label: string }[] = [
  { value: 'Bank', label: 'Bank Account' },
  { value: 'Cash', label: 'Cash on Hand' },
  { value: 'Credit Card', label: 'Credit Card' },
  { value: 'Loan', label: 'Loan Account' },
  { value: 'Asset', label: 'Other Asset' },
  { value: 'Liability', label: 'Other Liability' },
  { value: 'Equity', label: 'Equity Account' },
];

export function AccountsClient() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAccounts(initialAccounts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddAccount = () => {
    setEditingAccount(null);
    setIsDialogOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setIsDialogOpen(true);
  };

  const handleDeleteAccount = (id: string) => {
    // Add check: prevent deletion if balance is not zero or if it's a critical account type?
    // For now, simple delete
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  const handleSaveAccount = (accountData: Omit<Account, 'id' | 'currency'> & { id?: string }) => {
    if (editingAccount && accountData.id) {
      setAccounts(accounts.map(acc => (acc.id === accountData.id ? { ...acc, ...accountData, currency: 'USD' } : acc)));
    } else {
      setAccounts([...accounts, { ...accountData, id: String(Date.now()), currency: 'USD' } as Account]);
    }
    setIsDialogOpen(false);
    setEditingAccount(null);
  };
  
  const filteredAccounts = useMemo(() => accounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (account.accountNumber && account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (account.bankName && account.bankName.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [accounts, searchTerm]);

  const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
            <Landmark className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Accounts Management</h1>
        </div>
        <Button onClick={handleAddAccount} variant="default" className="shadow-md hover:shadow-lg">
          <PlusCircle className="mr-2 h-5 w-5" /> Add Account
        </Button>
      </div>

      <div className="mb-6 p-4 border rounded-lg shadow-sm bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search by name, account number, or bank..." 
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
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Bank Name</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : filteredAccounts.length > 0 ? (
                filteredAccounts.map(account => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>{account.type}</TableCell>
                    <TableCell>{account.accountNumber || 'N/A'}</TableCell>
                    <TableCell>{account.bankName || 'N/A'}</TableCell>
                    <TableCell className="text-right">{formatCurrency(account.balance, account.currency)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditAccount(account)} className="hover:text-primary">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteAccount(account.id)} className="hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No accounts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AccountDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveAccount}
        account={editingAccount}
      />
    </div>
  );
}

interface AccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (accountData: Omit<Account, 'id' | 'currency'> & { id?: string }) => void;
  account: Account | null;
}

function AccountDialog({ isOpen, onClose, onSave, account }: AccountDialogProps) {
  const [formData, setFormData] = useState<Partial<Omit<Account, 'currency'>>>({});

  useEffect(() => {
    if (isOpen) {
      if (account) {
        setFormData(account);
      } else {
        setFormData({
          name: '',
          type: accountTypeOptions[0].value, // Default to first type
          accountNumber: '',
          bankName: '',
          balance: 0,
        });
      }
    }
  }, [account, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value as AccountType }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type) {
        alert("Account name and type are required.");
        return;
    }
    onSave(formData as Omit<Account, 'id' | 'currency'> & { id?: string });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] shadow-xl">
        <DialogHeader>
          <DialogTitle>{account ? 'Edit Account' : 'Add New Account'}</DialogTitle>
          <DialogDescription>
            {account ? 'Update the details of this account.' : 'Fill in the information for the new account.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value)} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypeOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountNumber" className="text-right">Account No.</Label>
              <Input id="accountNumber" name="accountNumber" value={formData.accountNumber || ''} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bankName" className="text-right">Bank Name</Label>
              <Input id="bankName" name="bankName" value={formData.bankName || ''} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right">Balance</Label>
              <Input id="balance" name="balance" type="number" step="0.01" value={formData.balance || 0} onChange={handleChange} className="col-span-3" required />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="default" className="shadow-md hover:shadow-lg">{account ? 'Save Changes' : 'Create Account'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
