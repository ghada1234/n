
'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/use-language';
import { Save } from 'lucide-react';

const ProfileForm = () => {
  const { t } = useLanguage();
  return (
    <form className="space-y-8">
      <div className="flex items-center gap-8">
        <Avatar className="h-24 w-24">
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
            <h3 className="text-2xl font-headline">Alex Doe</h3>
            <p className="text-muted-foreground">alex.doe@example.com</p>
            <Button variant="outline" size="sm">{t('changePhoto')}</Button>
        </div>
      </div>
      <Separator />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">{t('fullNameLabel')}</Label>
          <Input id="name" defaultValue="Alex Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t('emailLabel')}</Label>
          <Input id="email" type="email" defaultValue="alex.doe@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">{t('age')}</Label>
          <Input id="age" type="number" defaultValue="32" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationality">{t('nationality')}</Label>
          <Input id="nationality" defaultValue="American" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">{t('height')}</Label>
          <Input id="height" type="number" defaultValue="175" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startWeight">{t('startWeight')}</Label>
          <Input id="startWeight" type="number" defaultValue="86" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentWeight">{t('currentWeight')}</Label>
          <Input id="currentWeight" type="number" defaultValue="82" />
        </div>
         <div className="space-y-2 md:col-span-2">
          <Label htmlFor="goal">{t('primaryGoal')}</Label>
          <Input id="goal" defaultValue={t('primaryGoalPlaceholder')} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" /> {t('saveChanges')}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
