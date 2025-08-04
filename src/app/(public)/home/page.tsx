
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Utensils, Sparkles, BarChart, Bell, UserCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export default function HomePage() {
  const { t } = useLanguage();
  const features = [
      {
          icon: UserCircle,
          title: t('featureUserProfileTitle'),
          description: t('featureUserProfileDescription')
      },
      {
          icon: Utensils,
          title: t('featureFoodLogTitle'),
          description: t('featureFoodLogDescription')
      },
      {
          icon: Sparkles,
          title: t('featureAISuggestionsTitle'),
          description: t('featureAISuggestionsDescription')
      },
      {
          icon: BarChart,
          title: t('featureProgressTitle'),
          description: t('featureProgressDescription')
      },
       {
          icon: Bell,
          title: t('featureNotificationsTitle'),
          description: t('featureNotificationsDescription')
      },
  ]

  return (
    <>
    <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
        <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                            {t('homeTitle')}
                        </h1>
                        <p className="max-w-[600px] text-muted-foreground md:text-xl">
                            {t('homeDescription')}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                        <Button asChild size="lg">
                            <Link href="/signup">
                                {t('getStarted')}
                            </Link>
                        </Button>
                         <Button asChild size="lg" variant="outline">
                            <Link href="/about">
                                {t('learnMore')}
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
                    <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">{t('keyFeatures')}</div>
                    <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">{t('featuresTitle')}</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        {t('featuresDescription')}
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
