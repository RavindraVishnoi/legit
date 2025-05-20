
// LegalQuery story implementation
'use server';

/**
 * @fileOverview A legal query AI agent.
 *
 * - legalQuery - A function that handles the legal query process.
 * - LegalQueryInput - The input type for the legalQuery function.
 * - LegalQueryOutput - The return type for the legalQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LegalQueryInputSchema = z.object({
  query: z.string().describe('The legal query in natural language.'),
});
export type LegalQueryInput = z.infer<typeof LegalQueryInputSchema>;

const LegalQueryOutputSchema = z.object({
  answer: z.string().describe('The answer to the legal query.'),
});
export type LegalQueryOutput = z.infer<typeof LegalQueryOutputSchema>;

export async function legalQuery(input: LegalQueryInput): Promise<LegalQueryOutput> {
  return legalQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'legalQueryPrompt',
  input: {schema: LegalQueryInputSchema},
  output: {schema: LegalQueryOutputSchema},
  prompt: `You are a legal expert providing clear and concise answers to legal queries.

  Question: {{{query}}}

  Answer:`,
  // Using a generally available and stable model
  model: 'googleai/gemini-1.5-flash-latest',
});

const legalQueryFlow = ai.defineFlow(
  {
    name: 'legalQueryFlow',
    inputSchema: LegalQueryInputSchema,
    outputSchema: LegalQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

