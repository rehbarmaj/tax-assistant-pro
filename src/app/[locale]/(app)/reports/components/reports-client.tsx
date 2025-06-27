
"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, FileText, BarChart3, PackageSearch, Users, Building, Landmark, ClipboardCheck, Scale, FileClock, Percent } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Combobox } from '@/components/ui/combobox';

type ReportType = 
  | 'account-ledger' | 'cost-of-sales' | 'daily-transaction-report' | 'item-ledger'
  | 'sales-tax-register' | 'purchase-tax-register' | 'tax-summary'
  | 'debtor-creditor-aging'
  | 'stock-report' | 'item-wise-sales-purchase'
  | 'profit-and-loss' | 'balance-sheet' | 'trial-balance';

type PartyType = 'customer' | 'supplier' | 'account' | 'product' | 'accountLevel';

const reportTypes: { 
  label: string; 
  reports: { value: ReportType; label: string; icon: React.ElementType, description?: string, partyType?: PartyType, hasCityFilter?: boolean }[] 
}[] = [
  {
    label: "Financial Reports",
    reports: [
      { value: 'profit-and-loss', label: 'Profit & Loss Account', icon: BarChart3, description: "Summarizes revenues, costs, and expenses." },
      { value: 'balance-sheet', label: 'Balance Sheet', icon: Landmark, description: "Snapshot of assets, liabilities, and equity." },
      { value: 'trial-balance', label: 'Trial Balance', icon: Scale, description: "Lists all ledger account balances.", partyType: 'accountLevel' },
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
      { value: 'debtor-creditor-aging', label: 'Debtor/Creditor Aging Report', icon: Users, description: "Age-wise analysis of outstanding balances.", partyType: 'account', hasCityFilter: true },
      { value: 'stock-report', label: 'Stock Report', icon: PackageSearch, description: "Real-time stock position and valuation.", partyType: 'product' },
      { value: 'item-wise-sales-purchase', label: 'Item-wise Sales/Purchase', icon: ClipboardCheck, description: "Sales and purchase history for items.", partyType: 'product' },
    ]
  },
];

const mockCustomers = [{ id: '1', name: 'Global Tech Corp' }, { id: '2', name: 'Innovate Solutions' }];
const mockSuppliers = [{ id: '1', name: 'Office Supplies Inc.' }, { id: '2', name: 'Component Suppliers' }];
const mockLedgerAccounts = [{id: '1', name: '1.01.2.001 - Cash on Hand'}, {id: '2', name: '4.01.1.001 - Domestic Sales'}, { id: '3', name: '1.01.1.001 - Client A' }, {id: '4', name: '2.01.1.001 - Vendor B'}];
const mockProducts = [{id: '1', name: 'P001 - Premium Keyboard'}, {id: '2', name: 'P002 - Optical Mouse'}, {id: '3', name: 'P003 - 27-inch Monitor'}];
const mockCities = ["Metropolis", "Gotham", "Star City"];

const mockCompanyInfo = {
    name: "Tax Assistant Pro Inc.",
    phone: "555-123-4567",
    email: "contact@taxassistantpro.com",
    logoUrl: "https://placehold.co/100x100.png",
};

