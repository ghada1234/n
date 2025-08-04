import AppSidebar from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 lg:pl-[256px]">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </SidebarProvider>
  );
}
