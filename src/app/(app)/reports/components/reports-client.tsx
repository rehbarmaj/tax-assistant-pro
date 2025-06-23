
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, FileText, BarChart3, PackageSearch, Users, Building, Landmark, ClipboardCheck, Scale, FileClock, Percent } from 'lucide-react';
import { cn } from "@/lib/utils";

type ReportType = 
  | 'account-ledger' | 'cost-of-sales' | 'daily-transaction-report' | 'item-ledger'
  | 'sales-tax-register' | 'purchase-tax-register' | 'tax-summary'
  | 'customer-receivables-aging'
  | 'stock-report' | 'item-wise-sales-purchase'
  | 'profit-and-loss' | 'balance-sheet' | 'trial-balance';

type PartyType = 'customer' | 'supplier' | 'account' | 'product';

const reportTypes: { 
  label: string; 
  reports: { value: ReportType; label: string; icon: React.ElementType, description?: string, partyType?: PartyType }[] 
}[] = [
  {
    label: "Financial Reports",
    reports: [
      { value: 'profit-and-loss', label: 'Profit & Loss Account', icon: BarChart3, description: "Summarizes revenues, costs, and expenses." },
      { value: 'balance-sheet', label: 'Balance Sheet', icon: Landmark, description: "Snapshot of assets, liabilities, and equity." },
      { value: 'trial-balance', label: 'Trial Balance', icon: Scale, description: "Lists all ledger account balances." },
    ]
  },
  {
    label: "Ledger & Transaction Reports",
    reports: [
      { value: 'account-ledger', label: 'Account Ledger', icon: Users, description: "Full transaction history for any account.", partyType: 'account' },
      { value: 'item-ledger', label: 'Item Ledger', icon: PackageSearch, description: "History for a specific or all items.", partyType: 'product' },
      { value: 'daily-transaction-report', label: 'Daily Transaction Report', icon: FileClock, description: "All transactions for a selected period." },
    ]
  },
  {
    label: "Tax Reports",
    reports: [
       { value: 'sales-tax-register', label: 'Sales Tax Register (Output)', icon: Percent, description: "Detailed report of sales tax collected." },
       { value: 'purchase-tax-register', label: 'Purchase Tax Register (Input)', icon: Percent, description: "Detailed report of sales tax paid." },
       { value: 'tax-summary', label: 'Input/Output Tax Summary', icon: FileText, description: "A summary of tax liabilities and credits." },
    ]
  },
   {
    label: "Receivables & Inventory",
    reports: [
      { value: 'customer-receivables-aging', label: 'Client Receivables (Aging)', icon: Users, description: "Age-wise analysis of outstanding receivables.", partyType: 'customer' },
      { value: 'stock-report', label: 'Stock Report', icon: PackageSearch, description: "Real-time stock position and valuation.", partyType: 'product' },
      { value: 'item-wise-sales-purchase', label: 'Item-wise Sales/Purchase', icon: ClipboardCheck, description: "Sales and purchase history for items.", partyType: 'product' },
    ]
  },
];

const mockCustomers = [{ id: '1', name: 'Global Tech Corp' }, { id: '2', name: 'Innovate Solutions' }];
const mockSuppliers = [{ id: '1', name: 'Office Supplies Inc.' }, { id: '2', name: 'Component Suppliers' }];
const mockLedgerAccounts = [{id: '1', name: '1.01.001 - Cash'}, {id: '2', name: '4.01.001 - Product Sales'}, { id: '3', name: '1.01.002 - Accounts Receivable' }];
const mockProducts = [{id: '1', name: 'P001 - Premium Keyboard'}, {id: '2', name: 'P002 - Optical Mouse'}, {id: '3', name: 'P003 - 27-inch Monitor'}];


