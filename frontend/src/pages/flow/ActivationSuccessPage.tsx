// frontend/src/pages/flow/ActivationSuccessPage.tsx
import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import type { Event } from '@/types';
import Seo from '@/components/Seo';

const ActivationSuccessPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const event: Event | undefined = location.state?.event;

    if (!event) {
        // If the user lands here without an event in the state, send them to the dashboard.
        return <Navigate to="/dashboard/events" replace />;
    }

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
            <Seo title="Event Activated | FutureReminder" />
            <Card className="w-full max-w-lg text-center shadow-lg">
                <CardHeader>
                    <div className="flex justify-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                    </div>
                    <CardTitle className="text-3xl">Activation Successful!</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground pt-2">
                        Your reminder for <span className="font-semibold text-primary">{event.name}</span> is now active.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-6">
                        We will begin sending notifications according to your schedule. You can view and manage your event from your dashboard.
                    </p>
                    <Button 
                        size="lg" 
                        onClick={() => navigate('/dashboard/events')}
                    >
                        Go to My Dashboard
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ActivationSuccessPage;
