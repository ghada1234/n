import PageHeader from '@/components/page-header';
import LogTabs from '@/components/dashboard/log-tabs';

export default function DashboardPage() {
  // In a real app, you would get the user's name from your authentication state
  const userName = 'Alex'; // Placeholder for demonstration

  return (
    <div className="space-y-8">
      <PageHeader title={`Welcome, ${userName}!`} />
      <LogTabs />
    </div>
  );
}
