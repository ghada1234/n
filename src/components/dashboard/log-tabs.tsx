
'use client';
import { useState, useMemo } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, MoreHorizontal, Pencil, Trash2, Copy } from 'lucide-react';
import { Input } from '../ui/input';
import AddFoodDialog from './add-food-dialog';
import AddExerciseDialog from './add-exercise-dialog';
import SummaryCards from './summary-cards';

export interface FoodLogEntry {
  id: number;
  meal: string;
  item: string;
  portionSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface ExerciseLogEntry {
    id: number;
    type: string;
    details: string;
    caloriesBurned: number;
}

const initialFoodLog: FoodLogEntry[] = [
  { id: 1, meal: 'Breakfast', item: 'Oatmeal with Berries', portionSize: '1 cup', calories: 350, protein: 10, carbs: 60, fat: 8 },
  { id: 2, meal: 'Lunch', item: 'Grilled Chicken Salad', portionSize: '1 bowl', calories: 450, protein: 40, carbs: 20, fat: 25 },
  { id: 3, meal: 'Dinner', item: 'Salmon with Quinoa', portionSize: '1 filet', calories: 550, protein: 45, carbs: 40, fat: 28 },
  { id: 4, meal: 'Snacks', item: 'Apple and Peanut Butter', portionSize: '1 apple, 2 tbsp', calories: 230, protein: 8, carbs: 25, fat: 15 },
];

const initialExerciseLog: ExerciseLogEntry[] = [
  { id: 1, type: 'Cardio', details: 'Running - 30 min', caloriesBurned: 300 },
  { id: 2, type: 'Strength', details: 'Weightlifting', caloriesBurned: 150 },
];

const LogTabs = () => {
    const [foodLog, setFoodLog] = useState<FoodLogEntry[]>(initialFoodLog);
    const [exerciseLog, setExerciseLog] = useState<ExerciseLogEntry[]>(initialExerciseLog);
    
    const [isAddFoodOpen, setAddFoodOpen] = useState(false);
    const [isAddExerciseOpen, setAddExerciseOpen] = useState(false);

    const [editingFood, setEditingFood] = useState<FoodLogEntry | null>(null);
    const [editingExercise, setEditingExercise] = useState<ExerciseLogEntry | null>(null);

    const [activeTab, setActiveTab] = useState('food');
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddFood = (newFood: Omit<FoodLogEntry, 'id'>) => {
        setFoodLog(prevLog => [...prevLog, { ...newFood, id: Date.now() }]);
    }
     const handleEditFood = (updatedFood: FoodLogEntry) => {
        setFoodLog(prevLog => prevLog.map(entry => entry.id === updatedFood.id ? updatedFood : entry));
        setEditingFood(null);
    }
    const handleDeleteFood = (id: number) => {
        setFoodLog(prevLog => prevLog.filter(entry => entry.id !== id));
    }
    const handleLogAgainFood = (foodEntry: FoodLogEntry) => {
        handleAddFood({ ...foodEntry });
    }
    const openEditFoodDialog = (foodEntry: FoodLogEntry) => {
        setEditingFood(foodEntry);
        setAddFoodOpen(true);
    }

    const handleAddExercise = (newExercise: Omit<ExerciseLogEntry, 'id'>) => {
        setExerciseLog(prevLog => [...prevLog, { ...newExercise, id: Date.now() }]);
    }
    const handleEditExercise = (updatedExercise: ExerciseLogEntry) => {
        setExerciseLog(prevLog => prevLog.map(entry => entry.id === updatedExercise.id ? updatedExercise : entry));
        setEditingExercise(null);
    }
    const handleDeleteExercise = (id: number) => {
        setExerciseLog(prevLog => prevLog.filter(entry => entry.id !== id));
    }
    const handleLogAgainExercise = (exerciseEntry: ExerciseLogEntry) => {
        handleAddExercise({ type: exerciseEntry.type, details: exerciseEntry.details, caloriesBurned: exerciseEntry.caloriesBurned });
    }
     const openEditExerciseDialog = (exerciseEntry: ExerciseLogEntry) => {
        setEditingExercise(exerciseEntry);
        setAddExerciseOpen(true);
    }

    // Reset editing state when dialogs are closed
    const onFoodDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            setEditingFood(null);
        }
        setAddFoodOpen(isOpen);
    }
     const onExerciseDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            setEditingExercise(null);
        }
        setAddExerciseOpen(isOpen);
    }

    const filteredFoodLog = foodLog.filter(entry =>
        entry.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.meal.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredExerciseLog = exerciseLog.filter(entry =>
        entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const summaryData = useMemo(() => {
        const consumed = foodLog.reduce((acc, entry) => {
            acc.calories += entry.calories;
            acc.protein += entry.protein;
            acc.carbs += entry.carbs;
            acc.fat += entry.fat;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

        const burned = exerciseLog.reduce((acc, entry) => acc + entry.caloriesBurned, 0);
        
        return {
            consumed,
            burned,
        }
    }, [foodLog, exerciseLog]);

  return (
    <>
    <SummaryCards summaryData={summaryData} />
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="food">Food Log</TabsTrigger>
          <TabsTrigger value="exercise">Exercise Log</TabsTrigger>
        </TabsList>
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-card pl-8 md:w-[200px] lg:w-[320px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <TabsContent value="food">
        <Card>
          <CardHeader>
            <CardTitle>Today's Food</CardTitle>
            <CardDescription>
              A log of your daily food intake.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Calories</TableHead>
                  <TableHead className="text-right">Protein</TableHead>
                  <TableHead className="text-right">Carbs</TableHead>
                  <TableHead className="text-right">Fat</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFoodLog.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div className="font-medium">{entry.item}</div>
                      <div className="text-sm text-muted-foreground">{entry.meal} - {entry.portionSize}</div>
                    </TableCell>
                    <TableCell className="text-right">{entry.calories}</TableCell>
                    <TableCell className="text-right">{entry.protein}g</TableCell>
                    <TableCell className="text-right">{entry.carbs}g</TableCell>
                    <TableCell className="text-right">{entry.fat}g</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleLogAgainFood(entry)}>
                                    <Copy className="mr-2 h-4 w-4" /> Log Again
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditFoodDialog(entry)}>
                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteFood(entry.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="justify-end">
             <Button onClick={() => setAddFoodOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Food
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="exercise">
        <Card>
          <CardHeader>
            <CardTitle>Today's Exercise</CardTitle>
            <CardDescription>A log of your daily physical activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Calories Burned</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExerciseLog.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.type}</TableCell>
                    <TableCell>{entry.details}</TableCell>
                    <TableCell className="text-right">{entry.caloriesBurned}</TableCell>
                     <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleLogAgainExercise(entry)}>
                                    <Copy className="mr-2 h-4 w-4" /> Log Again
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditExerciseDialog(entry)}>
                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteExercise(entry.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
           <CardFooter className="justify-end">
             <Button onClick={() => setAddExerciseOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Exercise
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
    <AddFoodDialog 
        isOpen={isAddFoodOpen} 
        onOpenChange={onFoodDialogChange} 
        onAddFood={handleAddFood}
        onEditFood={handleEditFood}
        foodToEdit={editingFood}
    />
    <AddExerciseDialog 
        isOpen={isAddExerciseOpen} 
        onOpenChange={onExerciseDialogChange} 
        onAddExercise={handleAddExercise}
        onEditExercise={handleEditExercise}
        exerciseToEdit={editingExercise}
    />
    </>
  );
};

export default LogTabs;