export function ReportsClient() {
  const [reportType, setReportType] = useState<ReportType | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedParty, setSelectedParty] = useState<string | undefined>(undefined);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
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
    if (reportDetails.partyType === 'accountLevel') {
      const levelMap: Record<string, string> = {
        'all': 'All Levels',
        '1': 'Level 1: Control Groups',
        '2': 'Level 2: Sub-Control Groups',
        '3': 'Level 3: Control Accounts',
        '4': 'Level 4: Ledger Accounts'
      };
      partyInfo = `Level: ${levelMap[selectedLevel] || 'All Levels'}`;
    }
    else if (reportDetails.partyType) {
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

    let reportContent = '';

    if (reportType === 'trial-balance') {
      reportContent = `--- MOCK DATA ---

| Account Name                      | Opening Balance | Period Debit | Period Credit | Closing Balance |
|-----------------------------------|-----------------|--------------|---------------|-----------------|
| Cash                              | $50,000.00 Dr.  | $1,500.00    | $800.00       | $50,700.00 Dr.  |
| Accounts Receivable               | $15,000.00 Dr.  | $10,000.00   | $5,000.00     | $20,000.00 Dr.  |
| Furniture & Fixtures              | $25,000.00 Dr.  | $0.00        | $0.00         | $25,000.00 Dr.  |
| Accounts Payable                  | $10,000.00 Cr.  | $2,000.00    | $7,000.00     | $15,000.00 Cr.  |
| Product Sales                     | $150,000.00 Cr. | $0.00        | $10,000.00    | $160,000.00 Cr. |
| Rent Expense                      | $20,000.00 Dr.  | $5,000.00    | $0.00         | $25,000.00 Dr.  |

**Totals:**
                                    |                 | **$18,500.00** | **$22,800.00**  |                 |
                                    | **Closing Dr: $120,700.00** | | | **Closing Cr: $175,000.00** |

--- End of Mock Data ---
`;
    } else if (reportType === 'daily-transaction-report') {
        reportContent = `--- MOCK DATA ---

| Date       | Doc #  | Type              | Party Name          | Narration                          | Amount    |
|------------|--------|-------------------|---------------------|------------------------------------|-----------|
| 2023-10-01 | PN001  | Purchase Note     | Tech Supplies Inc.  | Monthly office supplies            | $755.00   |
| 2023-10-02 | RV001  | Receipt Voucher   | Client A Services   | Payment for project X              | $1,200.00 |
| 2023-10-05 | SN001  | Sale Note         | Global Corp         | Sale of 2 monitors                 | $590.00   |
| 2023-10-05 | PV002  | Payment Voucher   | Utility Services Co.| Electricity bill                   | $275.00   |
| 2023-10-10 | PRN001 | Purchase Return   | Tech Supplies Inc.  | Return of 5 faulty mice            | ($56.00)  |
| 2023-10-12 | SRN001 | Sales Return      | Global Corp         | Return of 1 monitor                | ($295.00) |
| 2023-10-15 | JV001  | Journal Voucher   | N/A                 | To record depreciation for the month | -         |

--- End of Mock Data ---
`;
    } else {
      reportContent = `--- MOCK DATA ---

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
    }
    setGeneratedReport(reportContent.trim());
  };
  
  const handleExport = (formatType: 'PDF' | 'Excel') => {
    if (!generatedReport) {
      alert('Please generate a report first.');
      return;
    }
    
    const reportDetails = getReportDetails(reportType);
    const textHeader = `
Company: ${mockCompanyInfo.name}
Phone: ${mockCompanyInfo.phone}
Email: ${mockCompanyInfo.email}

Report: ${reportDetails?.label}
Period: ${startDate ? format(startDate, "PPP") : ''} - ${endDate ? format(endDate, "PPP") : ''}
==================================================
`;
    
    const exportContent = `${textHeader}\n${generatedReport}`;
    const blob = new Blob([exportContent], { type: 'text/plain' });
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

  const reportOptions = useMemo(() => reportTypes.flatMap(group => 
    group.reports.map(report => ({
      value: report.value,
      label: (
        <div className="flex items-center gap-2">
          <report.icon className="h-4 w-4 text-muted-foreground" />
          <span>{report.label}</span>
        </div>
      )
    }))
  ), []);

  const partyOptions = useMemo(() => {
    if (!currentReportDetails?.partyType) return [];
    
    const optionsMap = {
      customer: mockCustomers,
      supplier: mockSuppliers,
      account: mockLedgerAccounts,
      product: mockProducts,
    };

    const data = optionsMap[currentReportDetails.partyType as keyof typeof optionsMap] || [];
    return data.map(p => ({ value: p.id, label: p.name }));

  }, [currentReportDetails?.partyType]);

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
            <Combobox
              options={reportOptions}
              value={reportType}
              onChange={(value) => {setReportType(value as ReportType); setSelectedParty(undefined); setGeneratedReport(null)}}
              placeholder="Select a report type"
              searchPlaceholder="Search reports..."
              emptyPlaceholder="No report found."
            />
          </div>
          
           { currentReportDetails?.partyType === 'accountLevel' ? (
              <div className="space-y-2">
                <Label htmlFor="accountLevel">Level</Label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger id="accountLevel"><SelectValue placeholder="Select Level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="1">Level 1: Control Groups</SelectItem>
                    <SelectItem value="2">Level 2: Sub-Control Groups</SelectItem>
                    <SelectItem value="3">Level 3: Control Accounts</SelectItem>
                    <SelectItem value="4">Level 4: Ledger Accounts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
           ) : currentReportDetails?.partyType ? (
              <div className="space-y-2">
                <Label htmlFor="party">{
                    currentReportDetails.partyType === 'customer' ? 'Customer' :
                    currentReportDetails.partyType === 'supplier' ? 'Supplier' :
                    currentReportDetails.partyType === 'product' ? 'Product (Optional)' :
                    'Account'
                }</Label>
                <Combobox
                  options={partyOptions}
                  value={selectedParty}
                  onChange={setSelectedParty}
                  placeholder={
                      currentReportDetails.partyType === 'product' ? 'All Products' : `Select a ${currentReportDetails.partyType}`
                  }
                  searchPlaceholder='Search...'
                  emptyPlaceholder='None found.'
                />
              </div>
          ): null}
          
          { currentReportDetails?.hasCityFilter && (
            <div className="space-y-2">
              <Label htmlFor="city">City (Optional)</Label>
              <Combobox
                options={mockCities.map(c => ({value: c, label: c}))}
                value={selectedCity}
                onChange={setSelectedCity}
                placeholder="All Cities"
                searchPlaceholder='Search cities...'
                emptyPlaceholder='No city found.'
              />
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
          <CardHeader>
             <div className="flex items-start justify-between mb-4 pb-4 border-b border-border/50">
                <div className="flex items-center gap-4">
                    <Image src={mockCompanyInfo.logoUrl} alt="Company Logo" width={80} height={80} className="rounded-md" data-ai-hint="company logo"/>
                    <div>
                        <h3 className="text-lg font-bold">{mockCompanyInfo.name}</h3>
                        <p className="text-xs text-muted-foreground">Phone: {mockCompanyInfo.phone}</p>
                        <p className="text-xs text-muted-foreground">Email: {mockCompanyInfo.email}</p>
                    </div>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-lg">{getReportDetails(reportType)?.label}</h4>
                  <p className="text-xs text-muted-foreground">
                      For the period: {startDate ? format(startDate, "PPP") : ''} to {endDate ? format(endDate, "PPP") : ''}
                  </p>
                </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleExport('PDF')} className="shadow-sm hover:shadow-md"><Download className="mr-2 h-4 w-4" /> Export PDF</Button>
              <Button variant="outline" onClick={() => handleExport('Excel')} className="shadow-sm hover:shadow-md"><Download className="mr-2 h-4 w-4" /> Export Excel</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-md bg-muted/50 min-h-[200px] font-mono text-sm">
                <pre className="whitespace-pre-wrap">{generatedReport}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
