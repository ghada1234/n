import PageHeader from '@/components/page-header';
import ProfileForm from '@/components/profile/profile-form';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Your Profile" />
      <Card>
        <CardContent className="pt-6">
            <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
