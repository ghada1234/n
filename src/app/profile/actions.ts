
'use server';

import {
  getNutrientAdvice,
  type NutrientAdviceInput,
  type NutrientAdviceOutput,
} from '@/ai/flows/nutrient-advice-flow';
import { z } from 'zod';
import { en } from '@/lib/dictionaries/en';
import { ar } from '@/lib/dictionaries/ar';
import { NutrientAdviceInputSchema } from '@/ai/flows/nutrient-advice-flow';


// This is a server action, so we can't use the hook. We'll get the language from the form data.
const getTranslations = (lang: 'en' | 'ar') => (lang === 'ar' ? ar : en);


export async function generateNutrientAdviceAction(
  prevState: any,
  formData: FormData
): Promise<{
    message: string;
    errors: Record<string, string[]> | null;
    data: NutrientAdviceOutput | null;
}> {
  const lang = (formData.get('language') || 'en') as 'en' | 'ar';
  const t = getTranslations(lang);

  const validatedFields = NutrientAdviceInputSchema.safeParse({
    height: Number(formData.get('height')),
    weight: Number(formData.get('currentWeight')),
    age: Number(formData.get('age')),
    goal: formData.get('goal'),
  });


  if (!validatedFields.success) {
    // Basic validation for the action; more specific validation can be on the client.
    return {
      message: t('formInvalid'),
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const result = await getNutrientAdvice(validatedFields.data as NutrientAdviceInput);
    if (!result) {
        return {
            message: t('aiNoSuggestions'),
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
        message: t('aiError', { error: errorMessage }),
        errors: null,
        data: null
    }
  }
}
