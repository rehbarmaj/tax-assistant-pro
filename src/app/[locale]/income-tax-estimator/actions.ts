
'use server';

import { estimateTax, type IncomeTaxEstimatorInput, type IncomeTaxEstimatorOutput } from '@/ai/flows/income-tax-estimator';
import type { EstimatedTaxResult } from '@/lib/types';

interface ActionResult {
  data?: EstimatedTaxResult;
  error?: string;
}

export async function estimateTaxAction(input: IncomeTaxEstimatorInput): Promise<ActionResult> {
  try {
    const output: IncomeTaxEstimatorOutput = await estimateTax(input);
    return {
      data: {
        estimatedTax: output.estimatedTax,
        isAccurate: output.isAccurate,
        additionalDataNeeded: output.additionalDataNeeded,
      },
    };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unknown error occurred while estimating the tax.' };
  }
}
