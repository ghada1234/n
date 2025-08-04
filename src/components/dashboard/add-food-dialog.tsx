
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

interface AddFoodDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddFood: (food: Omit<FoodLogEntry, 'id'>) => void;
  onEditFood: (food: FoodLogEntry) => void;
  foodToEdit: FoodLogEntry | null;
}

export default function AddFoodDialog({ isOpen, onOpenChange, onAddFood, onEditFood, foodToEdit }: AddFoodDialogProps) {
    const [meal, setMeal] = useState('');
    const [item, setItem] = useState('');
    const [portionSize, setPortionSize] = useState('');
    const [calories, setCalories] = useState<number | null>(null);
    const [protein, setProtein] = useState<number | null>(null);
    const [carbs, setCarbs] = useState<number | null>(null);
    const [fat, setFat] = useState<number | null>(null);
    const [isAnalyzeOpen, setAnalyzeOpen] = useState(false);

    useEffect(() => {
        if (foodToEdit) {
            setMeal(foodToEdit.meal);
            setItem(foodToEdit.item);
            setPortionSize(foodToEdit.portionSize);
            setCalories(foodToEdit.calories);
            setProtein(foodToEdit.protein);
            setCarbs(foodToEdit.carbs);
            setFat(foodToEdit.fat);
        } else {
            // Reset form when dialog is opened for adding, or closed
            setMeal('');
            setItem('');
            setPortionSize('');
            setCalories(null);
            setProtein(null);
            setCarbs(null);
            setFat(null);
        }
    }, [foodToEdit, isOpen]);


    const handleSubmit = () => {
        if (meal && item && portionSize && calories !== null && protein !== null && carbs !== null && fat !== null) {
             if (foodToEdit) {
                onEditFood({ ...foodToEdit, meal, item, portionSize, calories, protein, carbs, fat });
            } else {
                onAddFood({ meal, item, portionSize, calories, protein, carbs, fat });
            }
            onOpenChange(false);
        }
    }
    
    const handleAnalysisComplete = useCallback((analysisResult: { dishName: string; calories: number; portionSize: string; protein: number, carbs: number, fat: number }) => {
        setItem(analysisResult.dishName);
        setPortionSize(analysisResult.portionSize);
        setCalories(analysisResult.calories);
        setProtein(analysisResult.protein);
        setCarbs(analysisResult.carbs);
        setFat(analysisResult.fat);
        setAnalyzeOpen(false);
    }, []);

    const isSubmittable = meal && item && portionSize && calories !== null;

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{foodToEdit ? 'Edit Food Item' : 'Add Food Item'}</DialogTitle>
          <DialogDescription>
             {foodToEdit ? 'Update the details of your food item.' : 'Log a new food item to your daily journal using the AI Analyzer.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="meal" className="text-right">
              Meal
            </Label>
            <Select onValueChange={setMeal} value={meal}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a meal" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Breakfast">Breakfast</SelectItem>
                    <SelectItem value="Lunch">Lunch</SelectItem>
                    <SelectItem value="Dinner">Dinner</SelectItem>
                    <SelectItem value="Snacks">Snacks</SelectItem>
                    <SelectItem value="Dessert">Dessert</SelectItem>
                </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item" className="text-right">
              Food
            </Label>
            <Input id="item" value={item} onChange={(e) => setItem(e.target.value)} placeholder="e.g., Apple" className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="portionSize" className="text-right">
              Portion Size
            </Label>
            <Input id="portionSize" value={portionSize} onChange={(e) => setPortionSize(e.target.value)} placeholder="e.g., 1 cup" className="col-span-3" />
          </div>
          {calories !== null && (
             <div className="grid grid-cols-4 items-start gap-4 rounded-md border p-4 bg-muted/50">
                <Label className="text-right col-span-1 pt-1">Nutrients</Label>
                <div className="col-span-3 grid gap-1 text-sm">
                    <div className='flex justify-between'><span className='text-muted-foreground'>Calories:</span> <span className='font-medium'>{calories} kcal</span></div>
                    <div className='flex justify-between'><span className='text-muted-foreground'>Protein:</span> <span className='font-medium'>{protein} g</span></div>
                    <div className='flex justify-between'><span className='text-muted-foreground'>Carbs:</span> <span className='font-medium'>{carbs} g</span></div>
                    <div className='flex justify-between'><span className='text-muted-foreground'>Fat:</span> <span className='font-medium'>{fat} g</span></div>
                </div>
             </div>
          )}
          <Button variant="outline" onClick={() => setAnalyzeOpen(true)}>
            <Camera className="mr-2 h-4 w-4" />
            Analyze with AI
          </Button>
          {!isSubmittable && !foodToEdit && <p className="text-center text-sm text-muted-foreground">Please use the AI Analyzer to determine nutrients before logging.</p>}
        </div>
        <DialogFooter>
            <Button onClick={handleSubmit} disabled={!isSubmittable}>{foodToEdit ? 'Save Changes' : 'Add to Log'}</Button>
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
