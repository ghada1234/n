'use server';

/**
 * @fileOverview An AI agent that looks up product information from a barcode.
 * 
 * - lookupBarcode - A function that fetches product data for a given barcode.
 * - BarcodeLookupInput - The input type for the lookupBarcode function.
 * - BarcodeLookupOutput - The return type for the lookupBarcode function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define a tool to get product info from Open Food Facts API
const getProductInfoFromBarcode = ai.defineTool(
  {
    name: 'getProductInfoFromBarcode',
    description: 'Fetches product information from the Open Food Facts API using a barcode.',
    inputSchema: z.object({
      barcode: z.string().describe('The product barcode (GTIN, UPC, EAN, etc.).'),
    }),
    outputSchema: z.any(), // The API response can be complex
  },
  async ({ barcode }) => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 0) {
        throw new Error(data.status_verbose);
      }
      return data;
    } catch (error) {
      console.error('Error fetching from Open Food Facts API:', error);
      throw new Error('Could not retrieve product information for the given barcode.');
    }
  }
);


const BarcodeLookupInputSchema = z.object({
  barcode: z.string().describe('The product barcode to look up.'),
});
export type BarcodeLookupInput = z.infer<typeof BarcodeLookupInputSchema>;

const BarcodeLookupOutputSchema = z.object({
  productName: z.string().optional().describe('The name of the product.'),
  calories: z.number().optional().describe('The number of calories per serving.'),
  notFound: z.boolean().optional().describe('Set to true if the product is not found.'),
});
export type BarcodeLookupOutput = z.infer<typeof BarcodeLookupOutputSchema>;


const prompt = ai.definePrompt({
    name: 'barcodeLookupPrompt',
    input: { schema: BarcodeLookupInputSchema },
    output: { schema: BarcodeLookupOutputSchema },
    tools: [getProductInfoFromBarcode],
    prompt: `You are a nutritional information assistant.
A user has provided a barcode: {{{barcode}}}.

Your task is to use the getProductInfoFromBarcode tool to find the product information for this barcode.

From the tool's output, extract the product name ('product_name' or 'product_name_en') and the calorie count per serving ('nutriments.energy-kcal_100g' or 'nutriments.energy-kcal').

- If the product is found and has the required information, return the 'productName' and 'calories'.
- If the product is found but calorie information is missing, return the 'productName' with calories as 0.
- If the 'status' from the API is 0 or the product is not found, return 'notFound: true'.`
});
  

const barcodeLookupFlow = ai.defineFlow(
  {
    name: 'barcodeLookupFlow',
    inputSchema: BarcodeLookupInputSchema,
    outputSchema: BarcodeLookupOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function lookupBarcode(input: BarcodeLookupInput): Promise<BarcodeLookupOutput> {
  return barcodeLookupFlow(input);
}
