import React from 'react';
import { useForm } from 'react-hook-form';
import type { UserProfile } from '@/types';
import { updateUserProfile } from '@/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField as ShadcnFormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

interface ProfileFormProps {
    profile: UserProfile;
    onProfileUpdate: (updatedProfile: UserProfile) => void;
    isEditing: boolean;
}

type ProfileFormData = Omit<UserProfile, 'id' | 'username'>;

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onProfileUpdate, isEditing }) => {
    const form = useForm<ProfileFormData>({
        defaultValues: {
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            backup_email: profile.backup_email || '',
            facebook_handle: profile.facebook_handle || '',
            instagram_handle: profile.instagram_handle || '',
            snapchat_handle: profile.snapchat_handle || '',
            x_handle: profile.x_handle || '',
        },
    });
    const { handleSubmit, control } = form;

    const onSubmit = async (values: ProfileFormData) => {
        try {
            const updatedProfile = await updateUserProfile(values);
            onProfileUpdate(updatedProfile);
            toast.success("Profile updated successfully.");
            //setIsEditing(false); // This will be handled by parent
        } catch (error: any) {
            const errorData = error.data || {};
            let description = "An unknown error occurred.";
            if (Object.keys(errorData).length > 0) {
                 description = Object.entries(errorData).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('\n');
            }
            toast.error("Update Failed", { description });
        }
    };
    
    return (
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
                 <Button type="submit" id="profile-form-submit" className="hidden" />
            </form>
        </Form>
    );
};
