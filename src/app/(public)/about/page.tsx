import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
            <div className="grid gap-12 md:grid-cols-2">
                <div className="space-y-4">
                    <h1 className="text-3xl font-headline font-bold tracking-tight sm:text-4xl md:text-5xl">
                        About Nutrition Navigator
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        We believe that navigating the world of nutrition should be simple, personal, and empowering. Our mission is to provide you with the tools and insights you need to build healthy habits, understand your body, and achieve your wellness goals with confidence.
                    </p>
                    <p className="text-muted-foreground">
                        Nutrition Navigator started with a simple idea: what if we could use technology to take the guesswork out of healthy eating? From that spark, we built an intelligent platform that combines user-friendly design with powerful AI to create a truly personalized nutrition companion. Whether you're looking to lose weight, build muscle, or simply feel your best, we're here to guide you every step of the way.
                    </p>
                </div>
                 <div className="relative">
                    <Image
                        src="https://placehold.co/600x400.png"
                        alt="Team working"
                        width={600}
                        height={400}
                        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                        data-ai-hint="team collaboration"
                    />
                </div>
            </div>

            <div className="my-12 md:my-20 text-center">
                 <h2 className="text-3xl font-headline font-bold tracking-tight sm:text-4xl">
                    Meet the Team
                </h2>
                 <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                    We are a passionate team of developers, designers, and nutrition enthusiasts.
                </p>
            </div>

            <div className="grid max-w-4xl mx-auto gap-10 sm:grid-cols-1">
                 <div className="flex flex-col items-center text-center">
                     <Avatar className="h-32 w-32 mb-4">
                        <AvatarImage asChild src="https://placehold.co/128x128.png">
                            <Image src="https://placehold.co/128x128.png" alt="Ghada Alani" width={128} height={128} data-ai-hint="professional woman portrait"/>
                        </AvatarImage>
                        <AvatarFallback>GA</AvatarFallback>
                    </Avatar>
                    <h3 className="text-2xl font-bold font-headline">Ghada Alani</h3>
                    <p className="text-muted-foreground font-semibold">Founder & Lead Nutritionist</p>
                    <p className="mt-2 max-w-md text-muted-foreground">
                        Ghada is a certified nutritionist with over a decade of experience helping people transform their lives through food. She is the visionary behind Nutrition Navigator, driven by a passion to make expert nutritional guidance accessible to everyone.
                    </p>
                 </div>
            </div>
        </div>
    );
}
