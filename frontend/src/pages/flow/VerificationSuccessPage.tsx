// src/pages/flow/VerificationSuccessPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon } from 'lucide-react';
import Seo from '@/components/Seo';

const VerificationSuccessPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Seo title="Verification Successful | FutureReminder" />
      <Card>
        <CardHeader className="items-center text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl">Verification Successful!</CardTitle>
          <CardDescription className="pt-2">
            Congratulations, your email address has been successfully verified. 
            Notifications for all your active events are now enabled.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link to="/dashboard/events">Go to My Events</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationSuccessPage;
