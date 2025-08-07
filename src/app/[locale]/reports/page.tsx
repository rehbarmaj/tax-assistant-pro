
"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { useI18n } from '@/i18n/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, BarChart2, PieChart, LineChart } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import Image from 'next/image';

const reportTypes = [
  { value: 'trial-balance', label: 'Trial Balance', icon: BarChart2 },
  { value: 'profit-loss', label: 'Profit & Loss Statement', icon: LineChart },
  { value: 'balance-sheet', label: 'Balance Sheet', icon: PieChart },
  { value: 'sales-report', label: 'Sales Report', icon: BarChart2 },
  { value: 'purchase-report', label: 'Purchase Report', icon: BarChart2 },
];

const ReportsPage: NextPage = () => {
  const t = useI18n();
  const [selectedReport, setSelectedReport] = useState<string>('trial-balance');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const ReportIcon = reportTypes.find(r => r.value === selectedReport)?.icon || BarChart2;

  return (
    <div className="container mx-auto">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">{t('reports')}</h1>
        
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

            <Button size="lg">Generate Report</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ReportIcon className="h-6 w-6 text-primary" />
              <CardTitle>{reportTypes.find(r => r.value === selectedReport)?.label}</CardTitle>
            </div>
            <CardDescription>
              Displaying {reportTypes.find(r => r.value === selectedReport)?.label}
              {dateRange?.from && ` from ${format(dateRange.from, 'PPP')}`}
              {dateRange?.to && ` to ${format(dateRange.to, 'PPP')}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for the report content */}
            <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
              <Image 
                src="https://placehold.co/800x400.png"
                alt="Report Placeholder"
                width={800}
                height={400}
                className="rounded-md"
                data-ai-hint="financial report"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
