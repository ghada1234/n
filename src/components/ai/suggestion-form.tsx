'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generateMealSuggestion } from '@/app/ai-suggestions/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  message: '',
  errors: null,
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Generate Suggestions
    </Button>
  );
}

const SuggestionForm = () => {
  const [state, formAction] = useFormState(generateMealSuggestion, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== 'success') {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: state.message,
        })
    }
  }, [state, toast])


  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Personalize Your Meals</CardTitle>
            <CardDescription>
              Tell us your goals and preferences, and our AI will suggest meals for
              you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
              <Textarea
                id="dietaryRestrictions"
                name="dietaryRestrictions"
                placeholder="e.g., Vegetarian, Gluten-Free, Nut Allergy"
                defaultValue="None"
              />
              {state.errors?.dietaryRestrictions && <p className="text-sm font-medium text-destructive">{state.errors.dietaryRestrictions}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferences">Likes & Dislikes</Label>
              <Textarea
                id="preferences"
                name="preferences"
                placeholder="e.g., Love spicy food, dislike cilantro"
                defaultValue="No major dislikes"
              />
              {state.errors?.preferences && <p className="text-sm font-medium text-destructive">{state.errors.preferences}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="calorieGoal">Daily Calorie Goal</Label>
                    <Input id="calorieGoal" name="calorieGoal" type="number" placeholder="e.g., 2000" defaultValue="2000" />
                    {state.errors?.calorieGoal && <p className="text-sm font-medium text-destructive">{state.errors.calorieGoal}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="macroRatio">Macro Ratio (P/C/F)</Label>
                    <Input id="macroRatio" name="macroRatio" placeholder="e.g., 40/40/20" defaultValue="40/40/20" />
                    {state.errors?.macroRatio && <p className="text-sm font-medium text-destructive">{state.errors.macroRatio}</p>}
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Your Meal Suggestions</CardTitle>
          <CardDescription>
            Here are some ideas to get you started.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center p-4">
            {state.data && state.data.mealSuggestions && state.data.mealSuggestions.length > 0 ? (
                 <div className="w-full space-y-4">
                    {state.data.mealSuggestions.map((meal, index) => (
                        <div key={index} className="rounded-lg border p-4">
                            <h4 className="font-bold">{meal.mealName} (~{meal.calories} kcal)</h4>
                            <p className="text-sm text-muted-foreground">{meal.description}</p>
                        </div>
                    ))}
                 </div>
            ) : (
                <div className="text-center text-muted-foreground p-8">
                    <Sparkles className="mx-auto h-12 w-12" />
                    <p className="mt-4">Your AI-powered meal plan will appear here.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuggestionForm;
