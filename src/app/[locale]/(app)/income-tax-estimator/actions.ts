
"use server";

import { estimateTax, type IncomeTaxEstimatorInput, type IncomeTaxEstimatorOutput } from '@/ai/flows/income-tax-estimator';

interface ActionResult {
  data?: IncomeTaxEstimatorOutput;
  error?: string;
}

export async function estimateTaxAction(input: IncomeTaxEstimatorInput): Promise<ActionResult> {
  try {
    if (!input.profitData || input.profitData.trim() === "") {
      return { error: "Profit data cannot be empty." };
    }
    // Basic validation, more can be added
    if (input.profitData.length < 10) {
        return { error: "Profit data seems too short. Please provide more details." };
    }

    const result = await estimateTax(input);
    return { data: result };
  } catch (error) {
    console.error("Error in estimateTaxAction:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred while estimating taxes." };
  }
}
