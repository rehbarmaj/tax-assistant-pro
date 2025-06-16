"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, FileText, BarChart3, PackageSearch } from 'lucide-react';
import { cn } from "@/lib/utils";
import Image from 'next/image';

type ReportType = 'sales-tax' | 'income-tax' | 'inventory-movement';

const reportTypes: { value: ReportType; label: string; icon: React.ElementType }[] = [
  { value: 'sales-tax', label: 'Sales Tax Report', icon: FileText },
  { value: 'income-tax', label: 'Income Tax Summary', icon: BarChart3 },
  { value: 'inventory-movement', label: 'Inventory Movement Report', icon: PackageSearch },
];

export function ReportsClient() {
  const [reportType, setReportType] = useState<ReportType | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const handleGenerateReport = () => {
    if (!reportType || !startDate || !endDate) {
      alert('Please select a report type and date range.');
      return;
    }
    const selectedReport = reportTypes.find(rt => rt.value === reportType);
    const reportContent = `
      Report Type: ${selectedReport?.label}
      Period: ${format(startDate, "PPP")} - ${format(endDate, "PPP")}
      
      This is a placeholder for the ${selectedReport?.label}. 
      In a real application, this section would contain detailed data, tables, and summaries relevant to the selected report.
      For example, a Sales Tax Report would show taxable sales, tax collected, etc.
      An Income Tax Summary would show profit calculations and estimated tax liabilities.
      An Inventory Movement Report would detail stock in, stock out, and current levels.
    `;
    setGeneratedReport(reportContent);
  };

  const handleExport = (formatType: 'PDF' | 'Excel') => {
    if (!generatedReport) {
      alert('Please generate a report first.');
      return;
    }
    console.log(`Exporting report as ${formatType}...`);
    // Mock file download
    const blob = new Blob([generatedReport + `\n\nExported as ${formatType}`], { type: 'text/plain' });
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Custom Tax Reports</h1>
      </div>

      <Card className="shadow-xl mb-8">
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>Select report type and date range to generate your custom report.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="reportType">Report Type</Label>
            <Select value={reportType} onValueChange={(value: ReportType) => setReportType(value)}>
              <SelectTrigger id="reportType" className="w-full">
                <SelectValue placeholder="Select a report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((rt) => (
                  <SelectItem key={rt.value} value={rt.value}>
                    <div className="flex items-center gap-2">
                      <rt.icon className="h-4 w-4" />
                      {rt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="startDate"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="endDate"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateReport} className="w-full sm:w-auto shadow-md hover:shadow-lg">Generate Report</Button>
        </CardFooter>
      </Card>

      {generatedReport && (
        <Card className="shadow-xl animate-in fade-in duration-500">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Generated Report</CardTitle>
              <CardDescription>
                {reportTypes.find(rt => rt.value === reportType)?.label} for period {startDate ? format(startDate, "PPP") : ''} - {endDate ? format(endDate, "PPP") : ''}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExport('PDF')} className="shadow-sm hover:shadow-md">
                <Download className="mr-2 h-4 w-4" /> Export PDF
              </Button>
              <Button variant="outline" onClick={() => handleExport('Excel')} className="shadow-sm hover:shadow-md">
                <Download className="mr-2 h-4 w-4" /> Export Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-md bg-muted/50 min-h-[200px] whitespace-pre-wrap">
              {generatedReport.includes("placeholder") ? (
                 <div className="flex flex-col items-center justify-center text-center">
                    <Image src="https://placehold.co/400x200.png" data-ai-hint="financial document" alt="Report Placeholder" width={400} height={200} className="rounded-md mb-4 opacity-75" />
                    <p className="text-muted-foreground font-medium">This is a visual placeholder for your report data.</p>
                    <p className="text-sm text-muted-foreground mt-1">Actual report data would be displayed here.</p>
                    <pre className="mt-4 text-xs text-left bg-background p-2 rounded max-w-full overflow-x-auto">{generatedReport}</pre>
                 </div>
              ) : (
                <pre className="text-sm">{generatedReport}</pre>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
