
'use server';

/**
 * @fileOverview An AI agent that analyzes a text description of food to identify the dish and estimate its calorie and macronutrient content.
 *
 * - analyzeTextFood - A function that handles the food analysis process.
 * - FoodAnalysisTextInput - The input type for the analyzeTextFood function.
 * - FoodAnalysisTextOutput - The return type for the analyzeTextFood function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FoodAnalysisTextInputSchema = z.object({
  description: z
    .string()
    .describe(
      'A text description of a food item (e.g., "a bowl of oatmeal with berries and nuts").'
    ),
});
export type FoodAnalysisTextInput = z.infer<typeof FoodAnalysisTextInputSchema>;

const FoodAnalysisTextOutputSchema = z.object({
  dishName: z.string().describe('The name of the identified dish.'),
  calories: z
    .number()
    .describe('The estimated number of calories for the dish.'),
  protein: z
    .number()
    .describe('The estimated grams of protein for the dish.'),
  carbs: z
    .number()
    .describe('The estimated grams of carbohydrates for the dish.'),
  fat: z.number().describe('The estimated grams of fat for the dish.'),
  sodium: z.number().describe('The estimated milligrams of sodium for the dish.'),
  sugar: z.number().describe('The estimated grams of sugar for the dish.'),
  portionSize: z
    .string()
    .describe('The estimated portion size (e.g., "1 cup", "100g").'),
});
export type FoodAnalysisTextOutput = z.infer<
  typeof FoodAnalysisTextOutputSchema
>;

export async function analyzeTextFood(
  input: FoodAnalysisTextInput
): Promise<FoodAnalysisTextOutput> {
  return analyzeTextFoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTextFoodPrompt',
  input: { schema: FoodAnalysisTextInputSchema },
  output: { schema: FoodAnalysisTextOutputSchema },
  prompt: `You are an expert nutritionist. Analyze the following description of a meal and identify the dish.
Provide the most common name for this dish. Also, provide an estimate of the total calories, protein, carbs, fat, sodium (in mg), sugar (in grams), and the portion size for the described meal.

Description: {{{description}}}`,
});

const analyzeTextFoodFlow = ai.defineFlow(
  {
    name: 'analyzeTextFoodFlow',
    inputSchema: FoodAnalysisTextInputSchema,
    outputSchema: FoodAnalysisTextOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
