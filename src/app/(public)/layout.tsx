
'use client';

import { Utensils, Languages } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/use-language';
import { usePathname } from 'next/navigation';

const NavLinks = () => {
    const { t } = useLanguage();
    return (
        <>
            <Link href="/home" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('home')}
            </Link>
            <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('about')}
            </Link>
        </>
    )
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();

  // Hide layout on auth pages
  if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/reset-password')) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex min-h-screen w-full flex-col">
       <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Utensils className="h-6 w-6 text-primary" />
             <h1 className="text-lg font-headline font-bold text-foreground">
                {t('appName')}
             </h1>
          </Link>
          <NavLinks />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">{t('toggleNavigation')}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side={language === 'ar' ? 'right' : 'left'}>
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Utensils className="h-6 w-6 text-primary" />
                <span className="sr-only">{t('appName')}</span>
              </Link>
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Languages className="h-5 w-5" />
                    <span className="sr-only">{t('changeLanguage')}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                    {t('english')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ar')}>
                    {t('arabic')}
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild>
            <Link href="/login">{t('login')}</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">{children}</main>
       <footer className="flex items-center justify-center py-6 px-4 md:px-6 border-t bg-background">
            <p className="text-sm text-muted-foreground">{t('copyright')}</p>
        </footer>
    </div>
  );
}
