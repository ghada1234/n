
'use server';

/**
 * @fileOverview An AI agent that calculates BMI, provides a healthy weight range, and gives nutrient advice.
 *
 * - getNutrientAdvice - A function that handles the nutrient advice process.
 * - NutrientAdviceInput - The input type for the getNutrientAdvice function.
 * - NutrientAdviceOutput - The return type for the getNutrientAdvice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const NutrientAdviceInputSchema = z.object({
  height: z.number().describe('The user\'s height in centimeters.'),
  weight: z.number().describe('The user\'s weight in kilograms.'),
  age: z.number().describe('The user\'s age in years.'),
  goal: z.string().describe('The user\'s primary health or fitness goal.'),
});
export type NutrientAdviceInput = z.infer<typeof NutrientAdviceInputSchema>;

export const NutrientAdviceOutputSchema = z.object({
  bmi: z.number().describe('The calculated Body Mass Index (BMI).'),
  bmiCategory: z.string().describe('The BMI category (e.g., "Underweight", "Normal weight", "Overweight").'),
  healthyWeightRange: z.string().describe('The healthy weight range for the user\'s height, formatted as "min kg - max kg".'),
  macroNutrients: z.object({
    protein: z.string().describe('Recommended daily protein intake in grams (e.g., "120-150g").'),
    carbs: z.string().describe('Recommended daily carbohydrate intake in grams (e.g., "180-220g").'),
    fat: z.string().describe('Recommended daily fat intake in grams (e.g., "60-70g").'),
  }),
  microNutrients: z.array(z.object({
    name: z.string().describe('The name of the micronutrient (e.g., "Iron", "Vitamin D").'),
    recommendation: z.string().describe('A brief recommendation for this micronutrient.'),
  })).describe('A list of 3-4 key micronutrient recommendations.'),
});
export type NutrientAdviceOutput = z.infer<typeof NutrientAdviceOutputSchema>;

export async function getNutrientAdvice(input: NutrientAdviceInput): Promise<NutrientAdviceOutput> {
  return nutrientAdviceFlow(input);
}

// Helper function to calculate BMI
const calculateBmi = (heightCm: number, weightKg: number) => {
    if (heightCm <= 0 || weightKg <= 0) return 0;
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
};

const prompt = ai.definePrompt({
  name: 'nutrientAdvicePrompt',
  input: { schema: NutrientAdviceInputSchema },
  output: { schema: NutrientAdviceOutputSchema },
  prompt: `You are an expert nutritionist. A user has provided their health data and goal.
Your task is to:
1. Calculate their BMI using the provided height and weight.
2. Determine their BMI category (Underweight, Normal weight, Overweight, Obesity).
3. Calculate their healthy weight range based on a BMI of 18.5 to 24.9. Format it as "min kg - max kg".
4. Provide personalized macronutrient recommendations (protein, carbs, fat) as a range in grams based on their goal.
5. Provide 3-4 key micronutrient recommendations (e.g., Iron, Vitamin D, Calcium, B12) with a brief explanation of why it's important for their goal.

User Data:
- Age: {{{age}}} years
- Height: {{{height}}} cm
- Weight: {{{weight}}} kg
- Goal: {{{goal}}}

BMI: {{calculateBmi height weight}}

Please provide the output in the specified JSON format.
`,
}, {
    helpers: {
        calculateBmi: (height: number, weight: number) => calculateBmi(height, weight).toFixed(1),
    }
});

const nutrientAdviceFlow = ai.defineFlow(
  {
    name: 'nutrientAdviceFlow',
    inputSchema: NutrientAdviceInputSchema,
    outputSchema: NutrientAdviceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
