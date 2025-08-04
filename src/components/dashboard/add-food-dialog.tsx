
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
import { useState } from 'react';

interface AddFoodDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddFood: (food: Omit<FoodLogEntry, 'id'>) => void;
}

export default function AddFoodDialog({ isOpen, onOpenChange, onAddFood }: AddFoodDialogProps) {
    const [meal, setMeal] = useState('');
    const [item, setItem] = useState('');
    const [calories, setCalories] = useState('');

    const handleSubmit = () => {
        if (meal && item && calories) {
            onAddFood({ meal, item, calories: Number(calories) });
            onOpenChange(false);
            // Reset form
            setMeal('');
            setItem('');
            setCalories('');
        }
    }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Food Item</DialogTitle>
          <DialogDescription>
            Log a new food item to your daily journal.
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
            <Label htmlFor="calories" className="text-right">
              Calories
            </Label>
            <Input id="calories" type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="e.g., 95" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add to Log</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
