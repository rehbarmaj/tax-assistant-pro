
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { ControlGroup, SubControlGroup, LedgerAccount, ChartOfAccount } from '@/lib/types';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import { PlusCircle, Edit, Trash2, Landmark, Folder, FileText } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from '@/lib/utils';

// --- Mock Data ---
const initialControlGroups: ControlGroup[] = [
    { id: '1', code: '1', name: 'Assets', level: 1 },
    { id: '2', code: '2', name: 'Liabilities', level: 1 },
    { id: '3', code: '3', name: 'Equity', level: 1 },
    { id: '4', code: '4', name: 'Revenue', level: 1 },
    { id: '5', code: '5', name: 'Expenses', level: 1 },
];

const initialSubControlGroups: SubControlGroup[] = [
    { id: '1.01', code: '1.01', name: 'Current Assets', controlGroupId: '1', level: 2 },
    { id: '1.02', code: '1.02', name: 'Fixed Assets', controlGroupId: '1', level: 2 },
    { id: '2.01', code: '2.01', name: 'Current Liabilities', controlGroupId: '2', level: 2 },
    { id: '4.01', code: '4.01', name: 'Sales Revenue', controlGroupId: '4', level: 2 },
    { id: '5.01', code: '5.01', name: 'Cost of Goods Sold', controlGroupId: '5', level: 2 },
    { id: '5.02', code: '5.02', name: 'Operating Expenses', controlGroupId: '5', level: 2 },
];

const initialLedgerAccounts: LedgerAccount[] = [
    { id: '1.01.001', code: '1.01.001', name: 'Cash', subControlGroupId: '1.01', balance: 50000, canPost: true, level: 3, currency: 'USD' },
    { id: '1.01.002', code: '1.01.002', name: 'Accounts Receivable', subControlGroupId: '1.01', balance: 15000, canPost: true, level: 3, currency: 'USD' },
    { id: '1.02.001', code: '1.02.001', name: 'Furniture & Fixtures', subControlGroupId: '1.02', balance: 25000, canPost: true, level: 3, currency: 'USD' },
    { id: '2.01.001', code: '2.01.001', name: 'Accounts Payable', subControlGroupId: '2.01', balance: -10000, canPost: true, level: 3, currency: 'USD' },
    { id: '4.01.001', code: '4.01.001', name: 'Product Sales', subControlGroupId: '4.01', balance: -150000, canPost: true, level: 3, currency: 'USD' },
    { id: '5.02.001', code: '5.02.001', name: 'Rent Expense', subControlGroupId: '5.02', balance: 20000, canPost: true, level: 3, currency: 'USD' },
];
// --- End Mock Data ---

const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount);
};

