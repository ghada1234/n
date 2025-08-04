
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
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const AppSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/progress', label: 'Progress', icon: LineChart },
    { href: '/ai-suggestions', label: 'AI Suggestions', icon: Sparkles },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <Sidebar className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:fixed lg:inset-y-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Utensils className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-headline font-bold text-foreground">
            Nutrition Navigator
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
                    <span>Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Arabic
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" className="justify-start gap-2">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
