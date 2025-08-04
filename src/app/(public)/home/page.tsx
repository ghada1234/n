import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Utensils, Sparkles, BarChart, Bell, UserCircle } from 'lucide-react';

const features = [
    {
        icon: UserCircle,
        title: 'User Profile',
        description: 'Create and manage your personal profile to tailor your nutrition plan.'
    },
    {
        icon: Utensils,
        title: 'Food and Exercise Log',
        description: 'Easily log your daily meals and workouts with our intuitive search and entry tools.'
    },
    {
        icon: Sparkles,
        title: 'AI Meal Suggestions',
        description: 'Get intelligent, healthy meal ideas based on your preferences and dietary needs.'
    },
    {
        icon: BarChart,
        title: 'Progress Visualization',
        description: 'Track your journey with beautiful charts that visualize your progress towards your goals.'
    },
     {
        icon: Bell,
        title: 'Push Notifications',
        description: 'Stay on track with friendly reminders to log your meals and exercise.'
    },
]

export default function HomePage() {
  return (
    <>
    <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
        <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                 <Image
                    src="https://placehold.co/600x400.png"
                    alt="Hero"
                    width={600}
                    height={400}
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                    data-ai-hint="healthy food platter"
                />
                <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                            Navigate Your Nutrition Journey
                        </h1>
                        <p className="max-w-[600px] text-muted-foreground md:text-xl">
                            Nutrition Navigator is your ultimate companion for achieving your health and fitness goals. Log meals, track progress, and get AI-powered suggestions tailored just for you.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                        <Button asChild size="lg">
                            <Link href="/signup">
                                Get Started
                            </Link>
                        </Button>
                         <Button asChild size="lg" variant="outline">
                            <Link href="/about">
                                Learn More
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                    <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                    <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Everything You Need to Succeed</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Our app is packed with features designed to make tracking your nutrition simple, effective, and enjoyable.
                    </p>
                </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 sm:grid-cols-2 md:grid-cols-3">
               {features.map((feature, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <feature.icon className="w-8 h-8 text-primary" />
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
               ))}
            </div>
        </div>
    </section>
    </>
  );
}
