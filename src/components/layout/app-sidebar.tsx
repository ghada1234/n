
'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutGrid,
  LineChart,
  Sparkles,
  User,
  Utensils,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
import { useLanguage } from '@/hooks/use-language';

interface AppSidebarProps {
    isMobile?: boolean;
    onLinkClick?: () => void;
}

const AppSidebar = ({ isMobile = false, onLinkClick }: AppSidebarProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();

  const menuItems = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutGrid },
    { href: '/progress', label: t('progress'), icon: LineChart },
    { href: '/ai-suggestions', label: t('aiSuggestions'), icon: Sparkles },
    { href: '/profile', label: t('profile'), icon: User },
  ];

  const handleLogout = () => {
    if (onLinkClick) onLinkClick();
    router.push('/login');
  };

  const createHref = (path: string) => {
    const params = new URLSearchParams(searchParams.toString());
    return `${path}?${params.toString()}`;
  }

  const SidebarBody = () => (
    <div className="flex flex-col h-full">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Utensils className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-headline font-bold text-foreground">
            {t('appName')}
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className="justify-start"
                onClick={onLinkClick}
              >
                <Link href={createHref(item.href)}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {isMobile && (
             <Button variant="ghost" className="justify-start gap-2" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
                <span>{t('logout')}</span>
            </Button>
        )}
      </SidebarFooter>
    </div>
  );

  if (isMobile) {
    return <SidebarBody />;
  }

  return (
    <Sidebar className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:fixed lg:inset-y-0">
      <SidebarBody />
    </Sidebar>
  );
};

export default AppSidebar;
