import { Utensils } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="absolute top-8 left-8 flex items-center gap-2">
             <Utensils className="w-8 h-8 text-primary" />
             <h1 className="text-2xl font-headline font-bold text-foreground">
                Nutrition Navigator
             </h1>
        </div>
      <div className="w-full max-w-sm">
        {children}
      </div>
    </div>
  );
}
