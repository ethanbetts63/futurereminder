import React, { useState, useEffect } from 'react';
import type { UserProfile, EmergencyContact } from '@/types';
import { getUserProfile, getEmergencyContacts, deleteAccount } from '@/api';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import { ProfileForm } from '@/forms/ProfileForm'; 
import { EmergencyContactsManager } from '@/components/EmergencyContactsManager';
import Seo from '@/components/Seo';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AccountManagementPage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

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
    
    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setDeleteError(null);
        try {
            await deleteAccount();
            // On successful deletion, the session is invalidated by the backend.
            // We just need to redirect the user to log them out.
            window.location.href = '/'; 
        } catch (err: any) {
            setDeleteError(err.message || 'Failed to delete account. Please try again.');
            setIsDeleting(false);
        }
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
            <Seo title="Manage Account | FutureReminder" />
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

            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                        Be careful! These actions are irreversible.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <p className="font-semibold">Delete Your Account</p>
                        <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back. All of your data, including events and contacts, will be permanently removed.</p>
                    </div>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isDeleting}>
                                {isDeleting ? 'Deleting...' : 'Delete Account'}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove all your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                                    Yes, delete my account
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </CardContent>
                {deleteError && (
                     <CardContent>
                        <Alert variant="destructive">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Deletion Failed</AlertTitle>
                            <AlertDescription>{deleteError}</AlertDescription>
                        </Alert>
                    </CardContent>
                )}
            </Card>
        </div>
    );
};

export default AccountManagementPage;