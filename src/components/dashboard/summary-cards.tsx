import { Flame, Zap, Salad, Cookie } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const SummaryCards = () => {
  const calorieData = { consumed: 1580, goal: 2200 };
  const exerciseData = { burned: 320 };
  const macroData = {
    protein: { consumed: 120, goal: 150 },
    carbs: { consumed: 180, goal: 250 },
    fat: { consumed: 50, goal: 70 },
  };
  const netCalories = calorieData.consumed - exerciseData.burned;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Calories</CardTitle>
          <Flame className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{netCalories}</div>
          <p className="text-xs text-muted-foreground">
            {calorieData.consumed} consumed - {exerciseData.burned} burned
          </p>
          <Progress
            value={(netCalories / calorieData.goal) * 100}
            className="mt-2 h-2"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Protein (g)</CardTitle>
          <Salad className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{macroData.protein.consumed}</div>
          <p className="text-xs text-muted-foreground">
            Goal: {macroData.protein.goal}g
          </p>
          <Progress
            value={(macroData.protein.consumed / macroData.protein.goal) * 100}
            className="mt-2 h-2"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Carbs (g)</CardTitle>
          <Cookie className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{macroData.carbs.consumed}</div>
          <p className="text-xs text-muted-foreground">
            Goal: {macroData.carbs.goal}g
          </p>
          <Progress
            value={(macroData.carbs.consumed / macroData.carbs.goal) * 100}
            className="mt-2 h-2"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fat (g)</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{macroData.fat.consumed}</div>
          <p className="text-xs text-muted-foreground">
            Goal: {macroData.fat.goal}g
          </p>
          <Progress
            value={(macroData.fat.consumed / macroData.fat.goal) * 100}
            className="mt-2 h-2"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
