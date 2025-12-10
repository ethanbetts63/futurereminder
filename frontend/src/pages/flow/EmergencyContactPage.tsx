// frontend/src/pages/flow/EmergencyContactPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmergencyContactsManager } from '@/components/EmergencyContactsManager';
import { useAuth } from '@/context/AuthContext';
import { getEmergencyContacts } from '@/api';
import type { EmergencyContact } from '@/types';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';


const EmergencyContactPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const [initialContacts, setInitialContacts] = useState<EmergencyContact[]>([]);
    const [isLoadingContacts, setIsLoadingContacts] = useState(true);

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            // If somehow not authenticated, redirect to profile creation
            navigate('/create-flow/profile', { replace: true });
            return;
        }

        if (isAuthenticated) {
            const fetchContacts = async () => {
                try {
                    setIsLoadingContacts(true);
                    const contacts = await getEmergencyContacts();
                    setInitialContacts(contacts);
                } catch (error) {
                    toast.error("Failed to load emergency contacts.", {
                        description: "You can add them later in your account settings.",
                    });
                    console.error("Error fetching emergency contacts:", error);
                } finally {
                    setIsLoadingContacts(false);
                }
            };
            fetchContacts();
        }
    }, [isAuthenticated, isAuthLoading, navigate]);


    const handleNext = () => {
        navigate('/create-flow/event');
    };

    const handleBack = () => {
        // Go back to profile creation, but since they are logged in now,
        // it doesn't make sense to go back to *create* profile.
        // For simplicity in this flow, we assume profile is done.
        // In a real app, 'Back' here might go to dashboard or just 'Next' only.
        // For now, let's keep it simple and just go to next.
        navigate('/create-flow/profile'); // Still goes back to profile if user clicks, but should be rare
    };

    if (isAuthLoading || isLoadingContacts) {
        return (
            <div className="container mx-auto flex justify-center items-center h-screen">
                <Spinner className="w-8 h-8 mr-2" /> <p>Loading contacts...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl py-12">
            <Card>
                <CardHeader>
                    <CardTitle>Step 2: Add Emergency Contacts (Optional)</CardTitle>
                    <CardDescription>
                        These are the people we'll notify if we can't reach you. You can skip this and add them later from your account settings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                                        <EmergencyContactsManager
                                            initialContacts={initialContacts}
                                            onContactsChange={() => { /* Contacts are managed internally by API calls */ }}
                                        />                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleBack} size="lg">Back</Button>
                    <Button onClick={handleNext} size="lg">Next: Event Details</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default EmergencyContactPage;