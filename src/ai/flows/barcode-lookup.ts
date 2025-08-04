
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
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=product_name,product_name_en,nutriments,status,status_verbose,serving_size`);
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
  protein: z.number().optional().describe('The grams of protein per serving.'),
  carbs: z.number().optional().describe('The grams of carbohydrates per serving.'),
  fat: z.number().optional().describe('The grams of fat per serving.'),
  sodium: z.number().optional().describe('The milligrams of sodium per serving.'),
  sugar: z.number().optional().describe('The grams of sugar per serving.'),
  portionSize: z.string().optional().describe('The serving size of the product.'),
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

From the tool's output, extract the product name ('product_name' or 'product_name_en') and the nutritional information.
The nutritional values are often per 100g, but you should return them for the 'serving_size' if it exists.

- Product Name: 'product_name' or 'product_name_en'
- Portion Size: 'serving_size' (if not available, use '100g')
- Calories: 'nutriments.energy-kcal_serving' or 'nutriments.energy-kcal_100g'
- Protein: 'nutriments.proteins_serving' or 'nutriments.proteins_100g'
- Carbohydrates: 'nutriments.carbohydrates_serving' or 'nutriments.carbohydrates_100g'
- Fat: 'nutriments.fat_serving' or 'nutriments.fat_100g'
- Sodium: 'nutriments.sodium_serving' or 'nutriments.sodium_100g' (convert from g to mg if needed)
- Sugar: 'nutriments.sugars_serving' or 'nutriments.sugars_100g'


- If the product is found and has the required information, return all fields.
- If the product is found but some nutritional information is missing, return what is available and use 0 for the missing values.
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
