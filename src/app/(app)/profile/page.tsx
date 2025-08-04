
'use client';
import PageHeader from '@/components/page-header';
import ProfileForm from '@/components/profile/profile-form';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';

export default function ProfilePage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      <PageHeader title={t('yourProfile')} />
      <Card>
        <CardContent className="pt-6">
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
