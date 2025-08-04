
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
import type { ExerciseLogEntry } from './log-tabs';
import { useState } from 'react';

interface AddExerciseDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddExercise: (exercise: Omit<ExerciseLogEntry, 'id'>) => void;
}

export default function AddExerciseDialog({ isOpen, onOpenChange, onAddExercise }: AddExerciseDialogProps) {
    const [type, setType] = useState('');
    const [details, setDetails] = useState('');
    const [caloriesBurned, setCaloriesBurned] = useState('');

    const handleSubmit = () => {
        if (type && details && caloriesBurned) {
            onAddExercise({ type, details, caloriesBurned: Number(caloriesBurned) });
            onOpenChange(false);
            // Reset form
            setType('');
            setDetails('');
            setCaloriesBurned('');
        }
    }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
          <DialogDescription>
            Log a new exercise to your daily journal.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select onValueChange={setType} value={type}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Cardio">Cardio</SelectItem>
                    <SelectItem value="Strength">Strength</SelectItem>
                    <SelectItem value="Flexibility">Flexibility</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="details" className="text-right">
              Details
            </Label>
            <Input id="details" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="e.g., Running - 30 min" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="caloriesBurned" className="text-right">
              Calories Burned
            </Label>
            <Input id="caloriesBurned" type="number" value={caloriesBurned} onChange={(e) => setCaloriesBurned(e.target.value)} placeholder="e.g., 300" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add to Log</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
