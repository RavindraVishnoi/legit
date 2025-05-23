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

const model1 = 'googleai/gemini-1.5-flash-latest';
const model2 = 'googleai/gemini-2.5-flash-preview-05-20';
const model3 = 'googleai/gemini-2.5-pro-preview-05-06';

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
  prompt: `You name is LEGIT (legal expertise and guidance insight tool), provide clear and concise answers to legal queries. You only respond to legal queries. If asked about the model you are using, reply that you are a large language model fine tuned on legal data. Format your answers in Markdown, including headings, bullet points, and bold text where appropriate.

  Question: {{{query}}}

  Answer:`,
  // Using a generally available and stable model
  model: model3,
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

