// frontend/src/pages/flow/ProfileCreationPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ProfileCreationForm, type ProfileCreationData } from '@/forms/ProfileCreationForm';
import { registerUser } from '@/api'; // Use the main registration function
import { toast } from 'sonner';

const ProfileCreationPage: React.FC = () => {
    const navigate = useNavigate();
    const { handleLoginSuccess } = useAuth(); 
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (data: ProfileCreationData) => {
        setIsSubmitting(true);
        try {
            // Call the main register endpoint
            const authResponse = await registerUser(data);
            
            // Log the user in using the tokens from the response
            handleLoginSuccess(authResponse);
            
            toast.success("Account created successfully!");
            
            // Navigate to the next step in the flow
            navigate('/create-flow/contacts');

        } catch (error: any) {
            const errorData = error.data || {};
            const description = Object.entries(errorData)
                .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                .join('; ');

            toast.error("Failed to create profile", { 
                description: description || "An unknown error occurred. Please try again." 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-12">
            <Card className="bg-foreground text-background">
                <CardHeader>
                    <CardTitle className="text-3xl">Step 1: Create Your Account</CardTitle>
                    <CardDescription className="text-black">
                        Welcome! Let's get your account set up so you can create your first reminder.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileCreationForm initialData={{}} onSubmit={handleFormSubmit} />
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button 
                        size="lg"
                        disabled={isSubmitting}
                        onClick={() => document.getElementById('profile-creation-submit')?.click()}
                    >
                        {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                        Next: Add Contacts
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ProfileCreationPage;