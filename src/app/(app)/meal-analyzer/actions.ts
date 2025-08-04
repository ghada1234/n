'use server';

import { analyzeMeal, type MealAnalyzerInput, type MealAnalyzerOutput } from '@/ai/flows/meal-analyzer';
import { z } from 'zod';

const MealAnalyzerInputSchema = z.object({
  photoDataUri: z.string().min(1, { message: 'Image is required.' }),
});

export async function analyzeMealAction(
  prevState: any,
  formData: FormData
): Promise<{
    message: string;
    errors: Record<string, string[]> | null;
    data: MealAnalyzerOutput | null;
}> {
  const validatedFields = MealAnalyzerInputSchema.safeParse({
    photoDataUri: formData.get('photoDataUri'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data',
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const result = await analyzeMeal(validatedFields.data as MealAnalyzerInput);
    return {
      message: 'success',
      errors: null,
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An unexpected error occurred.',
      errors: null,
      data: null,
    };
  }
}
