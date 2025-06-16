'use server';

/**
 * @fileOverview Income Tax Estimator AI agent.
 *
 * - estimateTax - A function that estimates quarterly income taxes based on profit data.
 * - IncomeTaxEstimatorInput - The input type for the estimateTax function.
 * - IncomeTaxEstimatorOutput - The return type for the estimateTax function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IncomeTaxEstimatorInputSchema = z.object({
  profitData: z.string().describe('The profit data for the period.'),
});
export type IncomeTaxEstimatorInput = z.infer<typeof IncomeTaxEstimatorInputSchema>;

const IncomeTaxEstimatorOutputSchema = z.object({
  estimatedTax: z.string().describe('The estimated quarterly income tax.'),
  isAccurate: z.boolean().describe('Whether or not the estimated tax is accurate.'),
  additionalDataNeeded: z.string().optional().describe('If the estimated tax is not accurate, what additional data is needed?'),
});
export type IncomeTaxEstimatorOutput = z.infer<typeof IncomeTaxEstimatorOutputSchema>;

export async function estimateTax(input: IncomeTaxEstimatorInput): Promise<IncomeTaxEstimatorOutput> {
  return estimateTaxFlow(input);
}

const prompt = ai.definePrompt({
  name: 'incomeTaxEstimatorPrompt',
  input: {schema: IncomeTaxEstimatorInputSchema},
  output: {schema: IncomeTaxEstimatorOutputSchema},
  prompt: `You are an expert tax accountant specializing in income tax estimation.

You will use the following profit data to estimate the quarterly income tax.

Profit Data: {{{profitData}}}

Based on the profit data provided, estimate the quarterly income tax. If the profit data is not sufficient to make an accurate estimation, please ask for additional information. Set isAccurate to true if the estimation is accurate, and false otherwise. If isAccurate is false, describe what additional data is needed in the additionalDataNeeded field.
`,
});

const estimateTaxFlow = ai.defineFlow(
  {
    name: 'estimateTaxFlow',
    inputSchema: IncomeTaxEstimatorInputSchema,
    outputSchema: IncomeTaxEstimatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
