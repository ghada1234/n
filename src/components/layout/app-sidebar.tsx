
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
  Settings,
  Languages,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useLanguage } from '@/hooks/use-language';

interface AppSidebarProps {
    isMobile?: boolean;
}

const AppSidebar = ({ isMobile = false}: AppSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { t, setLanguage } = useLanguage();

  const menuItems = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutGrid },
    { href: '/progress', label: t('progress'), icon: LineChart },
    { href: '/ai-suggestions', label: t('aiSuggestions'), icon: Sparkles },
    { href: '/profile', label: t('profile'), icon: User },
  ];

  const handleLogout = () => {
    router.push('/login');
  };

  const SidebarBody = () => (
    <>
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
              >
                <Link href={item.href}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 flex flex-col gap-2">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="justify-start gap-2">
                    <Languages className="w-5 h-5" />
                    <span>{t('language')}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                    {t('english')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ar')}>
                    {t('arabic')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" className="justify-start gap-2">
          <Settings className="w-5 h-5" />
          <span>{t('settings')}</span>
        </Button>
        <Button variant="ghost" className="justify-start gap-2" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
            <span>{t('logout')}</span>
        </Button>
      </SidebarFooter>
    </>
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
