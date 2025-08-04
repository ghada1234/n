'use server';

import { suggestMeal, type MealSuggestionInput, type MealSuggestionOutput } from '@/ai/flows/meal-suggestion';
import { z } from 'zod';

const MealSuggestionInputSchema = z.object({
  dietaryRestrictions: z.string().min(1, { message: 'Dietary restrictions cannot be empty.' }),
  preferences: z.string().min(1, { message: 'Preferences cannot be empty.' }),
  calorieGoal: z.coerce.number().positive({ message: 'Calorie goal must be a positive number.' }),
  macroRatio: z.string().min(1, { message: 'Macro ratio cannot be empty.' }),
});

export async function generateMealSuggestion(
  prevState: any,
  formData: FormData
): Promise<{
    message: string;
    errors: Record<string, string[]> | null;
    data: MealSuggestionOutput | null;
}> {
  const validatedFields = MealSuggestionInputSchema.safeParse({
    dietaryRestrictions: formData.get('dietaryRestrictions'),
    preferences: formData.get('preferences'),
    calorieGoal: formData.get('calorieGoal'),
    macroRatio: formData.get('macroRatio'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data',
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const result = await suggestMeal(validatedFields.data as MealSuggestionInput);
    if (!result || !result.mealSuggestions || result.mealSuggestions.length === 0) {
        return {
            message: 'The AI could not generate suggestions. Please try adjusting your preferences.',
            errors: null,
            data: null
        }
    }
    return {
        message: 'success',
        errors: null,
        data: result
    }
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return {
        message: `An AI error occurred: ${errorMessage}`,
        errors: null,
        data: null
    }
  }
}
