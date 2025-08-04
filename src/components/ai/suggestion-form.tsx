
'use client';

import { useActionState, useFormStatus } from 'react-dom';
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
import { Sparkles, Loader2, Download } from 'lucide-react';
import { useEffect, useRef, useActionState as useReactActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '@/hooks/use-language';


const initialState = {
  message: '',
  errors: null,
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useLanguage();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      {t('generateSuggestions')}
    </Button>
  );
}

const WhatsAppIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-2 h-4 w-4"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  );

const SuggestionForm = () => {
  const { t } = useLanguage();
  const [state, formAction] = useReactActionState(generateMealSuggestion, initialState);
  const { toast } = useToast();
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state.message && state.message !== 'success') {
        toast({
            variant: "destructive",
            title: t('errorOccurred'),
            description: state.message,
        })
    }
  }, [state, toast, t])
  
  const handleDownloadPdf = () => {
    const input = suggestionsRef.current;
    if (!input) {
        toast({
            variant: "destructive",
            title: t('errorOccurred'),
            description: t('errorDownloading'),
        });
        return;
    }

    toast({
        title: t('generatingPdf'),
        description: t('generatingPdfDesc'),
    });

    // We need to temporarily open all accordion items to capture all content
    const accordionItems = input.querySelectorAll('[data-state="closed"]');
    accordionItems.forEach(item => {
        const trigger = item.querySelector('[aria-expanded="false"]');
        (trigger as HTMLElement)?.click();
    });
    
    setTimeout(() => {
        html2canvas(input, {
            scale: 2, // Higher scale for better quality
            useCORS: true, 
            backgroundColor: null, // Use element's background
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            const width = pdfWidth;
            const height = width / ratio;

            let position = 0;
            let pageHeight = height > pdfHeight ? pdfHeight : height;
            
            pdf.addImage(imgData, 'PNG', 0, position, width, height);
            let heightLeft = height - pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - height;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, width, height);
                pageHeight = heightLeft > pdfHeight ? pdfHeight : heightLeft;
                heightLeft -= pageHeight;
            }
            pdf.save(`${state.data?.planTitle?.replace(/\s+/g, '-') || 'meal-plan'}.pdf`);

            // Close the accordions again
            const openAccordionItems = input.querySelectorAll('[data-state="open"]');
            openAccordionItems.forEach(item => {
                const trigger = item.querySelector('[aria-expanded="true"]');
                (trigger as HTMLElement)?.click();
            });
        });
    }, 500); // Wait for accordions to open
  };

  const handleShareWhatsApp = () => {
    if (!state.data || !state.data.mealSuggestions) return;

    const { planTitle, mealSuggestions } = state.data;

    let message = `Hey! 👋 Check out my meal plan from Nutrition Navigator:\n\n`;
    message += `*${planTitle}* 🥗\n\n`;

    mealSuggestions.forEach(meal => {
        message += `*${meal.day ? `${meal.day}: ` : ''}${meal.mealName}* (~${meal.calories} kcal)\n`;
        message += `_${meal.description}_\n\n`;
    });
    
    message += "Generated with ❤️ by Nutrition Navigator!";

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };


  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <form action={formAction}>
          <CardHeader>
            <CardTitle>{t('personalizeMeals')}</CardTitle>
            <CardDescription>
              {t('personalizeMealsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nationality">{t('nationality')}</Label>
              <Input
                id="nationality"
                name="nationality"
                placeholder={t('nationalityPlaceholder')}
                defaultValue="American"
              />
              {state.errors?.nationality && <p className="text-sm font-medium text-destructive">{state.errors.nationality}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dietaryRestrictions">{t('dietaryRestrictions')}</Label>
              <Textarea
                id="dietaryRestrictions"
                name="dietaryRestrictions"
                placeholder={t('dietaryRestrictionsPlaceholder')}
                defaultValue="None"
              />
              {state.errors?.dietaryRestrictions && <p className="text-sm font-medium text-destructive">{state.errors.dietaryRestrictions}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferences">{t('likesDislikes')}</Label>
              <Textarea
                id="preferences"
                name="preferences"
                placeholder={t('likesDislikesPlaceholder')}
                defaultValue="No major dislikes"
              />
              {state.errors?.preferences && <p className="text-sm font-medium text-destructive">{state.errors.preferences}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="calorieGoal">{t('dailyCalorieGoal')}</Label>
                    <Input id="calorieGoal" name="calorieGoal" type="number" placeholder={t('calorieGoalPlaceholder')} defaultValue="2000" />
                    {state.errors?.calorieGoal && <p className="text-sm font-medium text-destructive">{state.errors.calorieGoal}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="macroRatio">{t('macroRatio')}</Label>
                    <Input id="macroRatio" name="macroRatio" placeholder={t('macroRatioPlaceholder')} defaultValue="40/40/20" />
                    {state.errors?.macroRatio && <p className="text-sm font-medium text-destructive">{state.errors.macroRatio}</p>}
                </div>
            </div>
             <div className="space-y-2">
                <Label>{t('planDuration')}</Label>
                <RadioGroup name="planDuration" defaultValue="Daily" className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Daily" id="daily" />
                    <Label htmlFor="daily">{t('daily')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Weekly" id="weekly" />
                    <Label htmlFor="weekly">{t('weekly')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Monthly" id="monthly" />
                    <Label htmlFor="monthly">{t('monthly')}</Label>
                  </div>
                </RadioGroup>
                 {state.errors?.planDuration && <p className="text-sm font-medium text-destructive">{state.errors.planDuration}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      
      <Card className="flex flex-col lg:col-span-2">
        <CardHeader className='flex-row items-center justify-between'>
            <div>
              <CardTitle>
                {state.data?.planTitle || t('yourMealSuggestions')}
              </CardTitle>
              <CardDescription>
                {t('suggestionDetails')}
              </CardDescription>
            </div>
            {state.data && (
                <div className="flex items-center gap-2">
                    <Button onClick={handleShareWhatsApp} variant="outline" size="sm" disabled={pending}>
                        <WhatsAppIcon />
                        {t('share')}
                    </Button>
                    <Button onClick={handleDownloadPdf} variant="outline" size="sm" disabled={pending}>
                        <Download className="mr-2 h-4 w-4" />
                        {t('downloadPdf')}
                    </Button>
                </div>
            )}
        </CardHeader>
        <CardContent ref={suggestionsRef} className="flex-1 flex flex-col p-4">
            {state.data && state.data.mealSuggestions && state.data.mealSuggestions.length > 0 ? (
                 <div className="w-full space-y-4 overflow-y-auto">
                    <Accordion type="multiple" className="w-full">
                        {state.data.mealSuggestions.map((meal, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>
                                    <div className="flex flex-col items-start text-left">
                                         <h4 className="font-bold">
                                            {meal.day && <span className="text-primary mr-2">{meal.day}:</span>}
                                            {meal.mealName}
                                        </h4>
                                        <p className='text-sm text-muted-foreground'>~{meal.calories} kcal &bull; P: {meal.protein}g, C: {meal.carbs}g, F: {meal.fat}g</p>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-4 px-1">
                                        <p className="text-sm text-muted-foreground">{meal.description}</p>
                                        <div>
                                            <h5 className="font-semibold mb-2">{t('ingredients')}</h5>
                                            <ul className="list-disc list-inside text-sm space-y-1">
                                                {meal.ingredients.map((ingredient, i) => (
                                                    <li key={i}>{ingredient}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold mb-2">{t('instructions')}</h5>
                                            <p className="whitespace-pre-wrap text-sm">{meal.instructions}</p>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                 </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                    <Sparkles className="mx-auto h-12 w-12" />
                    <p className="mt-4">{t('aiPlaceholderTitle')}</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuggestionForm;
