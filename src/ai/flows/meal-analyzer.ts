'use server';

/**
 * @fileOverview An AI agent that analyzes a meal from a photo and provides nutritional information.
 *
 * - analyzeMeal - A function that analyzes a meal from an image.
 * - MealAnalyzerInput - The input type for the analyzeMeal function.
 * - MealAnalyzerOutput - The return type for the analyzeMeal function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MealAnalyzerInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type MealAnalyzerInput = z.infer<typeof MealAnalyzerInputSchema>;

const MealAnalyzerOutputSchema = z.object({
  mealName: z.string().describe('The name of the meal identified in the photo.'),
  calories: z.number().describe('An estimate of the total calories in the meal.'),
  macros: z.object({
    protein: z.number().describe('The estimated grams of protein.'),
    carbohydrates: z.number().describe('The estimated grams of carbohydrates.'),
    fat: z.number().describe('The estimated grams of fat.'),
  }).describe('The macronutrient breakdown of the meal.'),
  micros: z
    .string()
    .describe(
      'A summary of key micronutrients (vitamins and minerals) found in the meal. For example: "Rich in Vitamin C, Iron, and Potassium."'
    ),
});
export type MealAnalyzerOutput = z.infer<typeof MealAnalyzerOutputSchema>;

export async function analyzeMeal(input: MealAnalyzerInput): Promise<MealAnalyzerOutput> {
  return mealAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mealAnalyzerPrompt',
  input: { schema: MealAnalyzerInputSchema },
  output: { schema: MealAnalyzerOutputSchema },
  prompt: `You are an expert nutritionist. Analyze the meal in the following photo. Identify the meal and provide a detailed nutritional analysis, including estimated calories, macronutrients (protein, carbohydrates, fat in grams), and a summary of key micronutrients (vitamins and minerals).

Photo: {{media url=photoDataUri}}`,
});

const mealAnalyzerFlow = ai.defineFlow(
  {
    name: 'mealAnalyzerFlow',
    inputSchema: MealAnalyzerInputSchema,
    outputSchema: MealAnalyzerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
