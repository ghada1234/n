import PageHeader from '@/components/page-header';
import SummaryCards from '@/components/dashboard/summary-cards';
import LogTabs from '@/components/dashboard/log-tabs';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" />
      <SummaryCards />
      <LogTabs />
    </div>
  );
}
