
'use client';

import AppSidebar from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useLanguage } from '@/hooks/use-language';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userName, setUserName] = useState('Alex');
  const [userInitial, setUserInitial] = useState('A');
  const { t } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    if (name) {
      setUserName(name);
      setUserInitial(name.charAt(0).toUpperCase());
    } else if (email) {
      setUserName(email);
      setUserInitial(email.charAt(0).toUpperCase());
    }
  }, [searchParams]);

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col">
        <AppSidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
           <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="relative ml-auto flex-1 md:grow-0">
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {searchParams.get('email') || 'user@example.com'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 lg:pl-64">
            <div className="p-4 lg:p-8 pt-0">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
