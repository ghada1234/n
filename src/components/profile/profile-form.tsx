'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';
import Image from 'next/image';

const ProfileForm = () => {
  return (
    <form className="space-y-8">
      <div className="flex items-center gap-8">
        <Avatar className="h-24 w-24">
          <AvatarImage asChild src="https://placehold.co/100x100.png">
            <Image
              src="https://placehold.co/100x100.png"
              width={100}
              height={100}
              alt="User Avatar"
              data-ai-hint="person portrait"
            />
          </AvatarImage>
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
            <h3 className="text-2xl font-headline">Alex Doe</h3>
            <p className="text-muted-foreground">alex.doe@example.com</p>
            <Button variant="outline" size="sm">Change Photo</Button>
        </div>
      </div>
      <Separator />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" defaultValue="Alex Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" defaultValue="alex.doe@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" defaultValue="32" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input id="height" type="number" defaultValue="175" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startWeight">Starting Weight (kg)</Label>
          <Input id="startWeight" type="number" defaultValue="86" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentWeight">Current Weight (kg)</Label>
          <Input id="currentWeight" type="number" defaultValue="82" />
        </div>
         <div className="space-y-2 md:col-span-2">
          <Label htmlFor="goal">Primary Goal</Label>
          <Input id="goal" defaultValue="Lose 5kg and build muscle" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
