
'use server';

import {
  getNutrientAdvice,
  type NutrientAdviceInput,
  type NutrientAdviceOutput,
} from '@/ai/flows/nutrient-advice-flow';
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


const NutrientAdviceActionSchema = z.object({
  height: z.coerce.number({invalid_type_error: 'Height must be a number.'}).positive('Height must be positive.'),
  weight: z.coerce.number({invalid_type_error: 'Weight must be a number.'}).positive('Weight must be positive.'),
  age: z.coerce.number({invalid_type_error: 'Age must be a number.'}).positive('Age must be positive.'),
  goal: z.string().min(1, 'Goal cannot be empty.'),
});


export async function generateNutrientAdviceAction(
  prevState: any,
  formData: FormData
): Promise<{
    message: string;
    errors: Record<string, string[]> | null;
    data: NutrientAdviceOutput | null;
}> {
  const lang = (formData.get('language') || 'en') as 'en' | 'ar';
  const t = getTranslator(lang);

  const validatedFields = NutrientAdviceActionSchema.safeParse({
    height: formData.get('height'),
    weight: formData.get('currentWeight'),
    age: formData.get('age'),
    goal: formData.get('goal'),
  });


  if (!validatedFields.success) {
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
