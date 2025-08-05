
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import Image from 'next/image';

export default function AboutPage() {
    const { t } = useLanguage();
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
      <div className="space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-headline font-bold tracking-tight text-foreground sm:text-5xl">
            {t('aboutTitle')}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {t('aboutDescription1')}
          </p>
        </div>
        
        <div className="space-y-4">
            <p className="text-base text-muted-foreground leading-relaxed">
                {t('aboutDescription2')}
            </p>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-headline font-bold text-foreground">
                {t('meetTheTeam')}
            </h2>
            <p className="mt-2 text-muted-foreground">
                {t('teamDescription')}
            </p>
          </div>

          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-3 items-center">
                <div className="md:col-span-1">
                    <Image 
                        src="https://placehold.co/400x400.png"
                        alt={t('founderName')}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full"
                        data-ai-hint="portrait professional"
                    />
                </div>
                <div className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-2xl">{t('founderName')}</CardTitle>
                        <p className="text-sm font-medium text-primary">{t('founderTitle')}</p>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                         {t('founderDescription')}
                        </p>
                    </CardContent>
                </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
