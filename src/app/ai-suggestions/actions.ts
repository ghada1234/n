
'use server';

import { suggestMeal, type MealSuggestionInput, type MealSuggestionOutput } from '@/ai/flows/meal-suggestion';
import { z } from 'zod';
import { en } from '@/lib/dictionaries/en';
import { ar } from '@/lib/dictionaries/ar';

const dictionaries = { en, ar };

const getTranslator = (lang: 'en' | 'ar' = 'en') => {
    const dictionary = dictionaries[lang];
    return (key: keyof typeof en, options?: { [key: string]: string | number }): string => {
        let text = dictionary[key] || dictionaries['en'][key];
        if (options) {
            Object.keys(options).forEach(k => {
                text = text.replace(new RegExp(`{{${k}}}`, 'g'), String(options[k]));
            });
        }
        return text;
    };
};

export async function generateMealSuggestion(
  prevState: any,
  formData: FormData
): Promise<{
    message: string;
    errors: Record<string, string[]> | null;
    data: MealSuggestionOutput | null;
}> {
  const lang = (formData.get('language') || 'en') as 'en' | 'ar';
  const t = getTranslator(lang);

  const MealSuggestionInputSchema = z.object({
    nationality: z.string().min(1, { message: t('formErrorNationality') }),
    dietaryRestrictions: z.string().min(1, { message: t('formErrorDietary') }),
    preferences: z.string().min(1, { message: t('formErrorPreferences') }),
    calorieGoal: z.coerce.number().positive({ message: t('formErrorCalorieGoal') }),
    macroRatio: z.string().min(1, { message: t('formErrorMacroRatio') }),
    planDuration: z.enum(['Daily', 'Weekly', 'Monthly'], {
      errorMap: () => ({ message: t('formErrorPlanDuration') })
    })
  });

  const validatedFields = MealSuggestionInputSchema.safeParse({
    nationality: formData.get('nationality'),
    dietaryRestrictions: formData.get('dietaryRestrictions'),
    preferences: formData.get('preferences'),
    calorieGoal: formData.get('calorieGoal'),
    macroRatio: formData.get('macroRatio'),
    planDuration: formData.get('planDuration'),
  });

  if (!validatedFields.success) {
    return {
      message: t('formInvalid'),
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const result = await suggestMeal(validatedFields.data as MealSuggestionInput);
    if (!result || !result.mealSuggestions || result.mealSuggestions.length === 0) {
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
