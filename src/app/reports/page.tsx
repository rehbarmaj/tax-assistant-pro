
"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, BarChart2, PieChart, LineChart } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { initialLedgerAccounts, initialPurchaseNotes, initialSaleNotes } from '@/lib/mock-data';
import type { LedgerAccount, PurchaseNote, SaleNote } from '@/lib/types';
import { formatCurrency } from '@/lib/currency';

const reportTypes = [
  { value: 'trial-balance', label: 'Trial Balance', icon: BarChart2 },
  { value: 'profit-loss', label: 'Profit & Loss Statement', icon: LineChart },
  { value: 'balance-sheet', label: 'Balance Sheet', icon: PieChart },
  { value: 'sales-report', label: 'Sales Report', icon: BarChart2 },
  { value: 'purchase-report', label: 'Purchase Report', icon: BarChart2 },
];

interface ReportData {
  trialBalance?: { account: LedgerAccount; debit: number; credit: number }[];
  profitLoss?: { revenues: number; cogs: number; expenses: number };
  balanceSheet?: { assets: number; liabilities: number; equity: number };
  salesReport?: SaleNote[];
  purchaseReport?: PurchaseNote[];
}

// --- Report Display Components ---

const TrialBalanceTable = ({ data }: { data: ReportData['trialBalance'] }) => {
  if (!data) return null;
  const totals = data.reduce((acc, item) => ({
    debit: acc.debit + item.debit,
    credit: acc.credit + item.credit,
  }), { debit: 0, credit: 0 });

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Account Code</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Account Name</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Debit</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Credit</th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-border">
          {data.map(({ account, debit, credit }) => (
            <tr key={account.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{account.code}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{account.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{debit > 0 ? formatCurrency(debit) : '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{credit > 0 ? formatCurrency(credit) : '-'}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-muted/50 font-bold">
          <tr>
            <td colSpan={2} className="px-6 py-3 text-right text-sm">Total</td>
            <td className="px-6 py-3 text-right text-sm">{formatCurrency(totals.debit)}</td>
            <td className="px-6 py-3 text-right text-sm">{formatCurrency(totals.credit)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

const ProfitLossStatement = ({ data }: { data: ReportData['profitLoss'] }) => {
    if (!data) return null;
    const grossProfit = data.revenues - data.cogs;
    const netProfit = grossProfit - data.expenses;
    return (
        <div className="w-full max-w-2xl mx-auto">
            <Card>
                <CardHeader><CardTitle>Profit & Loss Statement</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium">Total Revenue</span>
                        <span>{formatCurrency(data.revenues)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium text-destructive">Cost of Goods Sold (COGS)</span>
                        <span className="text-destructive">({formatCurrency(data.cogs)})</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b text-lg font-bold">
                        <span>Gross Profit</span>
                        <span>{formatCurrency(grossProfit)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium text-destructive">Operating Expenses</span>
                        <span className="text-destructive">({formatCurrency(data.expenses)})</span>
                    </div>
                    <div className="flex justify-between items-center py-3 mt-4 text-xl font-bold bg-muted/50 px-4 rounded-md">
                        <span>Net Profit</span>
                        <span className={netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>{formatCurrency(netProfit)}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const BalanceSheet = ({ data }: { data: ReportData['balanceSheet'] }) => {
    if (!data) return null;
    const totalEquityAndLiabilities = data.liabilities + data.equity;
    return (
        <div className="w-full max-w-2xl mx-auto">
            <Card>
                <CardHeader><CardTitle>Balance Sheet</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Assets</h3>
                        <div className="flex justify-between py-1">
                            <span>Total Assets</span>
                            <span className="font-bold">{formatCurrency(data.assets)}</span>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Liabilities & Equity</h3>
                        <div className="flex justify-between py-1">
                            <span>Total Liabilities</span>
                            <span>{formatCurrency(data.liabilities)}</span>
                        </div>
                         <div className="flex justify-between py-1 border-b">
                            <span>Total Equity</span>
                            <span>{formatCurrency(data.equity)}</span>
                        </div>
                        <div className="flex justify-between py-2 font-bold">
                            <span>Total Liabilities & Equity</span>
                            <span>{formatCurrency(totalEquityAndLiabilities)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const SalesReportTable = ({ data }: { data: ReportData['salesReport'] }) => {
  if (!data) return null;
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Note #</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Grand Total</th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-border">
          {data.map((note) => (
            <tr key={note.id}>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{note.noteNumber}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">{format(note.date, 'PPP')}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">{note.customerName}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right">{formatCurrency(note.grandTotal, note.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PurchaseReportTable = ({ data }: { data: ReportData['purchaseReport'] }) => {
  if (!data) return null;
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Note #</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Supplier</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Grand Total</th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-border">
          {data.map((note) => (
            <tr key={note.id}>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{note.noteNumber}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">{format(note.date, 'PPP')}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">{note.supplierName}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right">{formatCurrency(note.grandTotal, note.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Main Page Component ---

const ReportsPage: NextPage = () => {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const ReportIcon = reportTypes.find(r => r.value === selectedReport)?.icon || BarChart2;
  
  const generateReport = () => {
    let data: ReportData = {};
    switch (selectedReport) {
      case 'trial-balance':
        data.trialBalance = initialLedgerAccounts.map(account => {
            const isDebit = account.code.startsWith('1') || account.code.startsWith('5');
            const balance = Math.abs(account.balance);
            return {
                account,
                debit: isDebit ? balance : 0,
                credit: !isDebit ? balance : 0
            };
        });
        break;
      case 'profit-loss':
        const revenues = Math.abs(initialLedgerAccounts.filter(a => a.code.startsWith('4')).reduce((sum, acc) => sum + acc.balance, 0));
        const cogs = Math.abs(initialLedgerAccounts.filter(a => a.code.startsWith('5.01')).reduce((sum, acc) => sum + acc.balance, 0));
        const expenses = Math.abs(initialLedgerAccounts.filter(a => a.code.startsWith('5.02')).reduce((sum, acc) => sum + acc.balance, 0));
        data.profitLoss = { revenues, cogs, expenses };
        break;
      case 'balance-sheet':
        const assets = Math.abs(initialLedgerAccounts.filter(a => a.code.startsWith('1')).reduce((sum, acc) => sum + acc.balance, 0));
        const liabilities = Math.abs(initialLedgerAccounts.filter(a => a.code.startsWith('2')).reduce((sum, acc) => sum + acc.balance, 0));
        const equity = Math.abs(initialLedgerAccounts.filter(a => a.code.startsWith('3')).reduce((sum, acc) => sum + acc.balance, 0));
        data.balanceSheet = { assets, liabilities, equity };
        break;
      case 'sales-report':
        data.salesReport = initialSaleNotes;
        break;
      case 'purchase-report':
        data.purchaseReport = initialPurchaseNotes;
        break;
    }
    setReportData(data);
  };

  const renderReport = () => {
    if (!reportData) {
      return (
        <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Please generate a report to see the data.</p>
        </div>
      );
    }
    switch(selectedReport) {
        case 'trial-balance': return <TrialBalanceTable data={reportData.trialBalance} />;
        case 'profit-loss': return <ProfitLossStatement data={reportData.profitLoss} />;
        case 'balance-sheet': return <BalanceSheet data={reportData.balanceSheet} />;
        case 'sales-report': return <SalesReportTable data={reportData.salesReport} />;
        case 'purchase-report': return <PurchaseReportTable data={reportData.purchaseReport} />;
        default: return <p>Selected report is not available.</p>;
    }
  };


  return (
    <div className="container mx-auto">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Reports</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Report Generator</CardTitle>
            <CardDescription>Select a report type and date range to generate a report.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(report => (
                    <SelectItem key={report.value} value={report.value}>
                      <div className="flex items-center gap-2">
                        <report.icon className="h-4 w-4" />
                        {report.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
               <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                    disabled // Disabling date range as it's not used in this mock implementation
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button size="lg" onClick={generateReport} disabled={!selectedReport}>Generate Report</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ReportIcon className="h-6 w-6 text-primary" />
              <CardTitle>{selectedReport ? reportTypes.find(r => r.value === selectedReport)?.label : "Report View"}</CardTitle>
            </div>
            {selectedReport &&
                <CardDescription>
                Displaying {reportTypes.find(r => r.value === selectedReport)?.label}
                </CardDescription>
            }
          </CardHeader>
          <CardContent>
            {renderReport()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
