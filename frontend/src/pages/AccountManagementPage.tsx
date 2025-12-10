import React, { useState, useEffect } from 'react';
import type { UserProfile, EmergencyContact } from '@/types';
import { getUserProfile, getEmergencyContacts } from '@/api';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { ProfileForm } from '@/components/ProfileForm'; 
import { EmergencyContactsManager } from '@/components/EmergencyContactsManager';

const AccountManagementPage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        <div className="space-y-12">
            {profile && <ProfileForm profile={profile} onProfileUpdate={setProfile} />}
            <EmergencyContactsManager 
                initialContacts={contacts} 
                onContactsChange={setContacts} 
            />
        </div>
    );
};

export default AccountManagementPage;