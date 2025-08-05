
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle user creation here.
    // For this prototype, we'll just navigate to the dashboard.
    router.push(`/dashboard?name=${encodeURIComponent(name)}`);
  };
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>{t('createAccount')}</CardTitle>
        <CardDescription>
          {t('startYourJourney')}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSignup}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('fullNameLabel')}</Label>
            <Input 
              id="name" 
              name="name"
              type="text" 
              placeholder={t('fullNamePlaceholder')} 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('emailLabel')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('passwordLabel')}</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full">
            <UserPlus className="mr-2" /> {t('signUp')}
          </Button>
          <p className="text-sm text-muted-foreground">
            {t('alreadyHaveAccount')}{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              {t('login')}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
