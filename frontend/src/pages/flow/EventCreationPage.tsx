// frontend/src/pages/flow/EventCreationPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { createAuthenticatedEvent, getUserProfile, getEmergencyContacts } from '@/api';
import { EventCreationForm, type EventCreationData } from '@/forms/EventCreationForm';
import Summary from '@/components/Summary';
import type { UserProfile, EmergencyContact } from '@/types';

const EventCreationPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        Promise.all([getUserProfile(), getEmergencyContacts()])
            .then(([userProfile, emergencyContacts]) => {
                setProfile(userProfile);
                setContacts(emergencyContacts);
            })
            .catch(error => {
                toast.error("Failed to load user data.", {
                    description: error.message || "Could not fetch your details.",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handleFormSubmit = async (data: EventCreationData) => {
        setIsSubmitting(true);
        try {
            const newEvent = await createAuthenticatedEvent(data);
            toast.success("Event created successfully!");
            navigate('/create-flow/payment', { state: { event: newEvent } });
        } catch (error: any) {
            toast.error("Failed to create event", {
                description: error.message || "An unknown error occurred."
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (isLoading) {
        return (
            <div className="container mx-auto flex justify-center items-center h-screen">
                <Spinner className="w-8 h-8 mr-2" /> <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-6xl py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Main Content Column */}
                <div className="w-full md:w-2/3">
                    <Card className="bg-foreground text-background">
                        <CardHeader>
                            <CardTitle className="text-3xl">Step 3: Create Your Event</CardTitle>
                            <CardDescription className="text-black">
                                Finally, tell us about the event you want to be reminded of.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EventCreationForm
                                initialData={{}} // Always a new event
                                onSubmit={handleFormSubmit}
                            />
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button 
                                size="lg"
                                disabled={isSubmitting}
                                onClick={() => document.getElementById('event-creation-submit')?.click()}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                                Finish & Create Event
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
                {/* Right Summary Column */}
                <div className="w-full md:w-1/3">
                    <Summary user={profile} emergencyContacts={contacts} />
                </div>
            </div>
        </div>
    );
};

export default EventCreationPage;