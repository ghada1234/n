import PageHeader from '@/components/page-header';
import ProgressCharts from '@/components/progress/progress-charts';

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Your Progress" />
      <ProgressCharts />
    </div>
  );
}
