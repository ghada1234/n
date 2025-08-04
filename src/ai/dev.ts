import { config } from 'dotenv';
config();

import '@/ai/flows/meal-suggestion.ts';
import '@/ai/flows/barcode-lookup.ts';
import '@/ai/flows/analyze-food-flow.ts';
import '@/ai/flows/analyze-text-food-flow.ts';
