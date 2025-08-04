
'use client';

import AppSidebar from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useLanguage } from '@/hooks/use-language';
import { useEffect } from 'react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 lg:pl-[256px]">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </SidebarProvider>
  );
}
