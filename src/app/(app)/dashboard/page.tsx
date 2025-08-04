import PageHeader from '@/components/page-header';
import LogTabs from '@/components/dashboard/log-tabs';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" />
      <LogTabs />
    </div>
  );
}
