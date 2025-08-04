'use server';

/**
 * @fileOverview An AI agent that analyzes a photo of food to identify the dish and estimate its calorie content.
 *
 * - analyzeFood - A function that handles the food analysis process.
 * - FoodAnalysisInput - The input type for the analyzeFood function.
 * - FoodAnalysisOutput - The return type for the analyzeFood function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FoodAnalysisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a food item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type FoodAnalysisInput = z.infer<typeof FoodAnalysisInputSchema>;

const FoodAnalysisOutputSchema = z.object({
  dishName: z.string().describe('The name of the identified dish.'),
  calories: z.number().describe('The estimated number of calories for the dish.'),
});
export type FoodAnalysisOutput = z.infer<typeof FoodAnalysisOutputSchema>;

export async function analyzeFood(input: FoodAnalysisInput): Promise<FoodAnalysisOutput> {
  return analyzeFoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFoodPrompt',
  input: { schema: FoodAnalysisInputSchema },
  output: { schema: FoodAnalysisOutputSchema },
  prompt: `You are an expert nutritionist. Analyze the following photo of a meal and identify the dish.
Provide the most common name for this dish. Also, provide an estimate of the total calories for the portion shown.

Photo: {{media url=photoDataUri}}`,
});

const analyzeFoodFlow = ai.defineFlow(
  {
    name: 'analyzeFoodFlow',
    inputSchema: FoodAnalysisInputSchema,
    outputSchema: FoodAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
