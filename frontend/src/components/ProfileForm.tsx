import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { UserProfile } from '@/types';
import { updateUserProfile } from '@/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField as ShadcnFormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Spinner } from './ui/spinner';

interface ProfileFormProps {
    profile: UserProfile;
    onProfileUpdate: (updatedProfile: UserProfile) => void;
}

type ProfileFormData = Omit<UserProfile, 'id' | 'username'>;

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onProfileUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    
    const form = useForm<ProfileFormData>({
        defaultValues: {
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            backup_email: profile.backup_email || '',
            backup_phone: profile.backup_phone || '',
            facebook_handle: profile.facebook_handle || '',
            instagram_handle: profile.instagram_handle || '',
            snapchat_handle: profile.snapchat_handle || '',
            x_handle: profile.x_handle || '',
        },
    });
    const { handleSubmit, formState: { isSubmitting }, reset, control } = form;

    const onSubmit = async (values: ProfileFormData) => {
        try {
            const updatedProfile = await updateUserProfile(values);
            onProfileUpdate(updatedProfile);
            toast.success("Profile updated successfully.");
            setIsEditing(false); 
        } catch (error: any) {
            const errorData = error.data || {};
            let description = "An unknown error occurred.";
            if (Object.keys(errorData).length > 0) {
                 description = Object.entries(errorData).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('\n');
            }
            toast.error("Update Failed", { description });
        }
    };
    
    const handleCancel = () => {
        reset({
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            backup_email: profile.backup_email || '',
            backup_phone: profile.backup_phone || '',
            facebook_handle: profile.facebook_handle || '',
            instagram_handle: profile.instagram_handle || '',
            snapchat_handle: profile.snapchat_handle || '',
            x_handle: profile.x_handle || '',
        }); 
        setIsEditing(false);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>Manage your personal information and contact details.</CardDescription>
                </div>
                <div className="flex gap-2">
                    {!isEditing ? (
                        <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={handleCancel} disabled={isSubmitting}>Cancel</Button>
                            <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                                {isSubmitting ? <Spinner className="mr-2 h-4 w-4" /> : null}
                                Save
                            </Button>
                        </>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ShadcnFormField control={control} name="first_name" render={({ field }) => (
                                <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <ShadcnFormField control={control} name="last_name" render={({ field }) => (
                                <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <ShadcnFormField control={control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <ShadcnFormField control={control} name="phone" render={({ field }) => (
                                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} value={field.value || ''} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <h3 className="text-lg font-medium border-t pt-4">Backup Contacts</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <ShadcnFormField control={control} name="backup_email" render={({ field }) => (
                                <FormItem><FormLabel>Backup Email <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel><FormControl><Input {...field} value={field.value || ''} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <ShadcnFormField control={control} name="backup_phone" render={({ field }) => (
                                <FormItem><FormLabel>Backup Phone <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel><FormControl><Input {...field} value={field.value || ''} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <h3 className="text-lg font-medium border-t pt-4">Social Media</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ShadcnFormField control={control} name="facebook_handle" render={({ field }) => (
                                <FormItem><FormLabel>Facebook <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel><FormControl><Input placeholder="your.profile" {...field} value={field.value || ''} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <ShadcnFormField control={control} name="instagram_handle" render={({ field }) => (
                                <FormItem><FormLabel>Instagram <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel><FormControl><Input placeholder="@yourhandle" {...field} value={field.value || ''} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <ShadcnFormField control={control} name="snapchat_handle" render={({ field }) => (
                                <FormItem><FormLabel>Snapchat <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel><FormControl><Input placeholder="yourhandle" {...field} value={field.value || ''} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <ShadcnFormField control={control} name="x_handle" render={({ field }) => (
                                <FormItem><FormLabel>X (Twitter) <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel><FormControl><Input placeholder="@yourhandle" {...field} value={field.value || ''} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
