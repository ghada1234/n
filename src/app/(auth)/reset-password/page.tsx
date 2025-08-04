
'use client';

import { useState } from 'react';
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
import { KeyRound, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useLanguage } from '@/hooks/use-language';


export default function ResetPasswordPage() {
    const { toast } = useToast();
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsSent(false);

        try {
            await sendPasswordResetEmail(auth, email);
            toast({
                title: t('passwordResetSent'),
                description: t('passwordResetSentDesc'),
            });
            setIsSent(true);
        } catch (error: any) {
             const errorMessage = error.message || t('errorOccurred');
             toast({
                variant: "destructive",
                title: t('errorOccurred'),
                description: errorMessage,
            })
        } finally {
            setIsLoading(false);
        }
    }
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>{t('resetYourPassword')}</CardTitle>
        <CardDescription>
          {t('resetPasswordDescription')}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleReset}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('emailLabel')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || isSent}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading || isSent}>
            {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <KeyRound className="mr-2" />} 
            {isSent ? t('linkSent') : t('sendResetLink')}
          </Button>
          <Link href="/login" className="text-sm text-primary hover:underline">
            {t('backToLogin')}
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
