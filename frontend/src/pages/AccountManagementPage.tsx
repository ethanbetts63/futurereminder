import React, { useState, useEffect } from 'react';
import type { UserProfile, EmergencyContact } from '@/types';
import { getUserProfile, getEmergencyContacts } from '@/api';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import { ProfileForm } from '@/forms/ProfileForm'; 
import { EmergencyContactsManager } from '@/components/EmergencyContactsManager';

const AccountManagementPage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [profileData, contactsData] = await Promise.all([
                getUserProfile(),
                getEmergencyContacts(),
            ]);
            setProfile(profileData);
            setContacts(contactsData);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch account details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleProfileUpdate = (updatedProfile: UserProfile) => {
        setProfile(updatedProfile);
        setIsEditing(false); // Turn off editing mode on successful save
    };
    
    if (loading) {
        return (
            <div className="space-y-8">
                {/* Skeleton for Profile Form */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
                    <div className="space-y-4 p-4 border rounded-lg">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-8 w-1/2" />
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </div>
                 {/* Skeleton for Emergency Contacts */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Emergency Contacts</h2>
                     <div className="p-4 border rounded-lg">
                        <Skeleton className="h-20 w-full" />
                     </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-8">
            {profile && (
                <Card className="bg-foreground text-background">
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                            <CardTitle className="text-2xl">Your Profile</CardTitle>
                            <CardDescription className="text-black">
                                Update your personal information and social media handles. The more contact methods you provide, the more secure your reminder will be.
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                             {!isEditing ? (
                                <Button variant="default" onClick={() => setIsEditing(true)}>Edit</Button>
                            ) : (
                                <>
                                    <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    <Button onClick={() => document.getElementById('profile-form-submit')?.click()}>
                                        Save
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ProfileForm 
                            profile={profile} 
                            onProfileUpdate={handleProfileUpdate} 
                            isEditing={isEditing}
                        />
                    </CardContent>
                </Card>
            )}
            <Card className="bg-foreground text-background">
                <CardHeader>
                    <CardTitle className="text-2xl">Emergency Contacts</CardTitle>
                     <CardDescription className="text-black">
                        This is the list of people we will contact if we cannot reach you. You may have up to 3 contacts. We will only call them as a last resort. It is very important that they have consented to be your emergency contact.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EmergencyContactsManager 
                        initialContacts={contacts} 
                        onContactsChange={setContacts} 
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default AccountManagementPage;