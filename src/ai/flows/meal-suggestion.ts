'use server';

/**
 * @fileOverview An AI agent that provides personalized meal suggestions based on user dietary restrictions and preferences.
 *
 * - suggestMeal - A function that generates meal suggestions.
 * - MealSuggestionInput - The input type for the suggestMeal function.
 * - MealSuggestionOutput - The return type for the suggestMeal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MealSuggestionInputSchema = z.object({
  dietaryRestrictions: z
    .string()
    .describe(
      'Any dietary restrictions the user has (e.g., vegetarian, gluten-free, dairy-free).'
    ),
  preferences: z
    .string()
    .describe('The users meal preferences (e.g., likes chicken, dislikes fish).'),
  calorieGoal: z
    .number()
    .describe('The users daily calorie goal, used to generate meals within the calorie limit.'),
  macroRatio: z
    .string()
    .describe(
      'The users macro nutrient ratio goal as a percentage of Protein, Carbs, and Fat (e.g., 30% Protein, 40% Carbs, 30% Fat).'
    ),
});
export type MealSuggestionInput = z.infer<typeof MealSuggestionInputSchema>;

const MealSuggestionOutputSchema = z.object({
  mealSuggestions: z
    .string()
    .describe(
      'A list of meal suggestions that adhere to the dietary restrictions, preferences, calorie goal, and macro ratio.'
    ),
});
export type MealSuggestionOutput = z.infer<typeof MealSuggestionOutputSchema>;

export async function suggestMeal(input: MealSuggestionInput): Promise<MealSuggestionOutput> {
  return suggestMealFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mealSuggestionPrompt',
  input: {schema: MealSuggestionInputSchema},
  output: {schema: MealSuggestionOutputSchema},
  prompt: `You are a nutritional expert. Generate meal suggestions based on the user's dietary restrictions, preferences, calorie goal and macro ratio.

Dietary Restrictions: {{{dietaryRestrictions}}}
Preferences: {{{preferences}}}
Calorie Goal: {{{calorieGoal}}}
Macro Ratio: {{{macroRatio}}}

Meal Suggestions:`,
});

const suggestMealFlow = ai.defineFlow(
  {
    name: 'suggestMealFlow',
    inputSchema: MealSuggestionInputSchema,
    outputSchema: MealSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
