export interface Product {
  id: string;
  code: string;
  name: string;
  unit: string;
  purchasePrice: number;
  salePrice: number;
  hsnSac: string;
  taxRateId?: string; // Optional: A product might not have a tax rate or it's part of a group
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number; // Percentage, e.g., 18 for 18%
}

// For Dashboard Summary
export interface DashboardSummary {
  inventoryValue: number;
  salesTaxLiability: number;
  estimatedIncomeTax: number;
  lowStockItems: number;
}

// For Income Tax Estimator
export interface EstimatedTaxResult {
  estimatedTax: string;
  isAccurate: boolean;
  additionalDataNeeded?: string;
}