export function ReportsClient() {
  const [reportType, setReportType] = useState<ReportType | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedParty, setSelectedParty] = useState<string | undefined>(undefined);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const getReportDetails = (type?: ReportType) => {
    if (!type) return null;
    for (const group of reportTypes) {
        const found = group.reports.find(r => r.value === type);
        if (found) return found;
    }
    return null;
  }

  const handleGenerateReport = () => {
    const reportDetails = getReportDetails(reportType);
    if (!reportDetails || !startDate || !endDate) {
      alert('Please select a report type and date range.');
      return;
    }
    
    let partyInfo = '';
    if (reportDetails.partyType) {
      if (selectedParty) {
        let partyName = '';
        if (reportDetails.partyType === 'customer') partyName = mockCustomers.find(c => c.id === selectedParty)?.name || '';
        if (reportDetails.partyType === 'supplier') partyName = mockSuppliers.find(s => s.id === selectedParty)?.name || '';
        if (reportDetails.partyType === 'account') partyName = mockLedgerAccounts.find(a => a.id === selectedParty)?.name || '';
        if (reportDetails.partyType === 'product') partyName = mockProducts.find(p => p.id === selectedParty)?.name || '';
        partyInfo = `${reportDetails.label}: ${partyName}`;
      } else if (reportDetails.partyType === 'product') {
        partyInfo = `${reportDetails.label}: All Products`;
      }
    }

    const reportContent = `
**Report Type:** ${reportDetails.label}
**Period:** ${format(startDate, "PPP")} - ${format(endDate, "PPP")}
${partyInfo ? `**${partyInfo}**` : ''}

--- MOCK DATA ---

| Date       | Document# | Details                 | Debit     | Credit    | Balance   |
|------------|-----------|-------------------------|-----------|-----------|-----------|
| 2023-10-01 | SN001     | Sale Note               | $590.00   |           | $590.00   |
| 2023-10-05 | RV002     | Receipt from customer   |           | $590.00   | $0.00     |
| 2023-10-10 | SN002     | Sale Note               | $120.50   |           | $120.50   |
| 2023-10-12 | SRN001    | Sales Return Note       |           | ($80.00)  | $40.50    |

**Summary:**
Total Debits: $710.50
Total Credits: ($670.00)
**Closing Balance: $40.50**

--- End of Mock Data ---
    `;
    setGeneratedReport(reportContent.trim());
  };
  
  const handleExport = (formatType: 'PDF' | 'Excel') => {
    if (!generatedReport) {
      alert('Please generate a report first.');
      return;
    }
    // Mock file download
    const blob = new Blob([generatedReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${reportType}_${new Date().toISOString().split('T')[0]}.${formatType === 'PDF' ? 'pdf' : 'xlsx'}.txt`; // .txt for mock
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(`Report export to ${formatType} initiated (mocked as .txt file download).`);
  };

  const currentReportDetails = getReportDetails(reportType);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Custom Reports</h1>
      </div>

      <Card className="shadow-xl mb-8">
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>Select report type and date range to generate your custom report.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="space-y-2 lg:col-span-2 xl:col-span-1">
            <Label htmlFor="reportType">Report Type</Label>
            <Select value={reportType} onValueChange={(value: ReportType) => {setReportType(value); setSelectedParty(undefined); setGeneratedReport(null)}}>
              <SelectTrigger id="reportType"><SelectValue placeholder="Select a report type" /></SelectTrigger>
              <SelectContent>
                {reportTypes.map((group) => (
                  <SelectGroup key={group.label}>
                    <Label className="px-2 py-1.5 text-xs font-semibold">{group.label}</Label>
                    {group.reports.map((rt) => (
                      <SelectItem key={rt.value} value={rt.value}>
                        <div className="flex items-center gap-2"><rt.icon className="h-4 w-4" />{rt.label}</div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          
           { currentReportDetails?.partyType && (
              <div className="space-y-2">
                <Label htmlFor="party">{
                    currentReportDetails.partyType === 'customer' ? 'Customer' :
                    currentReportDetails.partyType === 'supplier' ? 'Supplier' :
                    currentReportDetails.partyType === 'product' ? 'Product (Optional)' :
                    'Account'
                }</Label>
                <Select value={selectedParty} onValueChange={setSelectedParty}>
                  <SelectTrigger id="party"><SelectValue placeholder={
                      currentReportDetails.partyType === 'product' ? 'All Products' : `Select a ${currentReportDetails.partyType}`
                    } /></SelectTrigger>
                  <SelectContent>
                    {(
                        currentReportDetails.partyType === 'customer' ? mockCustomers :
                        currentReportDetails.partyType === 'supplier' ? mockSuppliers :
                        currentReportDetails.partyType === 'product' ? mockProducts :
                        mockLedgerAccounts
                    ).map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="startDate" variant={"outline"} className={cn("w-full justify-start text-left font-normal",!startDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus /></PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="endDate" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus /></PopoverContent>
            </Popover>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateReport} className="w-full sm:w-auto shadow-md hover:shadow-lg" disabled={!reportType}>Generate Report</Button>
        </CardFooter>
      </Card>

      {generatedReport && (
        <Card className="shadow-xl animate-in fade-in duration-500">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Generated Report</CardTitle>
              <CardDescription>
                {getReportDetails(reportType)?.label} for period {startDate ? format(startDate, "PPP") : ''} - {endDate ? format(endDate, "PPP") : ''}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExport('PDF')} className="shadow-sm hover:shadow-md"><Download className="mr-2 h-4 w-4" /> Export PDF</Button>
              <Button variant="outline" onClick={() => handleExport('Excel')} className="shadow-sm hover:shadow-md"><Download className="mr-2 h-4 w-4" /> Export Excel</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-md bg-muted/50 min-h-[200px] whitespace-pre-wrap font-mono text-sm">
                <pre>{generatedReport}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
