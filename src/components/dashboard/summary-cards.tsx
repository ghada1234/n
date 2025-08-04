import { Flame, Zap, Salad, Cookie } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SummaryCardsProps {
    summaryData: {
        consumed: {
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
        };
        burned: number;
    }
}

const SummaryCards = ({ summaryData }: SummaryCardsProps) => {
  const calorieGoal = 2200;
  const macroGoals = {
    protein: 150,
    carbs: 250,
    fat: 70,
  };

  const netCalories = summaryData.consumed.calories - summaryData.burned;

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
            {summaryData.consumed.calories} consumed - {summaryData.burned} burned
          </p>
          <Progress
            value={(netCalories / calorieGoal) * 100}
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
          <div className="text-2xl font-bold">{summaryData.consumed.protein}</div>
          <p className="text-xs text-muted-foreground">
            Goal: {macroGoals.protein}g
          </p>
          <Progress
            value={(summaryData.consumed.protein / macroGoals.protein) * 100}
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
          <div className="text-2xl font-bold">{summaryData.consumed.carbs}</div>
          <p className="text-xs text-muted-foreground">
            Goal: {macroGoals.carbs}g
          </p>
          <Progress
            value={(summaryData.consumed.carbs / macroGoals.carbs) * 100}
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
          <div className="text-2xl font-bold">{summaryData.consumed.fat}</div>
          <p className="text-xs text-muted-foreground">
            Goal: {macroGoals.fat}g
          </p>
          <Progress
            value={(summaryData.consumed.fat / macroGoals.fat) * 100}
            className="mt-2 h-2"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
