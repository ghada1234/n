
'use client';

import PageHeader from '@/components/page-header';
import LogTabs from '@/components/dashboard/log-tabs';
import { useLanguage } from '@/hooks/use-language';

export default function DashboardPage() {
  const { t } = useLanguage();
  // In a real app, you would get the user's name from your authentication state
  const userName = 'Alex'; // Placeholder for demonstration

  return (
    <div className="space-y-8">
      <PageHeader title={t('welcomeUser', { name: userName })} />
      <LogTabs />
    </div>
  );
}
