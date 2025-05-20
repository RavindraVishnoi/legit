
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { config } from 'dotenv';

// Ensure .env variables are loaded in this context
config();

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.warn(
    "GEMINI_API_KEY is not found in environment variables. Genkit AI features may not work."
  );
}

export const ai = genkit({
  plugins: [googleAI({apiKey: geminiApiKey})],
  // Using a generally available and stable model as default
  model: 'googleai/gemini-1.5-flash-latest',
});

