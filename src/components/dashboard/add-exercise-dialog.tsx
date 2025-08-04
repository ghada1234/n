
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
import { useState, useEffect } from 'react';

interface AddExerciseDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddExercise: (exercise: Omit<ExerciseLogEntry, 'id'>) => void;
  onEditExercise: (exercise: ExerciseLogEntry) => void;
  exerciseToEdit: ExerciseLogEntry | null;
}

export default function AddExerciseDialog({ isOpen, onOpenChange, onAddExercise, onEditExercise, exerciseToEdit }: AddExerciseDialogProps) {
    const [type, setType] = useState('');
    const [details, setDetails] = useState('');
    const [caloriesBurned, setCaloriesBurned] = useState('');

    useEffect(() => {
        if (exerciseToEdit) {
            setType(exerciseToEdit.type);
            setDetails(exerciseToEdit.details);
            setCaloriesBurned(String(exerciseToEdit.caloriesBurned));
        } else {
            // Reset form when dialog is opened for adding, or closed
            setType('');
            setDetails('');
            setCaloriesBurned('');
        }
    }, [exerciseToEdit, isOpen]);


    const handleSubmit = () => {
        if (type && details && caloriesBurned) {
            if (exerciseToEdit) {
                onEditExercise({ ...exerciseToEdit, type, details, caloriesBurned: Number(caloriesBurned) });
            } else {
                onAddExercise({ type, details, caloriesBurned: Number(caloriesBurned) });
            }
            onOpenChange(false);
        }
    }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{exerciseToEdit ? 'Edit Exercise' : 'Add Exercise'}</DialogTitle>
          <DialogDescription>
            {exerciseToEdit ? 'Update the details of your exercise.' : 'Log a new exercise to your daily journal.'}
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
          <Button onClick={handleSubmit}>{exerciseToEdit ? 'Save Changes' : 'Add to Log'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
