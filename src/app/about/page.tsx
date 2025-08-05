
'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/hooks/use-language";

export default function AboutPage() {
    const { t } = useLanguage();
    return (
        <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
            <div className="grid gap-12 md:grid-cols-2">
                <div className="space-y-4">
                    <h1 className="text-3xl font-headline font-bold tracking-tight sm:text-4xl md:text-5xl">
                        {t('aboutTitle')}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {t('aboutDescription1')}
                    </p>
                    <p className="text-muted-foreground">
                        {t('aboutDescription2')}
                    </p>
                </div>
                 <div className="relative">
                 <img
                    src="https://placehold.co/600x400.png"
                    data-ai-hint="healthy food"
                    alt="About Us Image"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                    />
                </div>
            </div>

            <div className="my-12 md:my-20 text-center">
                 <h2 className="text-3xl font-headline font-bold tracking-tight sm:text-4xl">
                    {t('meetTheTeam')}
                </h2>
                 <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                    {t('teamDescription')}
                </p>
            </div>

            <div className="grid max-w-4xl mx-auto gap-10 sm:grid-cols-1">
                 <div className="flex flex-col items-center text-center">
                     <Avatar className="h-32 w-32 mb-4">
                        <AvatarImage src="https://placehold.co/128x128.png" data-ai-hint="woman smiling" alt="Founder Photo" />
                        <AvatarFallback>GA</AvatarFallback>
                    </Avatar>
                    <h3 className="text-2xl font-bold font-headline">{t('founderName')}</h3>
                    <p className="text-muted-foreground font-semibold">{t('founderTitle')}</p>
                    <p className="mt-2 max-w-md text-muted-foreground">
                        {t('founderDescription')}
                    </p>
                 </div>
            </div>
        </div>
    );
}
