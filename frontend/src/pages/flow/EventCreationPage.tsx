// frontend/src/pages/flow/EventCreationPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { createAuthenticatedEvent } from '@/api';
import { EventCreationForm, type EventCreationData } from '@/forms/EventCreationForm'; // Assuming EventCreationForm is created

const EventCreationPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (data: EventCreationData) => {
        setIsSubmitting(true);
        try {
            // Since all users are authenticated by this step, we always call the same endpoint.
            const newEvent = await createAuthenticatedEvent(data);
            toast.success("Event created successfully!");
            // After creation, send them to the payment page.
            navigate('/create-flow/payment', { 
                state: { 
                    event: newEvent 
                } 
            });
        } catch (error: any) {
            toast.error("Failed to create event", {
                description: error.message || "An unknown error occurred."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        // This button is only relevant for users who were initially anonymous
        navigate('/create-flow/contacts');
    };

    return (
        <div className="container mx-auto max-w-4xl py-8">
            <Card className="bg-foreground text-background">
                <CardHeader>
                    <CardTitle className="text-3xl">
                        {/* The title can still be conditional for clarity */}
                        {isAuthenticated ? "Create Your Event" : "Step 3: Create Your Event"}
                    </CardTitle>
                    <CardDescription className="text-black">
                        Finally, tell us about the event you want to be reminded of.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EventCreationForm
                        initialData={{}} // Always a new event, so no initial data
                        onSubmit={handleFormSubmit}
                    />
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button 
                        variant="destructive" 
                        onClick={handleBack} 
                        size="lg"
                        disabled={isSubmitting}
                        // A user is only in the 'flow' if they weren't authenticated at the start.
                        // A simple check could be if they are newly authenticated or based on referrer.
                        // For now, we can conditionally show it if they are not a "claimed" user,
                        // but that data isn't easily available here. A simpler approach is needed.
                        // Let's assume for now the user who was anon can go back.
                        className={isAuthenticated ? 'visible' : 'invisible'} // This logic may need refinement
                    >
                        Back
                    </Button>
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
    );
};

export default EventCreationPage;