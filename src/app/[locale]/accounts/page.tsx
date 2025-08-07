
"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { useI18n } from '@/i18n/client';
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
import type { ControlGroup, SubControlGroup, ControlAccount, LedgerAccount, ChartOfAccount } from '@/lib/types';
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

const AccountsClient: React.FC = () => {
  const t = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([
    ...initialControlGroups,
    ...initialSubControlGroups,
    ...initialControlAccounts,
    ...initialLedgerAccounts,
  ]);

  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderAccountRow = (account: ChartOfAccount) => (
    <TableRow key={account.id} style={{ paddingLeft: `${(account.level - 1) * 2}rem` }} className={account.level === 1 ? 'bg-secondary/50 font-bold' : ''}>
      <TableCell className={`pl-${(account.level - 1) * 4 + 4}`}>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('accounts')}</h1>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2" /> {t('add')} Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Ledger Account</DialogTitle>
              </DialogHeader>
              {/* Add form fields here */}
              <DialogFooter>
                <Button variant="outline">{t('cancel')}</Button>
                <Button>{t('save')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t('search')}
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
  );
};


const AccountsPage: NextPage = () => {
  return (
    <div className="container mx-auto">
      <AccountsClient />
    </div>
  );
};

export default AccountsPage;