export function AccountsClient() {
  const [controlGroups, setControlGroups] = useState<ControlGroup[]>([]);
  const [subControlGroups, setSubControlGroups] = useState<SubControlGroup[]>([]);
  const [ledgerAccounts, setLedgerAccounts] = useState<LedgerAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ChartOfAccount | null>(null);
  const [dialogContext, setDialogContext] = useState<{ level: 1 | 2 | 3, parentId?: string } | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setControlGroups(initialControlGroups);
      setSubControlGroups(initialSubControlGroups);
      setLedgerAccounts(initialLedgerAccounts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleOpenDialog = (level: 1 | 2 | 3, parentId?: string, accountToEdit?: ChartOfAccount) => {
    setEditingAccount(accountToEdit || null);
    setDialogContext({ level, parentId });
    setIsDialogOpen(true);
  };

  const handleDelete = (account: ChartOfAccount) => {
    // Mock validation: prevent deletion if account has children
    if (account.level === 1) {
      if (subControlGroups.some(scg => scg.controlGroupId === account.id)) {
        alert("Cannot delete a control group that has sub-control groups.");
        return;
      }
      setControlGroups(cgs => cgs.filter(cg => cg.id !== account.id));
    } else if (account.level === 2) {
      if (ledgerAccounts.some(la => la.subControlGroupId === account.id)) {
        alert("Cannot delete a sub-control group that has ledger accounts.");
        return;
      }
      setSubControlGroups(scgs => scgs.filter(scg => scg.id !== account.id));
    } else if (account.level === 3) {
      if ((account as LedgerAccount).balance !== 0) {
        alert("Cannot delete a ledger account with a non-zero balance.");
        return;
      }
      setLedgerAccounts(las => las.filter(la => la.id !== account.id));
    }
  };

  const handleSave = (accountData: ChartOfAccount) => {
    if (editingAccount) { // Editing existing account
      if (accountData.level === 1) {
        setControlGroups(cgs => cgs.map(cg => cg.id === accountData.id ? accountData as ControlGroup : cg));
      } else if (accountData.level === 2) {
        setSubControlGroups(scgs => scgs.map(scg => scg.id === accountData.id ? accountData as SubControlGroup : scg));
      } else {
        setLedgerAccounts(las => las.map(la => la.id === accountData.id ? accountData as LedgerAccount : la));
      }
    } else { // Adding new account
      const newAccount = { ...accountData, id: accountData.code }; // Use code as ID for mock
      if (newAccount.level === 1) {
        setControlGroups(cgs => [...cgs, newAccount as ControlGroup]);
      } else if (newAccount.level === 2) {
        setSubControlGroups(scgs => [...scgs, newAccount as SubControlGroup]);
      } else {
        setLedgerAccounts(las => [...las, { ...newAccount, balance: 0, currency: 'USD' } as LedgerAccount]);
      }
    }
    setIsDialogOpen(false);
    setEditingAccount(null);
    setDialogContext(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
            <Landmark className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Chart of Accounts</h1>
        </div>
        <Button onClick={() => handleOpenDialog(1)} variant="default" className="shadow-md hover:shadow-lg">
          <PlusCircle className="mr-2 h-5 w-5" /> Add Control Group
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {controlGroups.sort((a,b) => a.code.localeCompare(b.code)).map(cg => (
                <AccordionItem value={cg.id} key={cg.id}>
                  <AccordionTrigger className="hover:bg-muted/50 px-2 rounded-md">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <Folder className="h-5 w-5 text-primary/70" />
                            <span className="font-bold">{cg.code} - {cg.name}</span>
                        </div>
                        <div className="flex items-center gap-2 pr-4">
                            <div role="button" onClick={(e) => { e.stopPropagation(); handleOpenDialog(1, undefined, cg); }} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-7 w-7")}>
                                <Edit className="h-4 w-4" />
                            </div>
                            <div role="button" onClick={(e) => { e.stopPropagation(); handleDelete(cg); }} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-7 w-7")}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </div>
                            <div role="button" onClick={(e) => { e.stopPropagation(); handleOpenDialog(2, cg.id); }} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-7")}>
                                <PlusCircle className="h-4 w-4 mr-2" />Add Sub-Group
                            </div>
                        </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-6 border-l-2 border-primary/20 ml-3">
                    <Accordion type="multiple" className="w-full">
                      {subControlGroups.filter(scg => scg.controlGroupId === cg.id).sort((a,b) => a.code.localeCompare(b.code)).map(scg => (
                        <AccordionItem value={scg.id} key={scg.id} className="border-b-0">
                           <AccordionTrigger className="hover:bg-muted/50 px-2 rounded-md">
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                        <Folder className="h-5 w-5 text-secondary-foreground/70" />
                                        <span>{scg.code} - {scg.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 pr-4">
                                        <div role="button" onClick={(e) => { e.stopPropagation(); handleOpenDialog(2, cg.id, scg); }} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-7 w-7")}>
                                            <Edit className="h-4 w-4" />
                                        </div>
                                        <div role="button" onClick={(e) => { e.stopPropagation(); handleDelete(scg); }} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-7 w-7")}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </div>
                                        <div role="button" onClick={(e) => { e.stopPropagation(); handleOpenDialog(3, scg.id); }} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-7")}>
                                            <PlusCircle className="h-4 w-4 mr-2" />Add Ledger
                                        </div>
                                    </div>
                                </div>
                            </AccordionTrigger>
                           <AccordionContent className="pl-6 border-l-2 border-secondary/20 ml-3 py-2 space-y-1">
                                {ledgerAccounts.filter(la => la.subControlGroupId === scg.id).sort((a,b) => a.code.localeCompare(b.code)).map(la => (
                                    <div key={la.id} className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted/50">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-muted-foreground" />
                                            <span>{la.code} - {la.name}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono text-sm">{formatCurrency(la.balance, la.currency)}</span>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenDialog(3, scg.id, la)}><Edit className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(la)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                           </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {isDialogOpen && (
        <AccountDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
          account={editingAccount}
          context={dialogContext!}
          controlGroups={controlGroups}
          subControlGroups={subControlGroups}
        />
      )}
    </div>
  );
}

interface AccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (accountData: ChartOfAccount) => void;
  account: ChartOfAccount | null;
  context: { level: 1 | 2 | 3, parentId?: string };
  controlGroups: ControlGroup[];
  subControlGroups: SubControlGroup[];
}

function AccountDialog({ isOpen, onClose, onSave, account, context, controlGroups, subControlGroups }: AccountDialogProps) {
  const [formData, setFormData] = useState<Partial<ChartOfAccount>>({});

  useEffect(() => {
    if (isOpen) {
      if (account) {
        setFormData(account);
      } else {
        // Prefill for new account
        const baseData: Partial<ChartOfAccount> = {
            level: context.level,
            code: '',
            name: '',
        };
        if (context.level === 2 && context.parentId) {
            (baseData as Partial<SubControlGroup>).controlGroupId = context.parentId;
        }
        if (context.level === 3 && context.parentId) {
            (baseData as Partial<LedgerAccount>).subControlGroupId = context.parentId;
            (baseData as Partial<LedgerAccount>).canPost = true;
        }
        setFormData(baseData);
      }
    }
  }, [account, isOpen, context]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
        alert("Account code and name are required.");
        return;
    }
    onSave(formData as ChartOfAccount);
  };
  
  const getDialogTitle = () => {
      const action = account ? 'Edit' : 'Add New';
      if(context.level === 1) return `${action} Control Group`;
      if(context.level === 2) return `${action} Sub-Control Group`;
      if(context.level === 3) return `${action} Ledger Account`;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] shadow-xl">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            Fill in the details for the account. The code should reflect its hierarchy.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            { (context.level === 2 || context.level === 3) && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Parent Group</Label>
                    <div className="col-span-3">
                        <Input 
                            value={
                                context.level === 2 
                                ? controlGroups.find(cg => cg.id === (formData as SubControlGroup).controlGroupId)?.name
                                : subControlGroups.find(scg => scg.id === (formData as LedgerAccount).subControlGroupId)?.name
                            } 
                            disabled 
                        />
                    </div>
                </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">Code</Label>
              <Input id="code" name="code" value={formData.code || ''} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} className="col-span-3" required />
            </div>
            { context.level === 3 && (
                <>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="balance" className="text-right">Opening Balance</Label>
                    <Input id="balance" name="balance" type="number" step="0.01" value={(formData as LedgerAccount).balance || 0} onChange={handleChange} className="col-span-3" required disabled={!!account} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="canPost" className="text-right">Posting Allowed</Label>
                    <Switch
                        id="canPost"
                        checked={(formData as LedgerAccount).canPost}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, canPost: checked }))}
                        className="col-span-3"
                    />
                </div>
                </>
            )}

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
