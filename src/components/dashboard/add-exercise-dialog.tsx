
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
import { useLanguage } from '@/hooks/use-language';

interface AddExerciseDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddExercise: (exercise: Omit<ExerciseLogEntry, 'id'>) => void;
  onEditExercise: (exercise: ExerciseLogEntry) => void;
  exerciseToEdit: ExerciseLogEntry | null;
}

export default function AddExerciseDialog({ isOpen, onOpenChange, onAddExercise, onEditExercise, exerciseToEdit }: AddExerciseDialogProps) {
    const { t } = useLanguage();
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
          <DialogTitle>{exerciseToEdit ? t('editExerciseTitle') : t('addExerciseTitle')}</DialogTitle>
          <DialogDescription>
            {exerciseToEdit ? t('editExerciseDesc') : t('addExerciseDesc')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              {t('exerciseType')}
            </Label>
            <Select onValueChange={setType} value={type}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t('selectType')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Cardio">{t('cardio')}</SelectItem>
                    <SelectItem value="Strength">{t('strength')}</SelectItem>
                    <SelectItem value="Flexibility">{t('flexibility')}</SelectItem>
                    <SelectItem value="Other">{t('other')}</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="details" className="text-right">
              {t('exerciseDetails')}
            </Label>
            <Input id="details" value={details} onChange={(e) => setDetails(e.target.value)} placeholder={t('exerciseDetailsPlaceholder')} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="caloriesBurned" className="text-right">
              {t('caloriesBurnedLabel')}
            </Label>
            <Input id="caloriesBurned" type="number" value={caloriesBurned} onChange={(e) => setCaloriesBurned(e.target.value)} placeholder={t('caloriesBurnedPlaceholder')} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>{exerciseToEdit ? t('saveChanges') : t('addToLog')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
