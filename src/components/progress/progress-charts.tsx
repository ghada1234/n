
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { useLanguage } from '@/hooks/use-language';

const weightData = [
  { date: 'Jan 1', weight: 186 },
  { date: 'Jan 8', weight: 185 },
  { date: 'Jan 15', weight: 185 },
  { date: 'Jan 22', weight: 184 },
  { date: 'Jan 29', weight: 182 },
  { date: 'Feb 5', weight: 181 },
];

const calorieData = [
  { day: 'Mon', calories: 2100 },
  { day: 'Tue', calories: 2250 },
  { day: 'Wed', calories: 1900 },
  { day: 'Thu', calories: 2300 },
  { day: 'Fri', calories: 2400 },
  { day: 'Sat', calories: 2500 },
  { day: 'Sun', calories: 2200 },
];

const ProgressCharts = () => {
    const { t } = useLanguage();
    
    const weightChartConfig = {
      weight: {
        label: t('weightLabel'),
        color: 'hsl(var(--primary))',
      },
    } satisfies ChartConfig;
    
    const calorieChartConfig = {
      calories: {
        label: t('calories'),
        color: 'hsl(var(--accent))',
      },
    } satisfies ChartConfig;

  return (
    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('weightOverTime')}</CardTitle>
          <CardDescription>{t('weightProgressDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={weightChartConfig} className="h-[300px] w-full">
            <LineChart data={weightData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line dataKey="weight" type="monotone" stroke="var(--color-weight)" strokeWidth={2} dot={true} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('weeklyCalorieIntake')}</CardTitle>
          <CardDescription>{t('weeklyCalorieIntakeDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={calorieChartConfig} className="h-[300px] w-full">
            <BarChart data={calorieData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="calories" fill="var(--color-calories)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressCharts;
