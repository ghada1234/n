
'use client';
import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '../ui/input';
import AddFoodDialog from './add-food-dialog';
import AddExerciseDialog from './add-exercise-dialog';

export interface FoodLogEntry {
  id: number;
  meal: string;
  item: string;
  calories: number;
}

export interface ExerciseLogEntry {
    id: number;
    type: string;
    details: string;
    caloriesBurned: number;
}

const initialFoodLog: FoodLogEntry[] = [
  { id: 1, meal: 'Breakfast', item: 'Oatmeal with Berries', calories: 350 },
  { id: 2, meal: 'Lunch', item: 'Grilled Chicken Salad', calories: 450 },
  { id: 3, meal: 'Dinner', item: 'Salmon with Quinoa', calories: 550 },
  { id: 4, meal: 'Snacks', item: 'Apple and Peanut Butter', calories: 230 },
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
    const [activeTab, setActiveTab] = useState('food');
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddFood = (newFood: Omit<FoodLogEntry, 'id'>) => {
        setFoodLog(prevLog => [...prevLog, { ...newFood, id: prevLog.length + 1 }]);
    }

    const handleAddExercise = (newExercise: Omit<ExerciseLogEntry, 'id'>) => {
        setExerciseLog(prevLog => [...prevLog, { ...newExercise, id: prevLog.length + 1 }]);
    }

    const filteredFoodLog = foodLog.filter(entry =>
        entry.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.meal.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredExerciseLog = exerciseLog.filter(entry =>
        entry.details.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
    <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                  <TableHead>Meal</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Calories</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFoodLog.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.meal}</TableCell>
                    <TableCell>{entry.item}</TableCell>
                    <TableCell className="text-right">{entry.calories}</TableCell>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExerciseLog.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.type}</TableCell>
                    <TableCell>{entry.details}</TableCell>
                    <TableCell className="text-right">{entry.caloriesBurned}</TableCell>
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
    <AddFoodDialog isOpen={isAddFoodOpen} onOpenChange={setAddFoodOpen} onAddFood={handleAddFood} />
    <AddExerciseDialog isOpen={isAddExerciseOpen} onOpenChange={setAddExerciseOpen} onAddExercise={handleAddExercise} />
    </>
  );
};

export default LogTabs;
