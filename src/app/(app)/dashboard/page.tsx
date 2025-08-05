
'use client';

import PageHeader from '@/components/page-header';
import LogTabs from '@/components/dashboard/log-tabs';
import { useLanguage } from '@/hooks/use-language';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState('Ghada'); // Default name

  useEffect(() => {
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    if (name) {
      setUserName(name);
    } else if (email) {
      setUserName(email);
    }
  }, [searchParams]);

  return (
    <div className="space-y-8">
      <PageHeader title={t('welcomeUser', { name: userName })} />
      <LogTabs />
    </div>
  );
}
