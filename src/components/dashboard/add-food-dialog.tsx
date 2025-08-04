
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import type { FoodLogEntry } from './log-tabs';
import { useState, useCallback, useEffect } from 'react';
import { Camera } from 'lucide-react';
import AnalyzeFoodDialog from './analyze-food-dialog';
import { useLanguage } from '@/hooks/use-language';

interface AddFoodDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddFood: (food: Omit<FoodLogEntry, 'id'>) => void;
  onEditFood: (food: FoodLogEntry) => void;
  foodToEdit: FoodLogEntry | null;
}

export default function AddFoodDialog({ isOpen, onOpenChange, onAddFood, onEditFood, foodToEdit }: AddFoodDialogProps) {
    const { t } = useLanguage();
    const [meal, setMeal] = useState('');
    const [item, setItem] = useState('');
    const [portionSize, setPortionSize] = useState('');
    const [calories, setCalories] = useState<number | null>(null);
    const [protein, setProtein] = useState<number | null>(null);
    const [carbs, setCarbs] = useState<number | null>(null);
    const [fat, setFat] = useState<number | null>(null);
    const [sodium, setSodium] = useState<number | null>(null);
    const [sugar, setSugar] = useState<number | null>(null);
    const [isAnalyzeOpen, setAnalyzeOpen] = useState(false);

    const resetForm = useCallback(() => {
        setMeal('');
        setItem('');
        setPortionSize('');
        setCalories(null);
        setProtein(null);
        setCarbs(null);
        setFat(null);
        setSodium(null);
        setSugar(null);
    }, []);

    useEffect(() => {
        if (foodToEdit) {
            setMeal(foodToEdit.meal);
            setItem(foodToEdit.item);
            setPortionSize(foodToEdit.portionSize);
            setCalories(foodToEdit.calories);
            setProtein(foodToEdit.protein);
            setCarbs(foodToEdit.carbs);
            setFat(foodToEdit.fat);
            setSodium(foodToEdit.sodium);
            setSugar(foodToEdit.sugar);
        } else if (!isOpen) {
            resetForm();
        }
    }, [foodToEdit, isOpen, resetForm]);


    const handleSubmit = () => {
        if (isSubmittable) {
             if (foodToEdit) {
                onEditFood({ ...foodToEdit, meal, item, portionSize, calories: calories!, protein: protein!, carbs: carbs!, fat: fat!, sodium: sodium!, sugar: sugar! });
            } else {
                onAddFood({ meal, item, portionSize, calories: calories!, protein: protein!, carbs: carbs!, fat: fat!, sodium: sodium!, sugar: sugar! });
            }
            onOpenChange(false);
        }
    }
    
    const handleAnalysisComplete = useCallback((analysisResult: any) => {
        setItem(analysisResult.dishName || analysisResult.productName);
        setPortionSize(analysisResult.portionSize);
        setCalories(analysisResult.calories);
        setProtein(analysisResult.protein);
        setCarbs(analysisResult.carbs);
        setFat(analysisResult.fat);
        setSodium(analysisResult.sodium);
        setSugar(analysisResult.sugar);
        setAnalyzeOpen(false);
    }, []);

    const isSubmittable = meal && item && portionSize && calories !== null;

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{foodToEdit ? t('editFoodItem') : t('addFoodItem')}</DialogTitle>
          <DialogDescription>
             {foodToEdit ? t('editFoodDescription') : t('addFoodDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="meal" className="text-right">
              {t('mealLabel')}
            </Label>
            <Select onValueChange={setMeal} value={meal}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t('mealPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Breakfast">{t('breakfast')}</SelectItem>
                    <SelectItem value="Lunch">{t('lunch')}</SelectItem>
                    <SelectItem value="Dinner">{t('dinner')}</SelectItem>
                    <SelectItem value="Snacks">{t('snacks')}</SelectItem>
                    <SelectItem value="Dessert">{t('dessert')}</SelectItem>
                </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item" className="text-right">
              {t('foodLabel')}
            </Label>
            <Input id="item" value={item} onChange={(e) => setItem(e.target.value)} placeholder={t('foodPlaceholder')} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="portionSize" className="text-right">
              {t('portionLabel')}
            </Label>
            <Input id="portionSize" value={portionSize} onChange={(e) => setPortionSize(e.target.value)} placeholder={t('portionPlaceholder')} className="col-span-3" />
          </div>
          {calories !== null && (
             <div className="grid grid-cols-4 items-start gap-4 rounded-md border p-4 bg-muted/50">
                <Label className="text-right col-span-1 pt-1">{t('nutrients')}</Label>
                <div className="col-span-3 grid gap-1 text-sm">
                    <div className='flex justify-between'><span className='text-muted-foreground'>{t('calories')}:</span> <span className='font-medium'>{calories} kcal</span></div>
                    <div className='flex justify-between'><span className='text-muted-foreground'>{t('protein')}:</span> <span className='font-medium'>{protein} g</span></div>
                    <div className='flex justify-between'><span className='text-muted-foreground'>{t('carbs')}:</span> <span className='font-medium'>{carbs} g</span></div>
                    <div className='flex justify-between'><span className='text-muted-foreground'>{t('fat')}:</span> <span className='font-medium'>{fat} g</span></div>
                    <div className='flex justify-between'><span className='text-muted-foreground'>{t('sodium')}:</span> <span className='font-medium'>{sodium} mg</span></div>
                    <div className='flex justify-between'><span className='text-muted-foreground'>{t('sugar')}:</span> <span className='font-medium'>{sugar} g</span></div>
                </div>
             </div>
          )}
          <Button variant="outline" onClick={() => setAnalyzeOpen(true)}>
            <Camera className="mr-2 h-4 w-4" />
            {t('analyzeWithAI')}
          </Button>
          {!isSubmittable && !foodToEdit && <p className="text-center text-sm text-muted-foreground">{t('analyzerPrompt')}</p>}
        </div>
        <DialogFooter>
            <Button onClick={handleSubmit} disabled={!isSubmittable}>{foodToEdit ? t('saveChanges') : t('addToLog')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <AnalyzeFoodDialog 
        isOpen={isAnalyzeOpen} 
        onOpenChange={setAnalyzeOpen} 
        onAnalysisComplete={handleAnalysisComplete}
    />
    </>
  );
}
