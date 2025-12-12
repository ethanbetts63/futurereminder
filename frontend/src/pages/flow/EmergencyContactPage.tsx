// frontend/src/pages/flow/EmergencyContactPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmergencyContactsManager } from '@/components/EmergencyContactsManager';
import Summary from '@/components/Summary';
import { useAuth } from '@/context/AuthContext';
import { getEmergencyContacts, getUserProfile } from '@/api';
import type { EmergencyContact, UserProfile } from '@/types';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';


const EmergencyContactPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [initialContacts, setInitialContacts] = useState<EmergencyContact[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            navigate('/create-flow/profile', { replace: true });
            return;
        }

        if (isAuthenticated) {
            Promise.all([getUserProfile(), getEmergencyContacts()])
                .then(([userProfile, emergencyContacts]) => {
                    setProfile(userProfile);
                    setInitialContacts(emergencyContacts);
                })
                .catch(error => {
                    toast.error("Failed to load user data.", {
                        description: error.message || "You can add contacts later in your account settings.",
                    });
                    console.error("Error fetching data:", error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else if (!isAuthLoading) {
            setIsLoading(false);
        }
    }, [isAuthenticated, isAuthLoading, navigate]);


    const handleNext = () => {
        navigate('/create-flow/event');
    };

    if (isAuthLoading || isLoading) {
        return (
            <div className="container mx-auto flex justify-center items-center h-screen">
                <Spinner className="w-8 h-8 mr-2" /> <p>Loading your information...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-6xl py-12">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Main Content Column */}
                <div className="w-full md:w-2/3">
                    <Card className="bg-foreground text-background">
                        <CardHeader>
                            <CardTitle>Step 2: Add Emergency Contacts (Optional)</CardTitle>
                            <CardDescription className="text-black">
                                These are the people we'll notify if we can't reach you. You can skip this and add them later from your account settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EmergencyContactsManager
                                initialContacts={initialContacts}
                                onContactsChange={() => { /* Contacts are managed internally by API calls */ }}
                            />
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={handleNext} size="lg">Next: Event Details</Button>
                        </CardFooter>
                    </Card>
                </div>
                {/* Right Summary Column */}
                <div className="w-full md:w-1/3">
                    <Summary user={profile} />
                </div>
            </div>
        </div>
    );
};

export default EmergencyContactPage;