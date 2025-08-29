
"use client";

import type { NextPage } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import type { DashboardSummary } from '@/lib/types';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/currency';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  isLoading: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon: Icon, description, isLoading }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-1/2 bg-muted animate-pulse rounded-md"></div>
        ) : (
          <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        )}
        {description && !isLoading && (
          <p className="text-xs text-muted-foreground pt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardPage: NextPage = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currencySymbol = '$'; // Simulate fetching setting

  useEffect(() => {
    // Simulate API call
    const fetchSummary = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      setSummary({
        inventoryValue: 125850.75,
        salesTaxLiability: 12750.30,
        estimatedIncomeTax: 22500.00,
        lowStockItems: 5,
      });
      setIsLoading(false);
    };
    fetchSummary();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <SummaryCard
          title="Total Inventory Value"
          value={summary ? formatCurrency(summary.inventoryValue, currencySymbol) : 'Loading...'}
          icon={Package}
          description="Current market value of all stock"
          isLoading={isLoading}
        />
        <SummaryCard
          title="Sales Tax Liability"
          value={summary ? formatCurrency(summary.salesTaxLiability, currencySymbol) : 'Loading...'}
          icon={DollarSign}
          description="Estimated for current period"
          isLoading={isLoading}
        />
        <SummaryCard
          title="Estimated Income Tax"
          value={summary ? formatCurrency(summary.estimatedIncomeTax, currencySymbol) : 'Loading...'}
          icon={TrendingUp}
          description="Quarterly estimate"
          isLoading={isLoading}
        />
        <SummaryCard
          title="Low Stock Items"
          value={summary ? summary.lowStockItems : 'Loading...'}
          icon={AlertTriangle}
          description="Items needing reorder"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">A visual representation of sales trends.</p>
            {/* Placeholder for chart */}
            <div className="w-full h-64 bg-muted rounded-md flex items-center justify-center">
              <Image src="https://placehold.co/600x300.png" alt="Sales Chart Placeholder" width={600} height={300} className="rounded-md" data-ai-hint="sales chart graph" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="space-y-3">
              {[1,2,3,4].map((item) => (
                <li key={item} className={`flex items-center p-2 rounded-md ${isLoading ? 'bg-muted animate-pulse h-10' : ''}`}>
                  {!isLoading && (
                    <>
                      <Package className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="text-sm font-medium">New product added: "Product XYZ"</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
