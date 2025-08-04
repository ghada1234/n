
'use client';

import { useActionState, useFormStatus } from 'react-dom';
import { generateNutrientAdviceAction } from '@/app/profile/actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { Save, Sparkles, Loader2, Weight, Scale, Target } from 'lucide-react';
import { useEffect, useRef, useActionState as useReactActionState } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  message: '',
  errors: null,
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useLanguage();
  return (
    <Button>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Save className="mr-2 h-4 w-4" />
      )}
      {t('saveChanges')}
    </Button>
  );
}

const ProfileForm = () => {
  const { t, language } = useLanguage();
  const [state, formAction] = useReactActionState(generateNutrientAdviceAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && state.message !== 'success') {
        toast({
            variant: "destructive",
            title: t('errorOccurred'),
            description: state.message,
        })
    }
  }, [state, toast, t]);

  const { pending } = useFormStatus();

  return (
    <form ref={formRef} action={formAction} className="space-y-8">
       {/* Pass language to the server action */}
      <input type="hidden" name="language" value={language} />
      <div className="flex items-center gap-8">
        <Avatar className="h-24 w-24">
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h3 className="text-2xl font-headline">Alex Doe</h3>
          <p className="text-muted-foreground">alex.doe@example.com</p>
          <Button variant="outline" size="sm">
            {t('changePhoto')}
          </Button>
        </div>
      </div>
      <Separator />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">{t('fullNameLabel')}</Label>
          <Input id="name" name="name" defaultValue="Alex Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t('emailLabel')}</Label>
          <Input id="email" name="email" type="email" defaultValue="alex.doe@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">{t('age')}</Label>
          <Input id="age" name="age" type="number" defaultValue="32" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationality">{t('nationality')}</Label>
          <Input id="nationality" name="nationality" defaultValue="American" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">{t('height')}</Label>
          <Input id="height" name="height" type="number" defaultValue="175" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startWeight">{t('startWeight')}</Label>
          <Input id="startWeight" name="startWeight" type="number" defaultValue="86" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentWeight">{t('currentWeight')}</Label>
          <Input id="currentWeight" name="currentWeight" type="number" defaultValue="82" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="goal">{t('primaryGoal')}</Label>
          <Input id="goal" name="goal" defaultValue={t('primaryGoalPlaceholder')} />
        </div>
      </div>
      
      <Separator />

      <Card>
        <CardHeader>
            <CardTitle>{t('healthInsightsTitle')}</CardTitle>
            <CardDescription>{t('healthInsightsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex justify-start">
                <Button type="submit" disabled={pending}>
                    {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {t('calculateInsights')}
                </Button>
            </div>
            
            {state.data && (
                <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Card className="text-center">
                            <CardHeader className="pb-2">
                                <CardDescription>{t('bmi')}</CardDescription>
                                <CardTitle className="text-3xl">{state.data.bmi.toFixed(1)}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm font-medium text-primary">{state.data.bmiCategory}</p>
                            </CardContent>
                        </Card>
                         <Card className="text-center">
                            <CardHeader className="pb-2">
                                <CardDescription>{t('healthyWeightRange')}</CardDescription>
                                <CardTitle className="text-3xl">{state.data.healthyWeightRange}</CardTitle>
                            </CardHeader>
                             <CardContent>
                                <p className="text-sm text-muted-foreground">{t('healthyWeightDescription')}</p>
                            </CardContent>
                        </Card>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold mb-2">{t('macroTitle')}</h4>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <Card>
                                <CardHeader><CardTitle className="text-lg">{t('protein')}: {state.data.macroNutrients.protein}</CardTitle></CardHeader>
                            </Card>
                             <Card>
                                <CardHeader><CardTitle className="text-lg">{t('carbs')}: {state.data.macroNutrients.carbs}</CardTitle></CardHeader>
                            </Card>
                             <Card>
                                <CardHeader><CardTitle className="text-lg">{t('fat')}: {state.data.macroNutrients.fat}</CardTitle></CardHeader>
                            </Card>
                        </div>
                    </div>

                     <div>
                        <h4 className="font-semibold mb-2">{t('microTitle')}</h4>
                        <div className="space-y-2">
                        {state.data.microNutrients.map(nutrient => (
                            <div key={nutrient.name} className="p-3 rounded-lg bg-muted/50">
                                <p className="font-semibold">{nutrient.name}</p>
                                <p className="text-sm text-muted-foreground">{nutrient.recommendation}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        {/* This is a placeholder for a real save button. The form action handles the AI call. */}
        <Button onClick={() => toast({ title: "Profile Saved!", description: "Your profile information has been updated."})}>
            <Save className="mr-2 h-4 w-4" /> {t('saveChanges')}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
